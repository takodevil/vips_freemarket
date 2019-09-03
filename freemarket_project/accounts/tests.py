from django.test import TestCase
import json
from selenium import webdriver
from bs4 import BeautifulSoup
import sys, io

class ProductTest1(TestCase):
    def test1(self):
        print('test')
#        response = self.client.get('http://localhost:8000')
#        print(response)
        # UTF8にエンコード
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

        # ブラウザを操作するオブジェクトの生成 chromedriverは事前にダウンロードしておく
        driver = webdriver.Chrome('C:\chromedriver\chromedriver')
        # 指定したURLへの移動
        driver.get("http://localhost:8000")
        # ページのHTMLを取得
        html = driver.page_source
        driver.close()
        bs = BeautifulSoup(html, "lxml")
        print(bs)