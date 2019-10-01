window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }

    $(".ban").click(function(event){
        var target_addr = event.target.id;
        var vipstarcoin_address = localStorage.getItem('vipsmarket_address');
        try{
            var result = contract.methods.banAccount(
                            target_addr
                         ).send({
                            from:vipstarcoin_address,
                            gas:3000000,
                            value:10000
                         });
            result.then(
                function(){
                    window.alert("BANに成功しました。");
                    location.href = "http://localhost:8000/user_list/";
                },
                function(){
                    window.alert("BANに失敗しました。");
                }
            );
        }
        catch(e){
            console.error(e);
        }
    });

    $(".ban_cancel").click(function(){
        var target_addr = event.target.id;
        var vipstarcoin_address = localStorage.getItem('vipsmarket_address');
        try{
            var result = contract.methods.bancancelAccount(
                            target_addr
                         ).send({
                            from:vipstarcoin_address,
                            gas:3000000,
                            value:10000
                         });
            result.then(
                function(){
                    window.alert("BANの解除に成功しました。");
                    location.href = "http://localhost:8000/user_list/";
                },
                function(){
                    window.alert("BANの解除に失敗しました。");
                }
            );
        }
        catch(e){
            console.error(e);
        }
    });
});

