import Crypto.Cipher.AES as AES
from Crypto.Random import get_random_bytes

# 初期化ベクトル（同じ平文でも異なる暗号化文字列にする効果がある）
# バイト列で16バイト固定
iv = b'0123456789abcdef'

#暗号化
#引数：暗号化対象の文字列
#戻り値：暗号化した文字列と秘密鍵のタプル
def Encrypt(str):
    #秘密鍵を用意する
    #AES暗号化では鍵は16バイト、24バイト、32バイトのどれか
    key = get_random_bytes(32)
    #暗号化したいデータ　16バイトの倍数にする必要があるのでパディングする
    message = str
    #pycryptdomeではバイト列に変換しなければならない
    message = message.encode('utf-8')
    #16の倍数でなければ16の倍数になるまで空白のバイト列を追記する
    if len(message) % 16 != 0:
        padding_message = message
        for i in range(16 - (len(message) % 16)):
            padding_message += b' '
    #16の倍数ならばそのまま
    else:
        padding_message = message
    # AES-CBC モードで暗号化
    aes = AES.new(key, AES.MODE_CBC, iv)
    encrypted_str = aes.encrypt(padding_message)
    return encrypted_str,key

#復号
#引数：暗号化した文字列と秘密鍵
def Decrypt(crypted_str,key):
    #オブジェクトは使いまわしできないので再度作成
    aes = AES.new(key, AES.MODE_CBC, iv)
    #復号　パディングの戻し　元々utf-8でencodeされているのでこちらもdecodeする
    data = aes.decrypt(crypted_str).rstrip().decode('utf-8')
    return data