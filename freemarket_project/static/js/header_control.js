document.getElementById("vipsmarket_name").innerHTML = localStorage.getItem('vipsmarket_name');
document.getElementById("vipsmarket_address").innerHTML = localStorage.getItem('vipsmarket_address');

if (!localStorage.getItem('vipsmarket_address')){
// 未ログイン
    document.getElementById("header_login").style.display="block";
    document.getElementById("header_signup").style.display="block";
    document.getElementById("header_dropdown").style.display="none";
    document.getElementById("header_sell").style.display="none";
    document.getElementById("header_list").style.display="none";
    document.getElementById("header_user").style.display="none";
    document.getElementById("header_transact").style.display="none";
    document.getElementById("header_modify_account").style.display="none";
    document.getElementById("logout").style.display="none";
} else {
// ログイン済
    document.getElementById("header_login").style.display="none";
    document.getElementById("header_signup").style.display="none";
    document.getElementById("header_dropdown").style.display="block";
    document.getElementById("header_sell").style.display="block";
    document.getElementById("header_list").style.display="block";
    document.getElementById("header_user").style.display="block";
    document.getElementById("header_transact").style.display="block";
    document.getElementById("header_modify_account").style.display="block";
    document.getElementById("logout").style.display="block";
}