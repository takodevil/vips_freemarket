window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined')
    {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    var result_array = [];
    var ban_history_count = 0;
    var copy_ban_history_count = 0;
    //履歴数を取得しておく
    contract.methods.getban_history_count().call({},
        function(error,result){
            ban_history_count = result;
            copy_ban_history_count = ban_history_count;
        }
    ).then(function(copy_ban_history_count){
        for(var i = 0; i<copy_ban_history_count; i++){
            // 非同期なので終わる前に次のループに行ってしまう
            // ループ回数が分かっているので消化したらsubmitする
            contract.methods.getban_history(i).call({},
                function(error,result){
                    result_array.push(result);
                    copy_ban_history_count--;
                }
            ).then(function(){
                if(copy_ban_history_count==0){
                        result_array.sort((a, b) => {
                            if (a["3"] > b["3"]) return -1;
                            if (a["3"] < b["3"]) return 1;
                            return 0;
                        });
                    document.getElementById("Items").value = JSON.stringify(result_array);
                    $('#getBan_history_form').submit();
                }
            });
        };
     });

});
