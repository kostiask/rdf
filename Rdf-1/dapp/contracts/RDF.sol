pragma solidity >=0.4.22 <0.9.0;

contract OracleInterface {
    function createRequest (string memory, string memory) public;
    function updateRequest (uint _id, string memory _valueRetrieved) public;
}

contract RDF {

    address OracleInterfaceAddress = 0xd6a9b3dD15dE27eA1E4860d88Da4854202f65A3d;

    OracleInterface oracleInterface = OracleInterface(OracleInterfaceAddress);

    string public GET_RDF_THREE_QUERY = "http://localhost:80/index/";

    event LogNewProvableQuery(string description);
    event LogNewProvableResult(string result);

    uint256 private INDEX;

    uint256[] public indexesList;

    mapping(uint256 => string) graph;

    constructor() public {
    }

    function writeTriple(uint256 _index) public payable{
        INDEX = _index;
        emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
        string memory index = uint2str(_index);
        string memory query = string(abi.encodePacked(GET_RDF_THREE_QUERY, index));
        oracleInterface.createRequest(query,"");
        // provable_query("URL", query ,0xf7b760);
    }

    function __callback(string memory _result) public {
        require(msg.sender == OracleInterfaceAddress);
        bool b = false;
        for(uint i = 0; i < indexesList.length; i ++){
            if(INDEX == indexesList[i]){
                b = true;
            }
        }
        if(!b){
            indexesList.push(INDEX) - 1;
        }
        graph[INDEX] = _result;
        emit LogNewProvableResult(_result);
    }

   
    function getTriplen(uint256 _index) public view returns(string memory){
        return graph[_index];
    }

    function numberOfTriples() public view returns(uint256){
        return indexesList.length;
    }

    function calculateiHash() public view returns(bytes32){

        string memory tmp = "";

        for (uint256 i = 0; i < indexesList.length; i++){
            tmp = string(abi.encodePacked(tmp, graph[indexesList[i]]));
        }

        return keccak256(bytes(tmp));
    }




    function getGraf() public view returns(string memory){
        
        string memory tmp = "";
        string memory index;
        for (uint256 i = 0; i < indexesList.length; i++){
            index = uint2str(indexesList[i]);
            tmp = string(abi.encodePacked(tmp, index, graph[indexesList[i]], "\n"));
        }

        return tmp;
    }


    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }


}
