function Search(){
    // 一旦検索ボタンが押されたら検索状態を記憶して再度getさせる
    sessionStorage.setItem('SearchFlag','on');
    sessionStorage.removeItem('ProductsInfo');
    location.href = 'http://localhost:8000/';
}
function All(){
    sessionStorage.removeItem('SearchFlag');
    sessionStorage.removeItem('ProductsInfo');
    location.href = 'http://localhost:8000/';
}