pragma solidity ^0.5.0;

contract VIPSMarket {

	string private message;
	address owner;
	uint public numItems;
	bool public stopped;

	// コントラクトをデプロイしたアドレスをオーナーに設定するコンストラクタ
    constructor() public {
        owner = msg.sender;
		numItems = 0;
		stopped = false;
    }
	// オーナーだけが実行できる
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
	// 登録済みユーザだけが実行できる
    modifier onlyUser {
        require(accounts[msg.sender].registered);
        _;
    }
	// アカウント情報
	struct Account {
		address vips_address;
		string name;
		string email;
		bool registered;
	}	
	mapping(address => Account) public accounts;

	function setMessage(string memory _message) public {
		message = _message;
	}
	function getMessage() public view returns(string memory){
		return message;
	}
	// アカウント登録
    function registerAccount(string memory _name, string memory _email) public  {
        require(!accounts[msg.sender].registered);

		accounts[msg.sender].registered = true;
        accounts[msg.sender].name = _name;   
        accounts[msg.sender].email = _email; 
		accounts[msg.sender].vips_address = msg.sender;
    }
	// アカウント修正
    function modifyAccount(string memory _name, string memory _email) public onlyUser {
        accounts[msg.sender].name = _name;
        accounts[msg.sender].email = _email;
		accounts[msg.sender].vips_address = msg.sender;
    }
	// アカウント情報取得
	function getAccount() public onlyUser view returns(address, string memory, string memory)  {
		return (msg.sender, accounts[msg.sender].name, accounts[msg.sender].email);
	}
	// 商品情報
	struct item {
		address sellerAddr;
		string seller;
		string name;
		string description;
		uint price;
		string googleDocID;
		uint stock;
	
	}
	mapping(uint => item) public items;

	// 出品する関数
    function sell(string memory _name, string memory _description, uint _price, string memory _googleDocID, uint _stock) public onlyUser isStopped {
        items[numItems].sellerAddr = msg.sender;
        items[numItems].seller = accounts[msg.sender].name;
        items[numItems].name = _name;
        items[numItems].description = _description;
        items[numItems].price = _price;
        items[numItems].googleDocID = _googleDocID;
        items[numItems].stock = _stock;
    }


    // ================
    // セキュリティー対策
    // ================

    // Circuit Breaker
    modifier isStopped {
        require(!stopped);
        _;
    }
    
    // Circuit Breakerを発動，停止する関数
    function toggleCircuit(bool _stopped) public onlyOwner {
        stopped = _stopped;
    }

}
