import Web3 from "web3";
import Net from "net";
import request from "request";

var counter = 0;
var server = Net.createServer().listen();

const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_adr",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "urlToQuery",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "attributeToFetch",
        "type": "string"
      }
    ],
    "name": "NewRequest",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "urlToQuery",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "attributeToFetch",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "agreedValue",
        "type": "string"
      }
    ],
    "name": "UpdatedRequest",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_urlToQuery",
        "type": "string"
      },
      {
        "name": "_attributeToFetch",
        "type": "string"
      }
    ],
    "name": "createRequest",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_id",
        "type": "uint256"
      },
      {
        "name": "_valueRetrieved",
        "type": "string"
      }
    ],
    "name": "updateRequest",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const address = "0x98F3F86e66E2E88548d73320F19030dAda6cd93B";
var web3;
var contract;



initWeb3();
initContract();

contract.events.NewRequest({})
.on('data', (event) => {
	print("Id:" + event.returnValues.id + " " + "URL: " + event.returnValues.urlToQuery + " Address sender: " + event.returnValues._adr);
  var ID = event.returnValues.id;
  var _request = event.returnValues.urlToQuery;
  request(_request, function(error, response, body) {
    if(error){
      print("ERROR: " + error);
    }
    else {
      print('Status code '+ response.statusCode);
      print("Response: " + body);

      web3.eth.getAccounts(function(error, accounts){
        if (error) {
          console.log(error);
        }
        var account = accounts[0];
        contract.methods.updateRequest(ID,body).send({from: account,gas: 100000000});
      });

    }
  });

})
.on('error', console.error);

contract.events.UpdatedRequest({})
.on('data', (event) => {
  print("Update request id = " + event.returnValues.id);
})
.on('error', console.error);


function initContract(){
    print("Inicjalizacja contracta");
    try{
        contract = new web3.eth.Contract(abi,address);
        print("Address of the Oracle smart contract: " + address);
        print("Add an Oracle address to the contract.");

        

    } catch(err){
        print(err);
    }
    

}


function initWeb3(){
    print("Initialization Web3");
    web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));
    print("Web socket location: " + web3.currentProvider.url);

}

function print(_str){
    var data = new Date()
    console.log('\x1b[36m%s\x1b[0m',"[" + data.toLocaleDateString() + " " + data.toLocaleTimeString() + "] ", _str);
}