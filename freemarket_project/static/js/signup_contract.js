window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    // エラーメッセージ用
    var message = document.getElementById("message");
    message.innerHTML = "";

    $("#id_mailtest").click(function(){
        var email_address = document.getElementById("id_email_address").value;
        var email_password = document.getElementById("id_email_password").value;
        if(email_address.length > 0 && email_password.length > 0){
            if(!email_address.endsWith("@gmail.com")){
                message.innerHTML ='@gmail.comで終わるメールアドレスを入力してください';
            } else {
                // 入力値をメールテスト用のフォームにコピーしておく
                document.getElementById("id_test_emailaddress").value = email_address;
                document.getElementById("id_test_emailpassword").value = email_password;
                // targetがiframeなのでsubmitしても画面遷移しないがpythonで処理できる
                $("#mailtest_form").submit()
                $("#mailtest_form")[0].reset()
                return false
            }
        }
        else{
            message.innerHTML ='gmailアドレスとパスワードを入力してください';
        }
    });
    $("#signup").click(function(){
        // メールアドレスの確認が終わっているか確認
        // かなり強引
        var doc = document.getElementsByTagName("iframe")[0].contentDocument;
        if(doc.body.innerHTML != 'メールを送信しました。受信できていることを確認してOKボタンを押してください'){
            message.innerHTML = 'メールアドレスの確認を行なってください'
        }
        else{
            // 入力値を読み取ってアカウントをコントラクト上に登録する
            var username = document.getElementById("id_username").value;
            if(username.length == 0){
                username = "名無し"
            }
            // 日本語入力対策
            username = web3.utils.utf8ToHex(username);
            var email_address = document.getElementById("id_email_address").value;
            var vipstarcoin_address = document.getElementById("id_vipstarcoin_address").value;
            var email_password = document.getElementById("id_email_password").value;
            var shipping_address = document.getElementById("id_shipping_address").value;
            if(shipping_address.length == 0){
                shipping_address = "未登録"
            }
            // POSTしてローカルに保存するためhiddenにセットしておく
            document.getElementById("param_emailpassword").value = email_password;
            document.getElementById("param_shipping_address").value = shipping_address;
            document.getElementById("param_vips_address").value = vipstarcoin_address;
            console.log(document.getElementById("param_shipping_address").value);
            // メールアドレスとパスワードとVIPSアドレスは必須入力
            if(email_address.length > 0 && email_password.length > 0 && vipstarcoin_address.length > 0){
                if(!email_address.endsWith("@gmail.com")){
                    message.innerHTML ='@gmail.comで終わるメールアドレスを入力してください';
                } else {
                    try{
                        var result = contract.methods.registerAccount(username,email_address).send({
                            from:vipstarcoin_address,
                            gas:3000000,
                            value:10000
                            });
                        // 自分が持っているアカウントでなければsender account not recognized
                        // ノードが秘密鍵を知っているアカウントからのみトランザクションを送信できる
                        result.then(
                            function(){
                                window.alert("登録に成功しました。ログインしてください。")
                                $('#signup_form').submit();
                            },
                            function(){
                                message.innerHTML = "登録に失敗しました。";
                            }
                        );
                    } catch(e){
                        // アドレスのチェックサムに引っかかった場合など
                        // 場合わけがめんどいので同じメッセージ
                        console.log('test');
                        message.innerHTML = "登録に失敗しました。";
                    }
                }
            } else {
                message.innerHTML = "未入力の項目があります";
            }
         }
    });
});