window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined')
    {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    // 行数とトランザクションハッシュを配列に記録
    var tx_hash_array = [];
    $(".tx_hash").each(function(index, element){
        tx_hash_array[index] = $(element).text();
    });
    var result_array = [];
    var copy_tx_hash_array_count = tx_hash_array.length;
    for(var i = 0; i < tx_hash_array.length; i++){
        // 非同期なので終わる前に次のループに行ってしまう
        // ループ回数が分かっているので消化したらHTMLを上書き
        web3.eth.getTransaction(tx_hash_array[i]).then(function(receipt){
            result_array.push(
                {
                    index:(tx_hash_array.length - copy_tx_hash_array_count),
                    hash:receipt['hash'],
                    from:receipt['from'],
                    to:receipt['to'],
                    value:receipt['value']
                }
            );
            copy_tx_hash_array_count--;
        }).then(function(){
            if(copy_tx_hash_array_count==0){
                for(var i = 0; i< result_array.length; i++){
                    $(".buyerAddr").eq(i).text(result_array[i]["from"]);
                    $(".sellerAddr").eq(i).text(result_array[i]["to"]);
                    $(".amount").eq(i).text(result_array[i]["value"]);
                    // 自分が購入者なら出品者を評価し、出品者なら購入者を評価できるようにする
                    if (localStorage.getItem('vipsmarket_address') == result_array[i]["from"].toLowerCase()){
                        tx_hash = result_array[i]["hash"]
                        item_id = $(".item_id").eq(i).text();
                        buyerAddr = result_array[i]["from"];
                        sellerAddr = result_array[i]["to"];
                        buyertoseller = true;
                        str = '<td class="eval" style="vertical-align:middle;"><a href="eval?tx_hash=' + tx_hash + '&item_id=' + item_id + '&buyerAddr=' + buyerAddr + '&sellerAddr=' + sellerAddr + '&buyertoseller=' + buyertoseller + '">出品者を評価</a></td>'
                        $(".eval").eq(i).replaceWith(str);
                    }else if(localStorage.getItem('vipsmarket_address') == result_array[i]["to"].toLowerCase()){
                        tx_hash = result_array[i]["hash"]
                        item_id = $(".item_id").eq(i).text();
                        buyerAddr = result_array[i]["from"];
                        sellerAddr = result_array[i]["to"];
                        buyertoseller = false;
                        str = '<td class="eval" style="vertical-align:middle;"><a href="eval?tx_hash=' + tx_hash + '&item_id=' + item_id + '&buyerAddr=' + buyerAddr + '&sellerAddr=' + sellerAddr + '&buyertoseller=' + buyertoseller + '">購入者を評価</a></td>'
                        $(".eval").eq(i).replaceWith(str);
                    }
                }
            }
        });
    };
//    $(".buyerAddr").eq(i).text(receipt["from"]);

});
