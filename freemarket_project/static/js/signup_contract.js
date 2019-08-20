
window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    $("#signup").click(function(){
//        var username = document.getElementById("id_username").value;
//        var email_address = document.getElementById("id_email_address").value;
//        var vipstarcoin_address = document.getElementById("id_vipstarcoin_address").value;
        var vipstarcoin_address = "0x6b5233fff1a914e7019019ebbce16570a1152c44";
//        contract.methods.registerAccount(username,email_address).send({from:vipstarcoin_address,gas:3000000}).then(console.log);
        var result = contract.methods.setMessage('x').send({from:vipstarcoin_address});
        result.then(console.log).then(
            function(){
                $('#signup_form').submit();
            });
 //       setTimeout(
 //           function(){
   //             $('#signup_form').submit();
     //       },
       //     "3000"
   //     );
        });

});

