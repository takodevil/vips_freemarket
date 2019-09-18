pragma solidity ^0.5.8;

contract VIPSMarket {

	address owner;
	uint public numItems;
	uint public transaction_count;
	bool public stopped;
	uint public review_count;

	// �R���g���N�g���f�v���C�����A�h���X���I�[�i�[�ɐݒ肷��R���X�g���N�^
    constructor() public {
        owner = msg.sender;
		numItems = 0;
		transaction_count = 0;
		stopped = false;
    }
	// �I�[�i�[���������s�ł���
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
	// �o�^�ς݃��[�U���������s�ł���
    modifier onlyUser {
        require(accounts[msg.sender].registered);
        require(!accounts[msg.sender].banned);
        _;
    }

    // ================
    // �A�J�E���g
    // ================

	// �A�J�E���g���
	struct Account {
		address vips_address;
		string name;
		string email;
		bool registered;
		bool banned;
	}	
	mapping(address => Account) public accounts;
	
	// �A�J�E���g�o�^
    function registerAccount(string memory _name, string memory _email) payable public noReentrancy {
        require(!accounts[msg.sender].registered);
        require(msg.value >= 10000);
		accounts[msg.sender].registered = true;
        accounts[msg.sender].name = _name;   
        accounts[msg.sender].email = _email; 
		accounts[msg.sender].vips_address = msg.sender;
    }
	// �A�J�E���g�C��
    function modifyAccount(string memory _name, string memory _email) public onlyUser noReentrancy {
        accounts[msg.sender].name = _name;
        accounts[msg.sender].email = _email;
    }
	// �A�J�E���g���擾
	function getAccount(address _addr) public onlyUser view returns(address, string memory, string memory, bool, bool)  {
		return (_addr, accounts[_addr].name, accounts[_addr].email, accounts[_addr].registered, accounts[_addr].banned);
	}
	// �A�J�E���gban�i�I�[�i�[�j
    function banAccount(address _target) public onlyOwner {
        require(!accounts[_target].banned);
		accounts[msg.sender].banned = true;
    }
	// �A�J�E���gban�����i�I�[�i�[�j
    function bancancelAccount(address _target) public onlyOwner {
        require(accounts[_target].banned);
		accounts[msg.sender].banned = false;
    }

    // ================
    // ���i
    // ================

	// ���i���
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

	// �o�i����֐�
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
    // ���i�f�[�^���擾
	/*
		�߂�l
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
	
	// �S�̂̏��i�o�^�����擾
	function getnumItems() public view returns(uint){
		return numItems;
	}
	// ���i�f�[�^��ҏW
	function editItem(uint _numItems, string memory _name, uint _price, uint _stock, string memory _description, string memory _image_uri) public onlyUser isStopped noReentrancy{
		require(msg.sender == items[_numItems].sellerAddr);
		
		items[_numItems].name = _name;
		items[_numItems].price = _price;
		items[_numItems].stock = _stock;
		items[_numItems].description = _description;
		items[_numItems].image_uri = _image_uri;
	}
	// ���i���폜
	function removeItem(uint _numItems) public onlyUser isStopped{
		require(msg.sender == items[_numItems].sellerAddr);
		// �l�Ƃ��ă[�������蓖�Ă�
		delete items[_numItems];
	}
	// ���i���폜�i�I�[�i�[�j
	function removeItemOwner(uint _numItems) public onlyOwner isStopped{
		// �l�Ƃ��ă[�������蓖�Ă�
		delete items[_numItems];
	}

    // ================
    // ���
    // ================

	// ����f�[�^
	/* �N�����ǂ̏��i���ǂꂾ����������
		�g�����U�N�V�����n�b�V����from,to,value���킩��
		�t�B���^�p�ɍw���҂Əo�i�҂̃A�h���X��o�^���Ă���
		�ҏW�����\��������̂œ����̉��i���L�^���Ă���
		�w���{�^�����������Ƃ��ɑ�������
		�������̂�solidity�ł͂Ȃ�web3.js�Œ��ڑ���
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

	// �]���ƃ��r���[�p�ɁA�N���ǂ̏��i���w���ς��̃}�b�s���O��ǉ����Ă���
	mapping(address => mapping(uint => bool)) public who_bought_what;

	// ����f�[�^�o�^
    function registerTransact(
		string memory _tx_hash,
		uint _item_id,
		uint _price,
		uint _ordercount,
		string memory _registered_time,
		address _buyerAddr,
		address _sellerAddr
	) public onlyUser isStopped noReentrancy {
		// ��������1�ȏ�ł��邱��
		require(_ordercount >= 1);
		// �݌ɂ��\�����邱��
		require(items[_item_id].stock >= _ordercount);
		// ���s�҂��w���҂ł��邱��
		require(msg.sender == _buyerAddr);

        transacts[transaction_count].tx_hash = _tx_hash;
        transacts[transaction_count].item_id = _item_id;
		transacts[transaction_count].price = _price;
        transacts[transaction_count].ordercount = _ordercount;
        transacts[transaction_count].registered_time = _registered_time;
        transacts[transaction_count].buyerAddr = _buyerAddr;
        transacts[transaction_count].sellerAddr = _sellerAddr;

		who_bought_what[_buyerAddr][_item_id] = true;

		// �݌ɂ����炷
		items[_item_id].stock -= _ordercount;
		transaction_count++;
    }

	// ����f�[�^�擾
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

	// �S�̂̃g�����U�N�V���������擾
	function getTransactcount() public view returns(uint){
		return transaction_count;
	}

    // ================
    // �]���ƃ��r���[
    // ================

	// �ǂ̏��i�ɂ��Ă̎�����ǂ������ǂ����ɂǂ�ȕ]����������
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
		// �w���҂��o�i�҂�]������ꍇ�͎��s�҂��w���҂ł��邱��
		if(_buyertoseller == true){
			require(msg.sender == _buyerAddr);
		}
		// ���̋t
		else{
			require(msg.sender == _sellerAddr);
		}
		// �w���҂͏��i���w���ςł��邱��
		require(who_bought_what[_buyerAddr][_item_id] == true);
		// �]���͂P�`�T�̂T�i�K�]��
		require(_evaluation >= 1 && _evaluation <= 5);

		reviews[review_count].item_id = _item_id;
		reviews[review_count].buyerAddr = _buyerAddr;
		reviews[review_count].sellerAddr = _sellerAddr;
		reviews[review_count].buyertoseller = _buyertoseller;
		reviews[review_count].evaluation = _evaluation;
		reviews[review_count].comment = _comment;
		// �]���ςȂ�J�E���g�͑��₳�Ȃ�
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

	// �S�̂̃��r���[�����擾
	function getReviewcount() public view returns(uint){
		return review_count;
	}

    // ================
    // �Z�L�����e�B�[�΍�
    // ================

    // Circuit Breaker �~�߂���~�܂�
    modifier isStopped {
        require(!stopped);
        _;
    }
    
    // Circuit Breaker�𔭓��C��~����֐�
    function toggleCircuit(bool _stopped) public onlyOwner{
        stopped = _stopped;
    }

	// ���G���g�����V�΍�
	// ���s���̓��b�N�������čĎ��s�ł��Ȃ��悤�ɂ���
	bool locked = false;
	modifier noReentrancy() {
		require(!locked);
		locked = true;
		_;
		locked = false;
	}

}
