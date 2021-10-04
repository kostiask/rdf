pragma solidity >=0.4.21 <0.6.0;

contract ContractInterface {
    function __callback(string memory _result) public;
} 

contract Oracle {
    
    event NewRequest(address _adr, uint id, string urlToQuery, string attributeToFetch);
    event UpdatedRequest (uint id, string urlToQuery, string attributeToFetch, string agreedValue);

    struct Request {
        uint id;
        address addressSmartContract;
        string urlToQuery;
        string attributeToFetch;
        string agreedValue;
    }

    Request[] requests;
    uint currentId = 0;

    function createRequest(string memory _urlToQuery, string memory _attributeToFetch) public {
        uint length = requests.push(Request(currentId, msg.sender,_urlToQuery, _attributeToFetch, ""));
        Request storage r = requests[length - 1];
        
        emit NewRequest (msg.sender, currentId, _urlToQuery, _attributeToFetch);

        currentId++;
    }

    function updateRequest (uint _id, string memory _valueRetrieved) public {

        Request storage currRequest = requests[_id];

        ContractInterface contractInterface = ContractInterface(currRequest.addressSmartContract);

        currRequest.agreedValue = _valueRetrieved;
        emit UpdatedRequest (currRequest.id, currRequest.urlToQuery, currRequest.attributeToFetch, currRequest.agreedValue);

        contractInterface.__callback(_valueRetrieved);

    }

}