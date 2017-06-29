var greeterSource = 'contract mortal { address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) suicide(owner); } } contract greeter is mortal { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } }'

var greeterCompiled = web3.eth.compile.solidity(greeterSource)["<stdin>:greeter"]

var greeterContract = web3.eth.contract(greeterCompiled.info.abiDefinition);
myGreeter = greeterContract.at(eth.getTransactionReceipt(eth.getBlock(eth.blockNumber).transactions[0]).contractAddress)
console.log("greet call result:", myGreeter.greet.call())

