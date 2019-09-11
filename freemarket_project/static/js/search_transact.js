window.addEventListener('DOMContentLoaded', function(){
    // 未ログインならボタンをdisabledにする
    if (!localStorage.getItem('vipsmarket_address')){
        document.getElementById("id_Search").disabled = true;
        document.getElementById("id_Search_2").disabled = true;
        document.getElementById("id_All").disabled = true;
    }
    else {
        document.getElementById("id_Search").disabled = false;
        document.getElementById("id_Search_2").disabled = false;
        document.getElementById("id_All").disabled = false;
    }
    $('#id_Search').on("click",function(){
        // 一旦検索ボタンが押されたら検索状態を記憶して再度getさせる
        sessionStorage.removeItem('Seller_SearchFlag');
        sessionStorage.setItem('Buyer_SearchFlag','on');
        location.href = 'http://localhost:8000/transact';
    });
    $('#id_Search_2').on("click",function(){
        sessionStorage.removeItem('Buyer_SearchFlag');
        sessionStorage.setItem('Seller_SearchFlag','on');
        location.href = 'http://localhost:8000/transact';
    });
    $('#id_All').on("click",function(){
        sessionStorage.removeItem('Buyer_SearchFlag');
        sessionStorage.removeItem('Seller_SearchFlag');
        location.href = 'http://localhost:8000/transact';
    });
});