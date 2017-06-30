personal.unlockAccount(web3.eth.accounts[0], "ben", 3600)
var tokenSource = 'pragma solidity ^0.4.11; library SafeMath { function mul(uint256 a, uint256 b) internal returns (uint256) { uint256 c = a * b; assert(a == 0 || c / a == b); return c; } function div(uint256 a, uint256 b) internal returns (uint256) { uint256 c = a / b; return c; } function sub(uint256 a, uint256 b) internal returns (uint256) { assert(b <= a); return a - b; } function add(uint256 a, uint256 b) internal returns (uint256) { uint256 c = a + b; assert(c >= a); return c; } function max64(uint64 a, uint64 b) internal constant returns (uint64) { return a >= b ? a : b; } function min64(uint64 a, uint64 b) internal constant returns (uint64) { return a < b ? a : b; } function max256(uint256 a, uint256 b) internal constant returns (uint256) { return a >= b ? a : b; } function min256(uint256 a, uint256 b) internal constant returns (uint256) { return a < b ? a : b; } } contract ERC20Basic { uint256 public totalSupply; function balanceOf(address who) constant returns (uint256); function transfer(address to, uint256 value); event Transfer(address indexed from, address indexed to, uint256 value); } contract ERC20 is ERC20Basic { function allowance(address owner, address spender) constant returns (uint256); function transferFrom(address from, address to, uint256 value); function approve(address spender, uint256 value); event Approval(address indexed owner, address indexed spender, uint256 value); } contract BasicToken is ERC20Basic { using SafeMath for uint256; mapping(address => uint256) balances; function transfer(address _to, uint256 _value) { balances[msg.sender] = balances[msg.sender].sub(_value); balances[_to] = balances[_to].add(_value); Transfer(msg.sender, _to, _value); } function balanceOf(address _owner) constant returns (uint256 balance) { return balances[_owner]; } } contract StandardToken is BasicToken, ERC20 { mapping (address => mapping (address => uint256)) allowed; function transferFrom(address _from, address _to, uint256 _value) { var _allowance = allowed[_from][msg.sender]; balances[_to] = balances[_to].add(_value); balances[_from] = balances[_from].sub(_value); allowed[_from][msg.sender] = _allowance.sub(_value); Transfer(_from, _to, _value); } function approve(address _spender, uint256 _value) { if ((_value != 0) && (allowed[msg.sender][_spender] != 0)) throw; allowed[msg.sender][_spender] = _value; Approval(msg.sender, _spender, _value); } function allowance(address _owner, address _spender) constant returns (uint256 remaining) { return allowed[_owner][_spender]; } } contract ATKToken is StandardToken { string public constant name = "AlphaToken"; string public constant symbol = "ATK"; uint256 public constant decimals = 18; uint256 public constant price = 6000; uint256 public constant atkFund = 500 * (10**6) * 10**decimals; uint256 public constant tokenCreationCap = 1500 * (10**6) * 10**decimals; uint256 public constant tokenCreationMin = 675 * (10**6) * 10**decimals; address public ethFundDeposit; address public atkFundDeposit; uint256 public fundingStartBlock; uint256 public fundingEndBlock; bool public isFinalized; event CreateATK(address indexed _to, uint256 _value); function ATKToken(address _ethFundDeposit, address _atkFundDeposit, uint256 _fundingStartBlock, uint256 _fundingEndBlock) { isFinalized = false; ethFundDeposit = _ethFundDeposit; atkFundDeposit = _atkFundDeposit; fundingStartBlock = _fundingStartBlock; fundingEndBlock = _fundingEndBlock; balances[atkFundDeposit] = atkFund; totalSupply = atkFund; CreateATK(atkFundDeposit, atkFund); } function () payable external { if (msg.value == 0) throw; if (block.number < fundingStartBlock || block.number > fundingEndBlock) throw; uint256 tokens = msg.value.mul(price); uint256 newTotalSupply = totalSupply.add(tokens); if (tokenCreationCap < newTotalSupply) throw; totalSupply = newTotalSupply; balances[msg.sender] = balances[msg.sender].add(tokens); CreateATK(msg.sender, tokens); } function finalize() external { if (isFinalized) throw; if (msg.sender != ethFundDeposit) throw; if (totalSupply < tokenCreationMin) throw; if (block.number <= fundingEndBlock) throw; if (!ethFundDeposit.send(this.balance)) throw; isFinalized = true; } function refund() external { if (isFinalized) throw; if (block.number <= fundingEndBlock) throw; if (totalSupply >= tokenCreationMin) throw; if (msg.sender == atkFundDeposit) throw; uint256 atkVal = balances[msg.sender]; if (atkVal == 0) throw; uint256 ethVal = atkVal.div(price); if (!msg.sender.send(ethVal)) throw; balances[msg.sender] = 0; totalSupply = totalSupply.sub(atkVal); } } '

var tokenCompiled = web3.eth.compile.solidity(tokenSource)["<stdin>:ATKToken"]
var tokenContract = web3.eth.contract(tokenCompiled.info.abiDefinition);
//var contractAddress = eth.getTransactionReceipt(eth.getBlock(eth.blockNumber-1).transactions[0]).contractAddress
var contractAddress = "0x039f7992bf116a338d324f0b6596721db423ce9b"
myToken = tokenContract.at(contractAddress)


console.log("greet ben ether:", web3.fromWei(eth.getBalance(web3.eth.accounts[0]), "ether"))
console.log("greet nana ether:", web3.fromWei(eth.getBalance(web3.eth.accounts[1]), "ether"))
console.log("greet atk ether:", web3.fromWei(eth.getBalance(web3.eth.accounts[2]), "ether"))
console.log("greet hxr ether:", web3.fromWei(eth.getBalance(web3.eth.accounts[3]), "ether"))
console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

console.log("totalSupply:", myToken.totalSupply.call())
console.log("fundingStartBlock:", myToken.fundingStartBlock.call())
console.log("fundingEndBlock:", myToken.fundingEndBlock.call())
console.log("greet ben balance:", myToken.balanceOf.call(web3.eth.accounts[0]))
console.log("greet nana balance:", myToken.balanceOf.call(web3.eth.accounts[1]))
console.log("greet atk balance:", myToken.balanceOf.call(web3.eth.accounts[2]))
console.log("greet hxr balance:", myToken.balanceOf.call(web3.eth.accounts[3]))
console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")


txHash = eth.sendTransaction({from: web3.eth.accounts[3], to: contractAddress, value: web3.toWei(1, "ether"), gasPrice: "1000"})
miner.start(8); admin.sleepBlocks(1); miner.stop();
console.log("totalSupply:", myToken.totalSupply.call())
console.log("fundingStartBlock:", myToken.fundingStartBlock.call())
console.log("fundingEndBlock:", myToken.fundingEndBlock.call())
console.log("greet ben balance:", myToken.balanceOf.call(web3.eth.accounts[0]))
console.log("greet nana balance:", myToken.balanceOf.call(web3.eth.accounts[1]))
console.log("greet atk balance:", myToken.balanceOf.call(web3.eth.accounts[2]))
console.log("greet hxr balance:", myToken.balanceOf.call(web3.eth.accounts[3]))
