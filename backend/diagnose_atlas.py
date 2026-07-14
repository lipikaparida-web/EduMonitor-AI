import os
import socket
import ssl
from urllib.parse import parse_qs, urlparse

import certifi
import dns.resolver
from dotenv import load_dotenv
from urllib.request import urlopen

from config.database import client, ping_mongo


def safe_print(label, value):
    print(f"{label}: {value}")


def get_public_ip():
    try:
        with urlopen("https://api.ipify.org", timeout=10) as response:
            return response.read().decode("utf-8").strip()
    except Exception as exc:
        return f"unavailable ({type(exc).__name__}: {exc})"


def main():
    load_dotenv()
    uri = os.getenv("MONGO_URI", "")
    parsed = urlparse(uri)

    safe_print("public_ip", get_public_ip())
    safe_print("uri_scheme", parsed.scheme)
    safe_print("cluster_host", parsed.hostname)
    safe_print("username_present", bool(parsed.username))
    safe_print("password_present", bool(parsed.password))
    safe_print("database", parsed.path.lstrip("/") or "<none>")
    safe_print("query_keys", sorted(parse_qs(parsed.query).keys()))
    safe_print("certifi", certifi.where())
    safe_print("openssl", ssl.OPENSSL_VERSION)

    if parsed.scheme != "mongodb+srv":
        safe_print("uri_warning", "Expected mongodb+srv for Atlas SRV connection")

    if not parsed.hostname:
        safe_print("fatal", "MONGO_URI host is missing")
        return

    srv_name = f"_mongodb._tcp.{parsed.hostname}"
    try:
        srv_records = dns.resolver.resolve(srv_name, "SRV")
        targets = [(str(record.target).rstrip("."), int(record.port)) for record in srv_records]
        safe_print("srv_targets", targets)
    except Exception as exc:
        safe_print("srv_error", f"{type(exc).__name__}: {exc}")
        return

    try:
        txt_records = [str(record) for record in dns.resolver.resolve(parsed.hostname, "TXT")]
        safe_print("txt_records", txt_records)
    except Exception as exc:
        safe_print("txt_error", f"{type(exc).__name__}: {exc}")

    context = ssl.create_default_context(cafile=certifi.where())
    for target, port in targets:
        safe_print("target", f"{target}:{port}")
        try:
            addresses = socket.getaddrinfo(target, port, type=socket.SOCK_STREAM)
            safe_print("address_count", len(addresses))
            safe_print("first_address", addresses[0][4][0])
        except Exception as exc:
            safe_print("dns_host_error", f"{type(exc).__name__}: {exc}")
            continue

        try:
            raw_socket = socket.create_connection((target, port), timeout=10)
            safe_print("tcp", "ok")
            tls_socket = context.wrap_socket(raw_socket, server_hostname=target)
            safe_print("tls", f"ok {tls_socket.version()} {tls_socket.cipher()[0]}")
            tls_socket.close()
        except Exception as exc:
            safe_print("tls_error", f"{type(exc).__name__}: {exc}")

    try:
        ping_mongo()
        safe_print("pymongo_ping", "ok")
        safe_print("pymongo_client_id", id(client))
    except Exception as exc:
        safe_print("pymongo_ping_error", f"{type(exc).__name__}: {exc}")


if __name__ == "__main__":
    main()
