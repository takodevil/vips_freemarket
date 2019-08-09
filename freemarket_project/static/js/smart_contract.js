//まだ文字列のgetとsetだけ
//コントラクトのアドレス
var address = "0xBbf5AD5E076b19319d35ec9C6388103d3E0dA785";
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

function create_account() {
  var web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
  var contract = new web3.eth.Contract(abi,address);
//    contract.methods.setMessage('test2').send({from:'0xd9008472605eb183129424d82ec8137d6644357f'});
  contract.methods.getMessage().call().then(console.log);

  document.signup_form.submit();
}