window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined')
    {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    var result_array = [];
    var user_count = 0;
    var copy_user_count = 0;

    // ユーザ数を取得しておく
    contract.methods.getusercounts().call({},
        function(error,result){
            user_count = result;
            copy_user_count = user_count;
        }
    ).then(function(copy_user_count){
        for(var i = 0; i<copy_user_count; i++){
            // 非同期なので終わる前に次のループに行ってしまう
            // ループ回数が分かっているので消化したらsubmitする
            contract.methods.getAccount_byid(i).call({},
                function(error,result){
                    result["1"] = web3.utils.hexToUtf8(result["1"]);
                    result["avg_eval"] = Math.round((Number(result["5"]) / Number(result["4"])) * 10) / 10;
                    if(isNaN(result["avg_eval"]) || !isFinite(result["avg_eval"])){
                        result["avg_eval"] = "未評価";
                    }
                    result_array.push(result);
                    copy_user_count--;
                }
            ).then(function(){
                if(copy_user_count==0){
                    document.getElementById("Items").value = JSON.stringify(result_array);
                    $('#getUsers_form').submit();
                }
            });
        };
     });

});
