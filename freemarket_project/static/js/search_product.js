window.addEventListener('DOMContentLoaded', function(){
    // 未ログインならボタンをdisabledにする
    if (!localStorage.getItem('vipsmarket_address')){
        document.getElementById("id_Search").disabled = true;
        document.getElementById("id_All").disabled = true;
    }
    else {
        document.getElementById("id_Search").disabled = false;
        document.getElementById("id_All").disabled = false;
    }
    $('#id_Search').on("click",function(){
        // 一旦検索ボタンが押されたら検索状態を記憶して再度getさせる
        sessionStorage.setItem('SearchFlag','on');
        sessionStorage.removeItem('ProductsInfo');
        location.href = 'http://localhost:8000/';
    });
    $('#id_All').on("click",function(){
        sessionStorage.removeItem('SearchFlag');
        sessionStorage.removeItem('ProductsInfo');
        location.href = 'http://localhost:8000/';
    });
});