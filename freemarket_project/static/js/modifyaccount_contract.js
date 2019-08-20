
window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }

    $("#modifyAccount").click(function(){
        var username = document.getElementById("id_username").value;
        var email_address = document.getElementById("id_email_address").value;
        //0xb8508f9c35a79a38e28c3ca5290ee080105da3a9
        var vipstarcoin_address = document.getElementById("id_vipstarcoin_address").value;
        contract.methods.modifyAccount(username,email_address).send({from:vipstarcoin_address,gas:3000000}).then(console.log);
        document.modifyAccount_form.submit();
        });
});

