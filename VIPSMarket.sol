pragma solidity ^0.5.8;

contract VIPSMarket {

	address owner;
	uint public numItems;
	uint public transaction_count;
	uint public user_count;
	uint public ban_history_count;
	bool public stopped;

	// コントラクトをデプロイしたアドレスをオーナーに設定するコンストラクタ
    constructor() public {
        owner = msg.sender;
		numItems = 0;
		transaction_count = 0;
		user_count = 0;
		ban_history_count = 0;
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

	// banされているユーザは実行できない
	modifier notBannedUser {
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
		uint user_id;
		uint evaluation_count;
	    uint evaluation_sum;
	}	
	mapping(address => Account) public accounts;
	// ユーザIDとアドレスの紐付け
	mapping(uint => address) public map_uid_addr;
	
	// アカウント登録
    function registerAccount(string memory _name, string memory _email) payable public noReentrancy {
        require(!accounts[msg.sender].registered);
        require(msg.value >= 10000);
		accounts[msg.sender].registered = true;
        accounts[msg.sender].name = _name;   
        accounts[msg.sender].email = _email; 
		accounts[msg.sender].vips_address = msg.sender;
		accounts[msg.sender].user_id = user_count;
		map_uid_addr[user_count] = msg.sender;
		user_count++;
    }
	// アカウント修正
    function modifyAccount(string memory _name, string memory _email) public onlyUser noReentrancy {
        accounts[msg.sender].name = _name;
        accounts[msg.sender].email = _email;
    }
	// アカウント情報取得（アドレス指定）
	function getAccount(address _addr) public onlyUser view 
		returns(
			address, 
			string memory, 
			string memory, 
			bool, 
			bool, 
			uint
		)  
	{
		return (
			_addr, 
			accounts[_addr].name, 
			accounts[_addr].email, 
			accounts[_addr].registered, 
			accounts[_addr].banned, 
			accounts[_addr].user_id
		);
	}

	// アカウント情報取得（ID指定）
	function getAccount_byid(uint _user_id) public onlyUser view 
		returns(
			address, 
			string memory, 
			string memory, 
			bool, 
			uint,
			uint
		)  
	{
		return (
			accounts[map_uid_addr[_user_id]].vips_address, 
			accounts[map_uid_addr[_user_id]].name, 
			accounts[map_uid_addr[_user_id]].email, 
			accounts[map_uid_addr[_user_id]].banned, 
			accounts[map_uid_addr[_user_id]].evaluation_count, 
			accounts[map_uid_addr[_user_id]].evaluation_sum
		);
	}

	// アカウント数取得
	function getusercounts() public view returns(uint){
		return user_count;
	}

	// アカウントban
    function banAccount(address _target) payable public onlyUser {
        require(!accounts[_target].banned);
        require(msg.value >= 10000);
		accounts[_target].banned = true;
		banhistories[ban_history_count].executor = msg.sender;
		banhistories[ban_history_count].target = _target;
		banhistories[ban_history_count].cancelflag = 0;
		ban_history_count++;
    }
	// アカウントban解除
    function bancancelAccount(address _target) payable public onlyUser {
        require(accounts[_target].banned);
        require(msg.value >= 10000);
		accounts[_target].banned = false;
		banhistories[ban_history_count].executor = msg.sender;
		banhistories[ban_history_count].target = _target;
		banhistories[ban_history_count].cancelflag = 1;
		ban_history_count++;
    }
    // 履歴
    struct banhistory{
        address executor;
        address target;
        uint cancelflag;
    }
    mapping(uint => banhistory) banhistories;
    
    function getban_history(uint _ban_history_count) public view onlyUser
		returns(
			address, 
			address,
			uint,
			uint
		)
	{
        return (
			banhistories[_ban_history_count].executor, 
			banhistories[_ban_history_count].target, 
			banhistories[_ban_history_count].cancelflag,
			_ban_history_count
		);
    }         

	function getban_history_count() public view onlyUser returns(uint){
		return ban_history_count;
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
    function exhibit(string memory _name, uint _price, uint _stock, string memory _description, string memory _image_uri) public onlyUser notBannedUser isStopped noReentrancy {
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
		7:banned
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
	    if(ban_item(_numItems) == false){
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
    }
    function ban_item(uint _numItems) private view returns(bool){
        (,,,,bool banned,) = getAccount(items[_numItems].sellerAddr);
        return banned;
    }

	// 全体の商品登録数を取得
	function getnumItems() public view returns(uint){
		return numItems;
	}
	// 商品データを編集
	function editItem(uint _numItems, string memory _name, uint _price, uint _stock, string memory _description, string memory _image_uri) public onlyUser notBannedUser isStopped noReentrancy{
		require(msg.sender == items[_numItems].sellerAddr);
		
		items[_numItems].name = _name;
		items[_numItems].price = _price;
		items[_numItems].stock = _stock;
		items[_numItems].description = _description;
		items[_numItems].image_uri = _image_uri;
	}
	// 商品を削除
	function removeItem(uint _numItems) public onlyUser notBannedUser isStopped{
		require(msg.sender == items[_numItems].sellerAddr);
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
	// 評価とレビュー用に、登録済トランザクションハッシュを追加しておく
	mapping(string => bool) public registered_tx_hashes;

	// 取引データ登録
    function registerTransact(
		string memory _tx_hash,
		uint _item_id,
		uint _price,
		uint _ordercount,
		string memory _registered_time,
		address _buyerAddr,
		address _sellerAddr
	) public onlyUser notBannedUser isStopped noReentrancy {
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

		registered_tx_hashes[_tx_hash] = true;

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
	// １つのトランザクションで双方向に評価
	// 0：出品者を評価 1：購入者を評価
	struct review {
		uint item_id;
		address buyerAddr;
		address sellerAddr;
		uint evaluation;
		string comment;
	}
	mapping(string => mapping(uint => review)) public reviews;
	// 評価を登録
	function register_review (
	    string memory _tx_hash,
		uint _buyertoseller,
		uint _item_id,
		address _buyerAddr,
		address _sellerAddr,
		uint _evaluation,
		string memory _comment,
		uint _now_eval
	) public onlyUser notBannedUser isStopped noReentrancy{
		// 購入済であること
		require(registered_tx_hashes[_tx_hash] == true);
		// 評価は１～５の５段階評価
		require(_evaluation >= 1 && _evaluation <= 5);
		// 購入者が出品者を評価する場合
		if(_buyertoseller == 0){
			require(msg.sender == _buyerAddr);
		}
		// その逆
		else{
			require(msg.sender == _sellerAddr);
		}
		// 出品者を評価
		if(_buyertoseller == 0){
			// 未評価の場合
			if(_now_eval == 0){
			    accounts[_sellerAddr].evaluation_count++;
			    accounts[_sellerAddr].evaluation_sum += _evaluation;
			}
			// 評価済の場合
			else{
			    accounts[_sellerAddr].evaluation_sum -= _now_eval;
			    accounts[_sellerAddr].evaluation_sum += _evaluation;
			}
    		reviews[_tx_hash][0].item_id = _item_id;
    		reviews[_tx_hash][0].buyerAddr = _buyerAddr;
    		reviews[_tx_hash][0].sellerAddr = _sellerAddr;
    		reviews[_tx_hash][0].evaluation = _evaluation;
    		reviews[_tx_hash][0].comment = _comment;
		}
		// 購入者を評価
		else{
			// 未評価の場合
			if(_now_eval == 0){
			    accounts[_buyerAddr].evaluation_count++;
			    accounts[_buyerAddr].evaluation_sum += _evaluation;
			}
			// 評価済の場合
			else{
			    accounts[_buyerAddr].evaluation_sum -= _now_eval;
			    accounts[_buyerAddr].evaluation_sum += _evaluation;
			}
    		reviews[_tx_hash][1].item_id = _item_id;
    		reviews[_tx_hash][1].buyerAddr = _buyerAddr;
    		reviews[_tx_hash][1].sellerAddr = _sellerAddr;
    		reviews[_tx_hash][1].evaluation = _evaluation;
    		reviews[_tx_hash][1].comment = _comment;
		}
	}
	// 評価情報取得
	function get_review (
		string memory _tx_hash,
		uint _buyertoseller
	) public view onlyUser isStopped 
		returns(
			uint,
			address,
			address,
			uint,
			string memory
		)
	{
	    if(_buyertoseller == 0){
    		return (
    			reviews[_tx_hash][0].item_id,
    			reviews[_tx_hash][0].buyerAddr,
    			reviews[_tx_hash][0].sellerAddr,
    			reviews[_tx_hash][0].evaluation,
    			reviews[_tx_hash][0].comment
    		);
	    }
	   else {
    		return (
    			reviews[_tx_hash][1].item_id,
    			reviews[_tx_hash][1].buyerAddr,
    			reviews[_tx_hash][1].sellerAddr,
    			reviews[_tx_hash][1].evaluation,
    			reviews[_tx_hash][1].comment
    		);
	   } 
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
