$(function(){
$("#btn").click(function(){
    var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    //コントラクトのアドレス
    var address = "0x14309A53eFA1896C9D0b76D0Baf3e4F7672d2e08";
    //abi情報
    var abi =
[
    {
      "constant": false,
      "inputs": [
        {
          "name": "_message",
          "type": "string"
        }
      ],
      "name": "setMessage",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getMessage",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
    ;
    var contract = new web3.eth.Contract(abi,address);
//    contract.methods.setMessage('test').send({from:'0x1f5b67c859cf612d5dfb1ccaf40e38ac5cf6125f'});
    contract.methods.getMessage().call().then(console.log);
    });
});