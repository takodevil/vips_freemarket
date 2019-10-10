window.addEventListener('DOMContentLoaded', function(){
    // まず現在の値を表示
    document.getElementById("username_now").innerHTML = localStorage.getItem('vipsmarket_name');
    document.getElementById("mailaddress_now").innerHTML = localStorage.getItem('vipsmarket_email');

    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }

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

    $("#modifyAccount").click(function(){
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
            var email_password = document.getElementById("id_email_password").value;
            var shipping_address = document.getElementById("id_shipping_address").value;
            if(shipping_address.length == 0){
                shipping_address = "未登録"
            }
            // アドレスはログインしていればローカルから取れる
            var vipstarcoin_address = localStorage.getItem('vipsmarket_address');
            // POSTしてローカルに保存するためhiddenにセットしておく
            document.getElementById("param_emailpassword").value = email_password;
            document.getElementById("param_shipping_address").value = shipping_address;
            document.getElementById("param_vips_address").value = vipstarcoin_address;
            // メールアドレスとパスワードは必須入力
            if(email_address.length > 0 && email_password.length > 0){
                if(!email_address.endsWith("@gmail.com")){
                    message.innerHTML ='@gmail.comで終わるメールアドレスを入力してください';
                } else {
                    try{
                        var result = contract.methods.modifyAccount(username,email_address).send({
                            from:vipstarcoin_address,
                            gas:3000000
                            });
                        // 自分が持っているアカウントでなければsender account not recognized
                        // ノードが秘密鍵を知っているアカウントからのみトランザクションを送信できる？
                        result.then(
                            function(){
                                window.alert("登録に成功しました。");
                                localStorage.setItem('vipsmarket_name', web3.utils.hexToUtf8(username));
                                localStorage.setItem('vipsmarket_email', email_address);
                                $('#modifyAccount_form').submit();
                            },
                            function(){
                                message.innerHTML = "登録に失敗しました。";
                            }
                        );
                    } catch(e){
                        // アドレスのチェックサムに引っかかった場合など
                        // 場合わけがめんどいので同じメッセージ
                        message.innerHTML = "登録に失敗しました。";
                    }
                 }
            } else {
                message.innerHTML = "未入力の項目があります";
            }
        }
    })
 });

