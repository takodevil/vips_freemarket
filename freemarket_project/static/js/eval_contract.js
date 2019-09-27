
window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    tx_hash = document.getElementById("tx_hash").value;
    buyertoseller = document.getElementById("buyertoseller").value;
    if(buyertoseller == 'true'){
        buyertoseller = 0;
    }
    else{
        buyertoseller = 1;
    }
    // アドレスはログインしていればローカルから取れる
    var vipstarcoin_address = localStorage.getItem('vipsmarket_address');
    // 現在の評価を取得
    var now_eval = 0;
    contract.methods.get_review(tx_hash, buyertoseller).call({
                    from:vipstarcoin_address,
                    gas:3000000
                 }, function(error,result){
                    console.log(result);
                    // 未評価はevaluationが0
                    if (result[3] != "0"){
                        evaluation = Number(result[3]);
                        comment =  web3.utils.hexToUtf8(result[4]);
                        document.getElementById("rateit0").innerHTML += "現在の評価：";
                        for(var i = 0; i < evaluation; i++){
                            document.getElementById("rateit0").innerHTML += "★";
                        };
                        document.getElementById("comment").innerHTML = comment;
                        now_eval = Number(result[3]);
                    }
                 });

    $("#eval").click(function(){
        // ５段階評価の数値を取得　DOMから現在表示中の値を取得する
        evaluation = document.getElementsByClassName("rateit")[0].children[1].getAttribute("aria-valuenow");
        evaluation = (Number(evaluation) -1);
        comment = document.getElementById("comment").value;
        tx_hash = document.getElementById("tx_hash").value;
        item_id = Number(document.getElementById("item_id").value);
        buyerAddr = document.getElementById("buyerAddr").value;
        sellerAddr = document.getElementById("sellerAddr").value;
        if(comment.length == 0){
            comment = "　"
        }
        comment = web3.utils.utf8ToHex(comment);
        try{
            var result = contract.methods.register_review(
                            tx_hash,
                            buyertoseller,
                            item_id,
                            buyerAddr,
                            sellerAddr,
                            evaluation,
                            comment,
                            now_eval
                         ).send({
                            from:vipstarcoin_address,
                            gas:3000000
                         });
            result.then(
                function(){
                    window.alert("登録に成功しました。");
                    location.href="http://localhost:8000/transact"
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