window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    // エラーメッセージ用
    var message = document.getElementById("message");
    message.innerHTML = "";
    $("#buy").click(function(){
        // 入力値を読み取って商品データをコントラクト上に登録する
        var product_name = document.getElementById("id_product_name").value;
        var price = document.getElementById("id_price").value;
        var stock = document.getElementById("id_stock").value;
        var description = document.getElementById("id_description").value;
        var image_uri = document.getElementById("id_image_uri").value;
        // アドレスはログインしていればローカルから取れる
        var vipstarcoin_address = localStorage.getItem('vipsmarket_address');
        // 商品番号を取得
        var product_no = document.getElementById("id_no").innerHTML;
        try{
            var result = contract.methods.editItem(product_no,product_name, price, stock, description, image_uri).send({
                from:vipstarcoin_address,
                gas:3000000
                });
            result.then(
                function(){
                    window.alert("購入に成功しました。")
                    sessionStorage.removeItem('ProductsInfo');
                    location.href = 'http://localhost:8000/';
                },
                function(){
                    message.innerHTML = "購入に失敗しました。";
                }
            );
        } catch(e){
            // アドレスのチェックサムに引っかかった場合など
            // 場合わけがめんどいので同じメッセージ
            message.innerHTML = "登録に失敗しました。";
        }
    });
    $("#delete").click(function(){
        if(window.confirm('削除してよろしいですか？')){
            // 商品番号を取得
            var product_no = document.getElementById("id_no").innerHTML;
            // アドレスはログインしていればローカルから取れる
            var vipstarcoin_address = localStorage.getItem('vipsmarket_address');
            try{
                var result = contract.methods.removeItem(product_no).send({
                    from:vipstarcoin_address,
                    gas:3000000
                    });
                result.then(
                    function(){
                        window.alert("削除に成功しました。")
                        sessionStorage.removeItem('ProductsInfo');
                        location.href = 'http://localhost:8000/';
                    },
                    function(){
                        message.innerHTML = "削除に失敗しました。";
                    }
                );
            } catch(e){
                console.log(e);
                message.innerHTML = "削除に失敗しました。";
            }

        }
    });
});

