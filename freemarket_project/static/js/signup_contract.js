
window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    $("#signup").click(function(){
        // 入力値を読み取ってアカウントをコントラクト上に登録する
        var username = document.getElementById("id_username").value;
        var email_address = document.getElementById("id_email_address").value;
        var vipstarcoin_address = document.getElementById("id_vipstarcoin_address").value;
        var result = contract.methods.registerAccount(username,email_address).send({from:vipstarcoin_address,gas:3000000});
        // 成功ならフォームをsubmitする
        result.then(console.log).then(
            function(){
                $('#signup_form').submit();
            });
        });

});

