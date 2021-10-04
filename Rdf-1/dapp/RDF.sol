pragma solidity >= 0.5.0 < 0.6.0;

import "./provableAPI.sol";

contract RDF is usingProvable {

    // string public GET_RDF_THREE_QUERY = "http://328f8833dc13.ngrok.io";

    uint256 public wer = 3;

    // string private GET_RDF_THREE_QUERY = "json(https://api.coingecko.com/api/v" + string(wer) + "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1&page=1&sparkline=false).0.current_price";

    event LogNewProvableQuery(string description);
    event LogNewProvableResult(string result);

    string public result;

    uint256 public wordCounter = 0;

    mapping(uint256 => string) triplets;
    mapping(uint256 => bytes1) map;

    constructor() public {
        provable_setCustomGasPrice(1);
    }

    function retrieveRdfThree() public payable{
        if (provable_getPrice("URL") > msg.value) {
            revert("Provable query was NOT sent, please add some ETH to cover for the query fee!");
        } else {
            emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
            string memory query = string(abi.encodePacked("json(https://api.coingecko.com/api/v", "3", "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1&page=1&sparkline=false).0.current_price"));
            provable_query("URL", query ,0xf7b760);
        }
    }



    function __callback(
        bytes32 _queryID,
        string memory _result,
        bytes memory _proof
    )
        public
    {
        require(msg.sender == provable_cbAddress());
        result = _result;
        // split(_result);
        emit LogNewProvableResult(_result);
    }

    function split(string memory stringToSplit) public payable {
        wordCounter = 0;
        bytes memory stringAsBytesArray = bytes(stringToSplit);
        uint256 counter = 0;
        bool b = false;
        string memory tmp;
        bytes memory tempWord;
        for(uint256 i = 0; i < stringAsBytesArray.length; i++){
            if(b){
               if(stringAsBytesArray[i] != "]"){
                    if(stringAsBytesArray[i] == "\\" && stringAsBytesArray[i+1] == "n"){
                        i++;
                    }
                    else {
                        map[counter] = stringAsBytesArray[i];
                        counter++;
                    } 
               }
               else{
                tmp = new string(counter);
                tempWord = bytes(tmp);
                for(uint256 j = 0; j < counter; j++){
                    tempWord[j] = map[j];
                }
                counter = 0;
                string memory newWord = string(tempWord);
                wordCounter++;
                triplets[wordCounter] = newWord;
                b = false;
               }
            }
            else if(stringAsBytesArray[i] == "["){
                b = true;
            }
        }
    }



    function getTr(uint256 _index) public view returns(string memory){
        if(_index <= wordCounter){
            return triplets[_index];
        }
        else{
            string memory err = "Nie ma takiego.";
            return err;
        }
    }

    function getIlosc()public view returns(uint256){
        return wordCounter;
    }

}
