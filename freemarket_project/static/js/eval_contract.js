window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    $('#star_field').raty({
        target: '#star_input',
        targetType: 'number',
        targetKeep: true,
        precision: true,
        round : { down: .4, full: .6, up: .99 },
        half: true
    });
});