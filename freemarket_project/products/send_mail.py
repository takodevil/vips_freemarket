import smtplib
import ssl
from email.mime.text import MIMEText

class send_mail():
    def __init__(self, params):
        account = params["buyer_mail"]
        password = params["emailpassword"]

        # MIMEの作成
        if params["apply_flag"] == "1":
            subject = "【vipstarcoin_market】事前確認メール"
            message = """購入者から事前確認メールが送信されました。（まだ購入されていません）
            購入者に返信して以降の取引を進めてください。
            ================================================"""
        else:
            subject = "【vipstarcoin_market】購入通知メール"
            message = """商品が購入されました。
            以降の取引を進めてください。
            ================================================"""

        message += "\n出品者アドレス: " + params["buyer_addr"]
        message += "\n出品者名: " + params["buyer_name"]
        message += "\n出品者住所: " + params["shipping_address"]
        message += "\n商品番号: " + params["product_no"]
        message += "\n商品名: " + params["product_name"]
        message += "\n注文数: " + params["ordercount"]
        message += "\n価格: " + params["product_price"]
        message += "\n在庫: " + params["product_stock"]
        message += "\n説明: " + params["product_description"]

        msg = MIMEText(message, "html")
        msg["Subject"] = subject
        msg["To"] = account
        msg["From"] = account

        host = "smtp.gmail.com"
        server = smtplib.SMTP_SSL(host, 465, context=ssl.create_default_context())

        server.login(account, password)
        server.send_message(msg)
        server.quit()
