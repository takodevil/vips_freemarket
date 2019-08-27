window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    // 商品の全体数を取得する
    contract.methods.getnumItems().call({
        },
        function(error,result){
            // 商品数分getItemする
            console.log(result);
            for(var i = 0; i<result; i++){
                contract.methods.getItem(i).call({
                },
                function(error,result){
                    console.log(result);
                })
            }
        }
    );
});

