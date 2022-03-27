//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Whitelist {
    mapping (address => bool) whitelist;

    event Authorized(address);

    function authorize(address _addr) public {
        whitelist[_addr] = true;
        emit Authorized(_addr);
    }

}

contract PersonStruct{

    struct Person{
        string name;
        uint8 age;
    }
    Person[] public persons;

    function add(string memory _name, uint8 _age) public{
        persons.push(Person(_name, _age));
    }

    function remove() public {
        persons.pop();
    }
}

contract HelloWorld{
    string myString = "Hello world!";

    function hello() public view returns (string memory){
        return myString;
    }
}

contract Time{
    function getTime() public view returns (uint){
        return block.timestamp;
    }
}

contract Choice{
    mapping(address => uint) choices;

    function add(uint _myuint) public {
        choices[msg.sender] = _myuint;
    }

    function getChoice(address _addr) public view returns (uint) {
        return choices[_addr];
    }
}