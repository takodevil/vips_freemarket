window.addEventListener('DOMContentLoaded', function(){
    document.getElementById("username_now").innerHTML = localStorage.getItem('vipsmarket_name');
    document.getElementById("mailaddress_now").innerHTML = localStorage.getItem('vipsmarket_email');
    document.getElementById("vipsaddress_now").innerHTML = localStorage.getItem('vipsmarket_address');

    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    $("#modifyAccount").click(function(){
        // 入力値を読み取ってアカウントをコントラクト上に登録する
        var username = document.getElementById("id_username").value;
        var email_address = document.getElementById("id_email_address").value;
        var vipstarcoin_address = document.getElementById("id_vipstarcoin_address").value;
        var result = contract.methods.registerAccount(username,email_address).send({from:vipstarcoin_address,gas:3000000});
        // 成功ならフォームをsubmitする
        result.then(console.log).then(
            function(){
                $('#modifyAccount_form').submit();
            });
        });

});

