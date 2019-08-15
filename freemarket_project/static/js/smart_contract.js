//コントラクトのアドレス
var address = "0xB338251c17DFbB3a288b0E1a2Cb6aD691f9aBDFD";
//abi情報
var abi =
[
    {
      "constant": true,
      "inputs": [],
      "name": "numItems",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "accounts",
      "outputs": [
        {
          "name": "vips_address",
          "type": "address"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "email",
          "type": "string"
        },
        {
          "name": "registered",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "stopped",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "items",
      "outputs": [
        {
          "name": "sellerAddr",
          "type": "address"
        },
        {
          "name": "seller",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "price",
          "type": "uint256"
        },
        {
          "name": "googleDocID",
          "type": "string"
        },
        {
          "name": "stock",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
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
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_email",
          "type": "string"
        }
      ],
      "name": "registerAccount",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_email",
          "type": "string"
        }
      ],
      "name": "modifyAccount",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getAccount",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_description",
          "type": "string"
        },
        {
          "name": "_price",
          "type": "uint256"
        },
        {
          "name": "_googleDocID",
          "type": "string"
        },
        {
          "name": "_stock",
          "type": "uint256"
        }
      ],
      "name": "sell",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_stopped",
          "type": "bool"
        }
      ],
      "name": "toggleCircuit",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

window.addEventListener('DOMContentLoaded', function(){
    if (typeof web3 == 'undefined') {
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
        var contract = new web3.eth.Contract(abi,address);
    }
    $("#getMessage").click(function(){
        contract.methods.getMessage().call().then(console.log);
        });

    $("#setMessage").click(function(){
        var username = document.getElementById("id_username").value;
        var email_address = document.getElementById("id_email_address").value;
        var vipstarcoin_address = document.getElementById("id_vipstarcoin_address").value;
//        contract.methods.setMessage(vipstarcoin_address).send({from:'0xfec14720b72653f1b91951f0e5d3066cbd246784'});
        contract.methods.setMessage(vipstarcoin_address).send({from:vipstarcoin_address});

        });

    $("#getAccount").click(function(){
        contract.methods.getAccount().call().then(console.log);
        });

    $("#registerAccount").click(function(){
        var username = document.getElementById("id_username").value;
        var email_address = document.getElementById("id_email_address").value;
        var vipstarcoin_address = document.getElementById("id_vipstarcoin_address").value;
        contract.methods.registerAccount(username,email_address).send({from:vipstarcoin_address,gas:3000000}).then(console.log);
        });
//      document.signup_form.submit();
    // 出品する関数　
    $("#sell").click(function(){
        var vipstarcoin_address = contract.methods.getAccount().call();
        var product = document.getElementById("id_product_name").value;
//        contract.methods.sell(product, description, price, googleDocId, stock).send({from:vipstarcoin_address,gas:3000000}).then(console.log);
        });

});

