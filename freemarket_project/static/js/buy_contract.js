window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    // エラーメッセージ用
    var message = document.getElementById("message");
    message.innerHTML = "";
    var sellerAddr = document.getElementById("id_sellerAddr").innerHTML;
    var price = document.getElementById("id_price").innerHTML;
    var now = new Date().toLocaleString();
    $("#buy").click(function(){
        // 入力値を読み取って商品データをコントラクト上に登録する
        var stock = document.getElementById("id_stock").innerHTML;
        var ordercount = Number(document.getElementById("id_ordercount").value);
        var amount = Number(ordercount) * Number(price);
        if (stock < ordercount) {
            message.innerHTML = "在庫が不足しています。"
        }
        else if (ordercount <= 0) {
            message.innerHTML = "注文数量には１以上の値を入力してください"
        }
        else {
            // アドレスはログインしていればローカルから取れる
            var vipstarcoin_address = localStorage.getItem('vipsmarket_address');
            // 商品番号を取得
            var product_no = document.getElementById("id_no").innerHTML;
            try{
                var result = web3.eth.sendTransaction({
                    from:vipstarcoin_address,
                    to:sellerAddr,
                    value:amount,
                    gas:3000000
                    });
                result.then(
                    function(receipt){
                        window.alert("購入に成功しました。");
                        // 支払いに成功したトランザクションハッシュを、商品IDと時刻とともにコントラクトに登録する
                        // この時在庫も減少させる
                        contract.methods.registerTransact(
                            receipt["transactionHash"],
                            product_no,
                            price,
                            ordercount,
                            now,
                            vipstarcoin_address,
                            sellerAddr
                            ).send({
                                from:vipstarcoin_address,
                                gas:3000000
                            }).then(
                            function(){
                                sessionStorage.removeItem('ProductsInfo');
                                location.href = 'http://localhost:8000/';
                            }
                        );
                    },
                    function(){
                        message.innerHTML = "購入に失敗しました。";
                    }
                );
            } catch(e){
                // アドレスのチェックサムに引っかかった場合など
                // 場合わけがめんどいので同じメッセージ
                message.innerHTML = "購入に失敗しました。";
            }
        }
    });
});

