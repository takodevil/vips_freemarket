window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    $("#login").click(function(){
            // エラーメッセージ用
            var message = document.getElementById("message");
            // コントラクトからの抽出データ保存用
            var vips_address_oncontract;
            var name;
            var email;
            // 入力したvipsアドレスを送信元にしてチェーン上にアドレスがあるか確認
            var vipstarcoin_address = document.getElementById("id_vipstarcoin_address").value;
            if(vipstarcoin_address.length > 0){
                try {
                    contract.methods.getAccount().call({
                        from:vipstarcoin_address,
                        gas:3000000
                    },function(error, result){
                        // コントラクトに登録済ならアドレスが戻ってくる
                        if (typeof result != 'undefined'){
                            // getAccountの戻り値を保存
                            // なぜか大文字小文字が入力時とばらばらになるので小文字で統一
                            vips_address_oncontract = result[0].toLowerCase();
                            name = result[1];
                            email = result[2];
                            console.log(vips_address_oncontract);
                            console.log(name);
                            console.log(email);
                        };
                        vipstarcoin_address = vipstarcoin_address.toLowerCase();
                        // ログイン
                        // 入力したアドレスとチェーン上のアドレスが一致したら登録済なのでログイン
                        if (vips_address_oncontract == vipstarcoin_address){
                            // 取得した値をlocalStorageに保持する　ログアウトするときに消す
                            if (!localStorage.getItem('vipsmarket_address')){
                                console.log('ブラウザにアドレス未保存');
                                localStorage.setItem('vipsmarket_address', vipstarcoin_address);
                                localStorage.setItem('vipsmarket_name', name);
                                localStorage.setItem('vipsmarket_email', email);
                            }
                            else{
                                console.log('ブラウザにアドレス保存済み');
                            }
                            // 最後にsubmit
                            window.alert("ログインに成功しました");
                            $('#login_form').submit();
                        }
                        else {
                            message.innerHTML = "未登録のアドレスです";
                        }
                    });
                } catch(e){
                    // アドレスのチェックサムに引っかかった場合
                    message.innerHTML = "アドレスを正しく入力してください";
                }
            } else{
                message.innerHTML = "アドレスを入力してください";
            }
    });
});

