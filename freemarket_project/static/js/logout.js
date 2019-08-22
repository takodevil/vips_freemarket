window.addEventListener('DOMContentLoaded', function(){
    $("#logout").click(function(){
        localStorage.removeItem('vipsmarket_address');
        localStorage.removeItem('vipsmarket_name');
        localStorage.removeItem('vipsmarket_email');
    });
    // 開発用
    $("#remove_strage").click(function(){
        localStorage.clear();
    });
});

