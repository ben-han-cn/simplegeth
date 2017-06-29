personal.unlockAccount(web3.eth.accounts[0], "ben", 3600)
var greeterSource = 'contract mortal { address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) suicide(owner); } } contract greeter is mortal { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } }'

var greeterCompiled = web3.eth.compile.solidity(greeterSource)["<stdin>:greeter"]
var greeterContract = web3.eth.contract(greeterCompiled.info.abiDefinition);
var greeter = greeterContract.new("hello ben", {from: web3.eth.accounts[0], data: greeterCompiled.code, gas: 1000000})

miner.start(8); admin.sleepBlocks(1); miner.stop();

myGreeter = greeterContract.at(eth.getTransactionReceipt(greeter.transactionHash).contractAddress)
console.log("greeter call return:", myGreeter.greet.call())
