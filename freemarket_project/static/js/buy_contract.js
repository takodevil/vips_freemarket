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
    $("#buy").click(function(){
        // 入力値を読み取って商品データをコントラクト上に登録する
        var stock = document.getElementById("id_stock").innerHTML;
        var ordercount = document.getElementById("id_ordercount").value;
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
                    value:1000000,
                    gas:3000000
                    });
                result.then(
                    function(receipt){
                        window.alert("購入に成功しました。");
                        // 支払いに成功したトランザクションハッシュをコントラクトに登録する？
                        web3.eth.getTransaction(receipt["transactionHash"]).then(
                            function(receipt){
                                console.log(receipt["from"]);
                                console.log(receipt["to"]);
                                console.log(receipt["value"]);
                            }
                        );
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
                message.innerHTML = "購入に失敗しました。";
            }
        }
    });
});

