import os
import time
import re
import smtplib
from email.message import EmailMessage

# Dynamically load configuration from .env file
env_vars = {}
try:
    with open(os.path.join(os.path.dirname(__file__), '.env'), 'r') as f:
        for line in f:
            if '=' in line and not line.strip().startswith('#'):
                key, val = line.strip().split('=', 1)
                env_vars[key.strip()] = val.strip().strip('"').strip("'")
except Exception as e:
    print(f"Warning: Could not read .env file: {e}")

LOG_FILE = "error_log"  # Adjust if server uses a different path
ALERT_EMAILS = env_vars.get('ALLOWED_DEVELOPER_EMAILS', 'itsapurb@gmail.com')
SMTP_SERVER = env_vars.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = 465 # SSL port
SMTP_USER = env_vars.get('SMTP_USER', 'cocbhubaneswar@gmail.com')
SMTP_PASS = env_vars.get('SMTP_PASS', '')
MAX_FAILED_ATTEMPTS = 5
TIME_WINDOW = 300  # 5 minutes

def analyze_logs():
    if not os.path.exists(LOG_FILE):
        print("Log file not found. Ensure Apache/PHP error logging is enabled.")
        return

    print("Analyzing logs for suspicious activity...")
    with open(LOG_FILE, 'r') as f:
        logs = f.readlines()

    # Simple anomaly detection: Too many failed logins from a single IP or too many 404s
    ip_counts = {}
    current_time = time.time()
    
    for line in logs:
        # Very basic pattern matching for failed logins or suspicious errors
        if "Failed login" in line or "SQL syntax" in line:
            # Extract IP if possible - depends on log format
            match = re.search(r'client ([\d\.]+)', line)
            if match:
                ip = match.group(1)
                ip_counts[ip] = ip_counts.get(ip, 0) + 1

    alerts = []
    for ip, count in ip_counts.items():
        if count > MAX_FAILED_ATTEMPTS:
            alerts.append(f"Suspicious activity from IP {ip}: {count} flagged events.")

    if alerts:
        send_alert("\n".join(alerts))
        print("Alert triggered.")
    else:
        print("No anomalies detected.")

def send_alert(message):
    try:
        msg = EmailMessage()
        msg.set_content(f"Security Alert:\n\n{message}")
        msg['Subject'] = 'Church Website Security Alert'
        msg['From'] = SMTP_USER
        msg['To'] = ALERT_EMAILS

        # Send using the loaded SMTP credentials
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        print("Alert email sent successfully to:", ALERT_EMAILS)
    except Exception as e:
        print("Failed to send alert email:", str(e))

if __name__ == "__main__":
    analyze_logs()
