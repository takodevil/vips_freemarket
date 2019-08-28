window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    $("#exhibit").click(function(){
        // エラーメッセージ用
        var message = document.getElementById("message");
        message.innerHTML = "";
        // 入力値を読み取って商品データをコントラクト上に登録する
        var product_name = document.getElementById("id_product_name").value;
        var price = document.getElementById("id_price").value;
        var stock = document.getElementById("id_stock").value;
        var description = document.getElementById("id_description").value;
        var image_uri = document.getElementById("id_image_uri").value;
        // アドレスはログインしていればローカルから取れる
        var vipstarcoin_address = localStorage.getItem('vipsmarket_address');

        try{
            var result = contract.methods.exhibit(product_name, price, stock, description, image_uri).send({
                from:vipstarcoin_address,
                gas:3000000
                });
            result.then(
                function(){
                    window.alert("登録に成功しました。")
                    $('#sell_form').submit();
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
    });
});

