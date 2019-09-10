window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined')
    {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    // 一回取得したらセッションストレージに保存されている
    var TransactsInfo = sessionStorage.getItem('TransactsInfo');
    // なければコントラクトから取ってくる
    if (TransactsInfo!=null){
        var result_array = [];
        var transaction_count = 0;
        var copy_transaction_count = 0;
        // 商品の全体数を取得しておく
        contract.methods.getTransactcount().call({},
            function(error,result){
                transaction_count = result;
                copy_transaction_count = transaction_count;
            }
        ).then(function(transaction_count){
            for(var i = 0; i<transaction_count; i++){
                // 非同期なので終わる前に次のループに行ってしまう
                // ループ回数が分かっているので消化したらsubmitする
                contract.methods.getTransact(i).call({},
                    function(error,result){
                        result_array.push(result);
                        copy_transaction_count--;
                    }
                ).then(function(){
                    if(copy_transaction_count==0){
                        document.getElementById("Items").value = JSON.stringify(result_array);
                        sessionStorage.setItem('TransactsInfo',JSON.stringify(result_array));
                        $('#getTransacts_form').submit();
                    }
                });
            };
         });
    // あればそのまま返す
    }else{
        document.getElementById("Items").value = TransactsInfo;
        $('#getTransacts_form').submit();
    }
});