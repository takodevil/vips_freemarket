window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined')
    {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    // 一回取得したらセッションストレージに保存されている
    var ProductsInfo = sessionStorage.getItem('ProductsInfo');
    console.log('test');
    // なければコントラクトから取ってくる
    if (ProductsInfo==null){
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
                        // 最後に商品のインデックスを追加しておく
                        result['id'] = numItems-copy_numItems;
                        // 削除済は不要なので除外
                        if (result['0'] != 0x0000000000000000000000000000000000000000){
                            result_array.push(result);
                        }
                        copy_numItems--;
                    }
                ).then(function(){
                    if(copy_numItems==0){
                        // hiddenにセットしてjson文字列に変換してsubmit sessionStorageにも保存しておく
                        document.getElementById("Items").value = JSON.stringify(result_array);
                        sessionStorage.setItem('ProductsInfo',JSON.stringify(result_array));
                        $('#getItems_form').submit();
                    }
                });
            };
         });
    // あればそのまま返す
    }else{
        document.getElementById("Items").value = ProductsInfo;
        console.log(ProductsInfo);
        $('#getItems_form').submit();
    }
});
