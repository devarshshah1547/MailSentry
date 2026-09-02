import email
from email.message import Message
from email.utils import parseaddr
import re
import ipaddress
from typing import List
from pydantic import BaseModel


class ParsedEmail(BaseModel):
    # Raw extracted headers
    raw_from: str = ""
    raw_to: str = ""
    raw_subject: str = ""
    raw_reply_to: str = ""
    raw_return_path: str = ""
    raw_message_id: str = ""
    received_headers: List[str] = []
    auth_results: List[str] = []
    received_spf: List[str] = []
    dkim_signatures: List[str] = []

    # Normalized identity
    from_name: str = ""
    from_email: str = ""
    from_domain: str = ""

    reply_to_email: str = ""
    reply_to_domain: str = ""

    return_path_email: str = ""
    return_path_domain: str = ""

    subject: str = ""
    body: str = ""

    # Extracted indicators
    urls: List[str] = []
    # IPs extracted from received headers
    received_ips: List[str] = []


def extract_domain(email_addr: str) -> str:
    if not email_addr or "@" not in email_addr:
        return ""
    return email_addr.split("@")[-1].strip().lower()


def extract_urls(text: str) -> List[str]:
    if not text:
        return []
    # Basic URL regex looking for http/https or www
    url_pattern = re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+')
    return list(set(url_pattern.findall(text)))


def extract_ipv4s(text: str) -> List[str]:
    ip_pattern = re.compile(r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b")
    ips = ip_pattern.findall(text)
    valid_ips = []
    for ip_str in ips:
        try:
            ip = ipaddress.IPv4Address(ip_str)
            valid_ips.append(str(ip))
        except ValueError:
            pass
    return valid_ips


def parse_raw_email(raw_content: str) -> ParsedEmail:
    msg: Message = email.message_from_string(raw_content)
    result = ParsedEmail()

    # Safely extract headers (missing headers return "")
    result.raw_from = str(msg.get("From", ""))
    result.raw_to = str(msg.get("To", ""))
    result.raw_subject = str(msg.get("Subject", ""))
    result.raw_reply_to = str(msg.get("Reply-To", ""))

    # Handle Return-Path, which might contain <> around the address
    rp_header = str(msg.get("Return-Path", ""))
    result.raw_return_path = rp_header
    result.raw_message_id = str(msg.get("Message-ID", ""))

    result.subject = result.raw_subject

    # Lists of headers
    result.received_headers = [str(v) for v in msg.get_all("Received", [])]
    result.auth_results = [str(v) for v in msg.get_all("Authentication-Results", [])]
    result.received_spf = [str(v) for v in msg.get_all("Received-SPF", [])]
    result.dkim_signatures = [str(v) for v in msg.get_all("DKIM-Signature", [])]

    # Parse identities
    from_name, from_email = parseaddr(result.raw_from)
    result.from_name = from_name.strip()
    result.from_email = from_email.strip().lower()
    result.from_domain = extract_domain(result.from_email)

    _, reply_email = parseaddr(result.raw_reply_to)
    result.reply_to_email = reply_email.strip().lower()
    result.reply_to_domain = extract_domain(result.reply_to_email)

    # Clean <> for return path parsing
    clean_rp = rp_header.strip().strip("<>")
    _, return_email = parseaddr(clean_rp if "@" in clean_rp else rp_header)
    result.return_path_email = return_email.strip().lower()
    if not result.return_path_email and clean_rp and "@" in clean_rp:
        # Fallback if parseaddr failed
        result.return_path_email = clean_rp.lower()
    result.return_path_domain = extract_domain(result.return_path_email)

    # Extract body content
    body_parts = []
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))
            if (
                content_type in ("text/plain", "text/html")
                and "attachment" not in content_disposition
            ):
                payload = part.get_payload(decode=True)
                if payload:
                    try:
                        body_parts.append(
                            payload.decode(
                                part.get_content_charset() or "utf-8", errors="ignore"
                            )
                        )
                    except Exception:
                        pass
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            try:
                body_parts.append(
                    payload.decode(
                        msg.get_content_charset() or "utf-8", errors="ignore"
                    )
                )
            except Exception:
                pass

    result.body = "\n".join(body_parts)
    if not result.body and not msg.is_multipart() and not msg.keys():
        # Fallback for completely malformed email where everything is just body
        result.body = raw_content

    result.urls = extract_urls(result.body)

    # Extract IPs from Received headers
    for header in result.received_headers:
        ips = extract_ipv4s(header)
        for ip in ips:
            if ip not in result.received_ips:
                result.received_ips.append(ip)

    return result
