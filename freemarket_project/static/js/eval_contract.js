
window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }

    $("#eval").click(function(){
        // ５段階評価の数値を取得　DOMから現在表示中の値を取得する
        evaluation = document.getElementsByClassName("rateit")[0].children[1].getAttribute("aria-valuenow");
        evaluation = (Number(evaluation) -1);
        comment = document.getElementById("comment").value;
        tx_hash = document.getElementById("tx_hash").value;
        item_id = document.getElementById("item_id").value;
        buyerAddr = document.getElementById("buyerAddr").value;
        sellerAddr = document.getElementById("sellerAddr").value;
        buyertoseller = document.getElementById("buyertoseller").value;
        if(comment.length == 0){
            comment = "　"
        }
        comment = web3.utils.utf8ToHex(comment);
        // アドレスはログインしていればローカルから取れる
        var vipstarcoin_address = localStorage.getItem('vipsmarket_address');
        try{
            var result = contract.methods.register_review(tx_hash, item_id, buyerAddr, sellerAddr, buyertoseller, evaluation, comment).send({
                from:vipstarcoin_address,
                gas:3000000
                });
            result.then(
                function(){
                    window.alert("登録に成功しました。");
                    $('#eval_form').submit();
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