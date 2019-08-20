
window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    $("#login").click(function(){
        // 入力したvipsアドレスを送信元にする
//        var vipstarcoin_address = document.getElementById("id_vipstarcoin_address").value;
//        contract.methods.getAccount().call({from:vipstarcoin_address,gas:3000000}).then(console.log);
        //contract.methods.getAccount().call().then(console.log);
//        contract.methods.getMessage().call().then(console.log);
        var result = contract.methods.getMessage().call();
        result.then(console.log).then(
            function(){
                $('#login_form').submit();
            });
//        $('#login_form').submit();
        });

});

