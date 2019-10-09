window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined')
    {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    var result_array = [];
    var transaction_count = 0;
    var copy_transaction_count = 0;
    // 取引の全体数を取得しておく
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
                    // 検索フラグがONの場合はデータをフィルタする
                    if (sessionStorage.getItem('Buyer_SearchFlag') == 'on'){
                        if(result['5'].toLowerCase() == localStorage.getItem('vipsmarket_address').toLowerCase()){
                            result_array.push(result);
                        }
                    }else if(sessionStorage.getItem('Seller_SearchFlag') == 'on'){
                        if(result['6'].toLowerCase() == localStorage.getItem('vipsmarket_address').toLowerCase()){
                            result_array.push(result);
                        }
                    }
                    else{
                        result_array.push(result);
                    }
                    copy_transaction_count--;
                }
            ).then(function(){
                if(copy_transaction_count==0){
                    // 注文日時の降順（新しいもの順）でソートする
                    result_array.sort((a, b) => {
                        if (a["4"] > b["4"]) return -1;
                        if (a["4"] < b["4"]) return 1;
                        return 0;
                    });
                    document.getElementById("Items").value = JSON.stringify(result_array);
                    $('#getTransacts_form').submit();
                }
            });
        };
     });
});
