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
    $("#apply").click(function(){
        var stock = document.getElementById("id_stock").innerHTML;
        var ordercount = Number(document.getElementById("id_ordercount").value);
        if (stock < ordercount) {
            message.innerHTML = "在庫が不足しています。"
        }
        else if (ordercount <= 0) {
            message.innerHTML = "注文数量には１以上の値を入力してください"
        }
        else if (!Number.isInteger(ordercount)){
            message.innerHTML = "注文数量には整数を入力してください"
        }
        else {
            if(confirm("出品者に事前確認メールを送信します。本当によろしいですか？")){

               // 事前確認のボタン　メール送信するためのパラメータを詰め込んでPOSTする
                contract.methods.getAccount(sellerAddr).call({},
                    function(error,result){
                        // 事前確認であることのフラグ
                        document.getElementById("param_apply_flag").value = "1";
                        // 出品者情報
                        document.getElementById("param_seller_addr").value = result[0];
                        document.getElementById("param_seller_name").value = web3.utils.hexToUtf8(result[1]);
                        document.getElementById("param_seller_mail").value = result[2];
                        // 購入者情報
                        document.getElementById("param_buyer_addr").value = localStorage.getItem('vipsmarket_address');
                        document.getElementById("param_buyer_name").value = localStorage.getItem('vipsmarket_name');
                        document.getElementById("param_buyer_mail").value = localStorage.getItem('vipsmarket_email');
                        // 商品情報
                        document.getElementById("param_product_no").value = document.getElementById("id_no").innerHTML;
                        document.getElementById("param_product_name").value = document.getElementById("id_product").innerHTML;
                        document.getElementById("param_product_price").value = document.getElementById("id_price").innerHTML;
                        document.getElementById("param_product_stock").value = document.getElementById("id_stock").innerHTML;
                        document.getElementById("param_product_description").value =  document.getElementById("id_description").innerHTML;
                        // 注文数量
                        document.getElementById("param_ordercount").value = Number(document.getElementById("id_ordercount").value);
                    }
                ).then(function(){
                    $('#buy_form').submit();
                });
             }
         }
    });
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
        else if (!Number.isInteger(ordercount)){
            message.innerHTML = "注文数量には整数を入力してください"
        }
        else {
            if(confirm(amount + "VIPS送金されます。本当に注文してもよろしいですか？")){
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
                            window.alert("注文に成功しました。");
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
                                    // メール送信
                                    contract.methods.getAccount(sellerAddr).call({},
                                        function(error,result){
                                            // 注文であることのフラグ
                                            document.getElementById("param_apply_flag").value = "0";
                                            // 出品者情報
                                            document.getElementById("param_seller_addr").value = result[0];
                                            document.getElementById("param_seller_name").value = web3.utils.hexToUtf8(result[1]);
                                            document.getElementById("param_seller_mail").value = result[2];
                                            // 購入者情報
                                            document.getElementById("param_buyer_addr").value = localStorage.getItem('vipsmarket_address');
                                            document.getElementById("param_buyer_name").value = localStorage.getItem('vipsmarket_name');
                                            document.getElementById("param_buyer_mail").value = localStorage.getItem('vipsmarket_email');
                                            // 商品情報
                                            document.getElementById("param_product_no").value = document.getElementById("id_no").innerHTML;
                                            document.getElementById("param_product_name").value = document.getElementById("id_product").innerHTML;
                                            document.getElementById("param_product_price").value = document.getElementById("id_price").innerHTML;
                                            document.getElementById("param_product_stock").value = document.getElementById("id_stock").innerHTML;
                                            document.getElementById("param_product_description").value =  document.getElementById("id_description").innerHTML;
                                            // 注文数量
                                            document.getElementById("param_ordercount").value = Number(document.getElementById("id_ordercount").value);
                                        }
                                    ).then(function(){
                                        $('#buy_form').submit();
                                    });
                                }
                            );
                        },
                        function(){
                            message.innerHTML = "注文に失敗しました。";
                        }
                    );
                } catch(e){
                    // アドレスのチェックサムに引っかかった場合など
                    // 場合わけがめんどいので同じメッセージ
                    message.innerHTML = "注文に失敗しました。";
                }
            }
        }
    });
});

