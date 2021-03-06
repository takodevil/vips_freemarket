
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
    // 自分は取引に関係ない第３者か？
    var other_flag = 0;
    if (vipstarcoin_address.toLowerCase() != document.getElementById("buyerAddr").value.toLowerCase() && vipstarcoin_address.toLowerCase() != document.getElementById("sellerAddr").value.toLowerCase()){
        other_flag = 1;
    }
    if (other_flag == 1){
         $("#eval").hide();
         $("#rateit1").hide();
         $("#label1").text("出品者⇒購入者への評価");
         $("#label2").text("出品者⇒購入者へのコメント");
         $("#label3").text("購入者⇒出品者への評価");
         $("#label4").text("購入者⇒出品者へのコメント");
　       $("#comment").attr('readonly',true);
　       $("#comment2").attr('readonly',true);
    }
    // 現在の評価を取得
    var now_eval = 0;
    // 自分の相手に対する評価
    contract.methods.get_review(tx_hash, buyertoseller).call({
                    from:vipstarcoin_address,
                    gas:3000000
                 }, function(error,result){
                    console.log(result);
                    // 未評価はevaluationが0
                    if (result[3] != "0"){
                        evaluation = Number(result[3]);
                        comment =  web3.utils.hexToUtf8(result[4]);
                        if (other_flag == 0){
                            document.getElementById("rateit0").innerHTML += "現在の評価：";
                        }
                        for(var i = 0; i < evaluation; i++){
                            document.getElementById("rateit0").innerHTML += "★";
                        };
                        document.getElementById("comment").innerHTML = comment;
                        now_eval = Number(result[3]);
                    }
                 });
    // 相手の自分に対する評価
    // フラグ反転
    if(buyertoseller == 0){
        buyertoseller = 1;
    }
    else{
        buyertoseller = 0;
    }
    contract.methods.get_review(tx_hash, buyertoseller).call({
                    from:vipstarcoin_address,
                    gas:3000000
                 }, function(error,result){
                    console.log(result);
                    // 未評価はevaluationが0
                    if (result[3] != "0"){
                        evaluation = Number(result[3]);
                        comment =  web3.utils.hexToUtf8(result[4]);
                        for(var i = 0; i < evaluation; i++){
                            document.getElementById("rateit2").innerHTML += "★";
                        };
                        document.getElementById("comment2").innerHTML = comment;
                        now_eval = Number(result[3]);
                    }
                 });
    // 元に戻す
    if(buyertoseller == 0){
        buyertoseller = 1;
    }
    else{
        buyertoseller = 0;
    }

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