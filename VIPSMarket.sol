pragma solidity ^0.5.8;

contract VIPSMarket {

	address owner;
	uint public numItems;
	uint public transaction_count;
	bool public stopped;

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
    function registerAccount(string memory _name, string memory _email) payable public {
        require(!accounts[msg.sender].registered);
        require(msg.value >= 10000);
		accounts[msg.sender].registered = true;
        accounts[msg.sender].name = _name;   
        accounts[msg.sender].email = _email; 
		accounts[msg.sender].vips_address = msg.sender;
    }
	// �A�J�E���g�C��
    function modifyAccount(string memory _name, string memory _email) public onlyUser {
        accounts[msg.sender].name = _name;
        accounts[msg.sender].email = _email;
    }
	// �A�J�E���g���擾
	function getAccount() public onlyUser view returns(address, string memory, string memory)  {
		return (msg.sender, accounts[msg.sender].name, accounts[msg.sender].email);
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
    function exhibit(string memory _name, uint _price, uint _stock, string memory _description, string memory _image_uri) public onlyUser isStopped {
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
	function editItem(uint _numItems, string memory _name, uint _price, uint _stock, string memory _description, string memory _image_uri) public onlyUser isStopped{
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
		���t�����́H
		�ҏW�����\��������̂œ����̉��i���L�^���Ă���
		�w���{�^�����������Ƃ��ɑ�������
		�������̂�solidity�ł͂Ȃ�web3.js�Œ��ڑ���
	*/
	struct transact{
		string tx_hash;
		uint item_id;
		uint price;
		uint ordercount;
	}
	mapping(uint => transact) public transacts;

	// ����f�[�^�o�^
    function registerTransact(
		string memory _tx_hash,
		uint _item_id,
		uint _price,
		uint _ordercount
	) public onlyUser isStopped {
		// ��������1�ȏ�ł��邱��
		require(_ordercount >= 1);
		// �݌ɂ��\�����邱��
		require(items[_item_id].stock >= _ordercount);

        transacts[transaction_count].tx_hash = _tx_hash;
        transacts[transaction_count].item_id = _item_id;
		transacts[transaction_count].price = _price;
        transacts[transaction_count].ordercount = _ordercount;
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
			uint
		)
	{
        return (
			transacts[_transact_id].tx_hash,
			transacts[_transact_id].item_id,
			transacts[_transact_id].price,
			transacts[_transact_id].ordercount
		);
    }

	// �S�̂̃g�����U�N�V���������擾
	function getTransactcount() public view returns(uint){
		return transaction_count;
	}

    // ================
    // �Z�L�����e�B�[�΍�
    // ================

    // Circuit Breaker
    modifier isStopped {
        require(!stopped);
        _;
    }
    
    // Circuit Breaker�𔭓��C��~����֐�
    function toggleCircuit(bool _stopped) public onlyOwner {
        stopped = _stopped;
    }

}
