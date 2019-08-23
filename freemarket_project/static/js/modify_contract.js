window.addEventListener('DOMContentLoaded', function(){
    // まず現在の値を表示
    document.getElementById("username_now").innerHTML = localStorage.getItem('vipsmarket_name');
    document.getElementById("mailaddress_now").innerHTML = localStorage.getItem('vipsmarket_email');

    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    $("#modifyAccount").click(function(){
        // 入力値を読み取ってアカウントをコントラクト上に登録する
        var username = document.getElementById("id_username").value;
        var email_address = document.getElementById("id_email_address").value;
        // アドレスはログインしていればローカルから取れる
        var vipstarcoin_address = localStorage.getItem('vipsmarket_address');
        if(username.length > 0 && email_address.length > 0){
            try{
                var result = contract.methods.modifyAccount(username,email_address).send({
                    from:vipstarcoin_address,
                    gas:3000000
                    });
                // 自分が持っているアカウントでなければsender account not recognized
                // ノードが秘密鍵を知っているアカウントからのみトランザクションを送信できる？
                result.then(
                    function(){
                        localStorage.setItem('vipsmarket_name', username);
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
        } else {
            message.innerHTML = "未入力の項目があります";
        }
    })
 });

