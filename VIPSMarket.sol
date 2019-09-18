pragma solidity ^0.5.8;

contract VIPSMarket {

	address owner;
	uint public numItems;
	uint public transaction_count;
	bool public stopped;
	uint public review_count;

	// コントラクトをデプロイしたアドレスをオーナーに設定するコンストラクタ
    constructor() public {
        owner = msg.sender;
		numItems = 0;
		transaction_count = 0;
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
        require(!accounts[msg.sender].banned);
        _;
    }

    // ================
    // アカウント
    // ================

	// アカウント情報
	struct Account {
		address vips_address;
		string name;
		string email;
		bool registered;
		bool banned;
	}	
	mapping(address => Account) public accounts;
	
	// アカウント登録
    function registerAccount(string memory _name, string memory _email) payable public noReentrancy {
        require(!accounts[msg.sender].registered);
        require(msg.value >= 10000);
		accounts[msg.sender].registered = true;
        accounts[msg.sender].name = _name;   
        accounts[msg.sender].email = _email; 
		accounts[msg.sender].vips_address = msg.sender;
    }
	// アカウント修正
    function modifyAccount(string memory _name, string memory _email) public onlyUser noReentrancy {
        accounts[msg.sender].name = _name;
        accounts[msg.sender].email = _email;
    }
	// アカウント情報取得
	function getAccount(address _addr) public onlyUser view returns(address, string memory, string memory, bool, bool)  {
		return (_addr, accounts[_addr].name, accounts[_addr].email, accounts[_addr].registered, accounts[_addr].banned);
	}
	// アカウントban（オーナー）
    function banAccount(address _target) public onlyOwner {
        require(!accounts[_target].banned);
		accounts[msg.sender].banned = true;
    }
	// アカウントban解除（オーナー）
    function bancancelAccount(address _target) public onlyOwner {
        require(accounts[_target].banned);
		accounts[msg.sender].banned = false;
    }

    // ================
    // 商品
    // ================

	// 商品情報
	struct item {
		address sellerAddr;
		string seller;
		string name;
		string description;
		uint price;
	    string image_uri;
		uint stock;	
	}
	mapping(uint => item) public items;

	// 出品する関数
    function exhibit(string memory _name, uint _price, uint _stock, string memory _description, string memory _image_uri) public onlyUser isStopped noReentrancy {
        items[numItems].sellerAddr = msg.sender;
        items[numItems].seller = accounts[msg.sender].name;
        items[numItems].name = _name;
        items[numItems].description = _description;
        items[numItems].price = _price;
        items[numItems].image_uri = _image_uri;
        items[numItems].stock = _stock;
		numItems++;
    }
    // 商品データを取得
	/*
		戻り値
		0:sellerAddr
		1:seller
		2:name
		3:description
		4:price
		5:image_uri
		6:stock
	*/
    function getItem(uint _numItems) public view
		returns(
			address, 
			string memory, 
			string memory, 
			string memory, 
			uint, 
			string memory, 
			uint
		)
	{
        return (
			items[_numItems].sellerAddr, 
			items[_numItems].seller, 
			items[_numItems].name, 
			items[_numItems].description, 
			items[_numItems].price, 
			items[_numItems].image_uri, 
			items[_numItems].stock
		);
    }
	
	// 全体の商品登録数を取得
	function getnumItems() public view returns(uint){
		return numItems;
	}
	// 商品データを編集
	function editItem(uint _numItems, string memory _name, uint _price, uint _stock, string memory _description, string memory _image_uri) public onlyUser isStopped noReentrancy{
		require(msg.sender == items[_numItems].sellerAddr);
		
		items[_numItems].name = _name;
		items[_numItems].price = _price;
		items[_numItems].stock = _stock;
		items[_numItems].description = _description;
		items[_numItems].image_uri = _image_uri;
	}
	// 商品を削除
	function removeItem(uint _numItems) public onlyUser isStopped{
		require(msg.sender == items[_numItems].sellerAddr);
		// 値としてゼロを割り当てる
		delete items[_numItems];
	}
	// 商品を削除（オーナー）
	function removeItemOwner(uint _numItems) public onlyOwner isStopped{
		// 値としてゼロを割り当てる
		delete items[_numItems];
	}

    // ================
    // 取引
    // ================

	// 取引データ
	/* 誰がいつどの商品をどれだけ買ったか
		トランザクションハッシュでfrom,to,valueがわかる
		フィルタ用に購入者と出品者のアドレスを登録しておく
		編集される可能性があるので当時の価格を記録しておく
		購入ボタンを押したときに送金する
		送金自体はsolidityではなくweb3.jsで直接送る
	*/
	struct transact{
		string tx_hash;
		uint item_id;
		uint price;
		uint ordercount;
		string registered_time;
		address buyerAddr;
		address sellerAddr;
	}
	mapping(uint => transact) public transacts;

	// 評価とレビュー用に、誰がどの商品を購入済かのマッピングを追加しておく
	mapping(address => mapping(uint => bool)) public who_bought_what;

	// 取引データ登録
    function registerTransact(
		string memory _tx_hash,
		uint _item_id,
		uint _price,
		uint _ordercount,
		string memory _registered_time,
		address _buyerAddr,
		address _sellerAddr
	) public onlyUser isStopped noReentrancy {
		// 注文数が1以上であること
		require(_ordercount >= 1);
		// 在庫が十分あること
		require(items[_item_id].stock >= _ordercount);
		// 実行者が購入者であること
		require(msg.sender == _buyerAddr);

        transacts[transaction_count].tx_hash = _tx_hash;
        transacts[transaction_count].item_id = _item_id;
		transacts[transaction_count].price = _price;
        transacts[transaction_count].ordercount = _ordercount;
        transacts[transaction_count].registered_time = _registered_time;
        transacts[transaction_count].buyerAddr = _buyerAddr;
        transacts[transaction_count].sellerAddr = _sellerAddr;

		who_bought_what[_buyerAddr][_item_id] = true;

		// 在庫を減らす
		items[_item_id].stock -= _ordercount;
		transaction_count++;
    }

	// 取引データ取得
    function getTransact(uint _transact_id) public view
		returns(
			string memory,
			uint,
			uint,
			uint,
			string memory,
			address,
			address
		)
	{
        return (
			transacts[_transact_id].tx_hash,
			transacts[_transact_id].item_id,
			transacts[_transact_id].price,
			transacts[_transact_id].ordercount,
			transacts[_transact_id].registered_time,
			transacts[_transact_id].buyerAddr,
			transacts[_transact_id].sellerAddr
		);
    }

	// 全体のトランザクション数を取得
	function getTransactcount() public view returns(uint){
		return transaction_count;
	}

    // ================
    // 評価とレビュー
    // ================

	// どの商品についての取引をどっちがどっちにどんな評価をしたか
	struct review {
		uint item_id;
		address buyerAddr;
		address sellerAddr;
		bool buyertoseller;
		uint evaluation;
		string comment;
		bool done;
	}
	mapping(uint => review) public reviews;

	function register_review (
		uint _item_id,
		address _buyerAddr,
		address _sellerAddr,
		bool _buyertoseller,
		uint _evaluation,
		string memory _comment
	) public onlyUser isStopped noReentrancy{
		// 購入者が出品者を評価する場合は実行者が購入者であること
		if(_buyertoseller == true){
			require(msg.sender == _buyerAddr);
		}
		// その逆
		else{
			require(msg.sender == _sellerAddr);
		}
		// 購入者は商品を購入済であること
		require(who_bought_what[_buyerAddr][_item_id] == true);
		// 評価は１～５の５段階評価
		require(_evaluation >= 1 && _evaluation <= 5);

		reviews[review_count].item_id = _item_id;
		reviews[review_count].buyerAddr = _buyerAddr;
		reviews[review_count].sellerAddr = _sellerAddr;
		reviews[review_count].buyertoseller = _buyertoseller;
		reviews[review_count].evaluation = _evaluation;
		reviews[review_count].comment = _comment;
		// 評価済ならカウントは増やさない
		if(reviews[review_count].done != true) {
			reviews[review_count].done = true;
			review_count++;
		}
	}

	function get_review (
		uint _review_id
	) public view onlyUser isStopped 
		returns(
			uint,
			address,
			address,
			bool,
			uint,
			string memory
		)
	{
		return (
			reviews[_review_id].item_id,
			reviews[_review_id].buyerAddr,
			reviews[_review_id].sellerAddr,
			reviews[_review_id].buyertoseller,
			reviews[_review_id].evaluation,
			reviews[_review_id].comment
		);
	}

	// 全体のレビュー数を取得
	function getReviewcount() public view returns(uint){
		return review_count;
	}

    // ================
    // セキュリティー対策
    // ================

    // Circuit Breaker 止めたら止まる
    modifier isStopped {
        require(!stopped);
        _;
    }
    
    // Circuit Breakerを発動，停止する関数
    function toggleCircuit(bool _stopped) public onlyOwner{
        stopped = _stopped;
    }

	// リエントランシ対策
	// 実行中はロックをかけて再実行できないようにする
	bool locked = false;
	modifier noReentrancy() {
		require(!locked);
		locked = true;
		_;
		locked = false;
	}

}
