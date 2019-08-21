pragma solidity ^0.5.0;

contract VIPSMarket {

	string private message;
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

	function setMessage(string memory _message) public {
		message = _message;
	}
	function getMessage() public view returns(string memory){
		return message;
	}
	// �A�J�E���g�o�^
    function registerAccount(string memory _name, string memory _email) public  {
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
		accounts[msg.sender].vips_address = msg.sender;
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
		string googleDocID;
		uint stock;
	
	}
	mapping(uint => item) public items;

	// �o�i����֐�
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
