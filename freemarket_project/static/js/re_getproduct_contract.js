window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined')
    {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    // getproduct_contractと異なり、強制的にコントラクトから再取得させる
    var result_array = [];
    var numItems = 0;
    var copy_numItems = 0;
    // 商品の全体数を取得しておく
    contract.methods.getnumItems().call({},
        function(error,result){
            numItems = result;
            copy_numItems = numItems;
        }
    ).then(function(numItems){
        for(var i = 0; i<numItems; i++){
            // 非同期なので終わる前に次のループに行ってしまう
            // ループ回数が分かっているので消化したらsubmitする
            contract.methods.getItem(i).call({},
                function(error,result){
                    result_array.push(result);
                    copy_numItems--;
                }
            ).then(function(){
                if(copy_numItems==0){
                    console.log(result_array);
                    // hiddenにセットしてjson文字列に変換してsubmit sessionStorageにも保存しておく
                    document.getElementById("Items").value = JSON.stringify(result_array);
                    sessionStorage.setItem('ProductsInfo',JSON.stringify(result_array));
                    $('#getItems_form').submit();
                }
            });
        };
     });
});
