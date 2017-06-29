personal.newAccount("ben")
miner.start(8); admin.sleepBlocks(1); miner.stop()
console.log("ben has ether:", web3.fromWei(eth.getBalance(web3.eth.accounts[0]), "ether"))
