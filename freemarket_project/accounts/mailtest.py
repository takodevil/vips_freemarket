import smtplib
import ssl
from email.mime.text import MIMEText

class mailtest():
    def __init__(self, test_emailaddress, test_emailpassword):
        account = test_emailaddress
        password = test_emailpassword

        # MIMEの作成
        subject = "【vipstarcoin_market】メール送信テスト"
        message = "メール送信テストに成功しました"
        msg = MIMEText(message, "plain")
        msg["Subject"] = subject
        msg["To"] = account
        msg["From"] = account

        host = "smtp.gmail.com"
        server = smtplib.SMTP_SSL(host, 465, context=ssl.create_default_context())

        server.login(account, password)
        server.send_message(msg)
        server.quit()
