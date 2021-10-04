
App = {
  web3Provider: null,
  contracts: {},
  address : "",

  init: async function() {
    console.log(1);
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    // return App.initContract();
    return App.bindEvents();
  },

  initContract: async function() {
    const data = await $.getJSON('src/RDF.json');
    const rdf = new web3.eth.Contract(
      data.abi,
      address
      );
    rdf.setProvider(App.web3Provider);
    App.contracts.RDF = rdf;
    console.log("uraaaaaa")
    console.log(App.contracts.RDF);
    App.getNumberOfTriples();
    App.getHash();
    
    // App.getQuery();
    // return App.markAdopted();
    App.contracts.RDF.events.LogNewProvableResult({}).on('data', async function(event){
      App.getNumberOfTriples();
      App.getHash();
    }).on('error', console.error);

    App.contracts.RDF.methods.GET_RDF_THREE_QUERY().call().then(function(result){
      console.log("query = " + result)
      // $('#resultAll').text(result);
    });
  },


  bindEvents: function() {
    $(document).on('click', '#refresh', App.getGraf);
    $(document).on('click', '#submit', App.setAddress);
    $(document).on('click', '#send', App.getIndex);
    $(document).on('click', '#all', App.markAdopted);
    // $(document).on('click', '#refresh_data', App.refreshData);
    $(document).on('click', '#triple_by_index', App.getGraf);
  },

  refreshData: function() {
    App.getNumberOfTriples();
    App.getHash();
  },

  getIndex: function(){
    index = parseInt($("#index").val());
    event.preventDefault();
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.RDF.methods.writeTriple(index).send({from: account,gas: 3e6});
      // return App.markAdopted();

    });
    // App.contracts.RDF.methods.getTr(index).call().then(function(result){
    //   console.log("index " + index + " = " + result)
    //   $('#text_index').text(result);
    // });
  },

  setAddress: function(){
    address = $("#options").val();
    $('#account').text(address);
    $('.select').removeClass("active");
    $('.send').addClass("active");
    return App.initContract();
  },

  markAdopted: function() {
    console.log("-------------Wyswietlianie danych----------------");
    App.contracts.RDF.methods.getGraf().call().then(function(result){
      console.log("result = " + result)
      $('#resultAll').text(result);
    });
    // App.contracts.RDF.methods.wordCounter().call().then(function(result){
    //   console.log("number = " + result)
    //   $('#number').text(result);
    // });

    
  },

  getNumberOfTriples: function() {
    console.log("-------------Get number of triplet----------------");
    App.contracts.RDF.methods.numberOfTriples().call().then(function(result){
      console.log("number of triples = " + result)
      $('#number').text(result);
    });
  },

  getGraf: function(event) {
    var indexOfTriplet = parseInt($("#index2").val());
    console.log("-------------Wyswietl trujke----------------");
    App.contracts.RDF.methods.getTriplen(indexOfTriplet).call().then(function(result){
      console.log("index " + index + " = " + result)
      $('#triplet_index').text(result);
    });
    
  },

  getHash: function() {
    console.log("-------------Get hash----------------");
    App.contracts.RDF.methods.calculateiHash().call().then(function(result){
      console.log("hash = " + result);
      $('#hash').text(result);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

