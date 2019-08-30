pragma solidity ^0.5.8;

contract VIPSMarket {

	address owner;
	uint public numItems;
	bool public stopped;

	// �R���g���N�g���f�v���C�����A�h���X���I�[�i�[�ɐݒ肷��R���X�g���N�^
    constructor() public {
        owner = msg.sender;
		numItems = 0;
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
        _;
    }
	// �A�J�E���g���
	struct Account {
		address vips_address;
		string name;
		string email;
		bool registered;
	}	
	mapping(address => Account) public accounts;

	// �A�J�E���g�o�^
    function registerAccount(string memory _name, string memory _email) public {
        require(!accounts[msg.sender].registered);

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
    function getItem(uint _numItems) public view returns(address, string memory, string memory, string memory, uint, string memory, uint){
        return (items[_numItems].sellerAddr, items[_numItems].seller, items[_numItems].name, items[_numItems].description, items[_numItems].price, items[_numItems].image_uri, items[_numItems].stock) ;
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
