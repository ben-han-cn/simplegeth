contract ATKToken is StandardToken {
    string public constant name = "Alpha Token";
    string public constant symbol = "ATK";
    uint256 public constant decimals = 18;
    uint256 public constant price = 6000;
    address public ethFundDeposit;      
    address public atkFundDeposit;      
    uint256 public constant atkFund = 500 * (10**6) * 10**decimals;   
    bool public isFinalized;              
    uint256 public fundingStartBlock;
    uint256 public fundingEndBlock;
    uint256 public constant tokenCreationCap =  1500 * (10**6) * 10**decimals;
    uint256 public constant tokenCreationMin =  675 * (10**6) * 10**decimals;

    event CreateATK(address indexed _to, uint256 _value);

    function ATKToken(
        address _ethFundDeposit,
        address _atkFundDeposit,
        uint256 _fundingStartBlock,
        uint256 _fundingEndBlock)
        {
            isFinalized = false;                   
            ethFundDeposit = _ethFundDeposit;
            atkFundDeposit = _atkFundDeposit;
            fundingStartBlock = _fundingStartBlock;
            fundingEndBlock = _fundingEndBlock;
            totalSupply = atkFund;
            balances[atkFundDeposit] = atkFund;   
            CreateATK(atkFundDeposit, atkFund);  
        }

        function () payable external {
            if (isFinalized) throw;
            if (block.number < fundingStartBlock) throw;
            if (block.number > fundingEndBlock) throw;
            if (msg.value == 0) throw;
            createTokens(msg.sender, msg.value);
        }

        function createTokens(address recipient, uint256 ethVal) {
            uint256 tokens = ethVal.mul(price);
            uint256 newTotalSupply = totalSupply.add(tokens);
            if (tokenCreationCap < newTotalSupply) throw;

            totalSupply = newTotalSupply;
            balances[recipient] = balances[recipient].add(tokens);
            CreateATK(recipient, tokens);
        }

        function finalize() external {
            if (isFinalized) throw;
            if (msg.sender != ethFundDeposit) throw; 
            if (totalSupply < tokenCreationMin) throw;      
            if (block.number <= fundingEndBlock && totalSupply != tokenCreationCap) throw;
            if (!ethFundDeposit.send(this.balance)) throw;  
            isFinalized = true;
        }

        function refund() external {
            if (isFinalized) throw;                     
            if (block.number <= fundingEndBlock) throw; 
            if (totalSupply >= tokenCreationMin) throw;
            if (msg.sender == atkFundDeposit) throw;
            uint256 atkVal = balances[msg.sender];
            if (atkVal == 0) throw;

            uint256 ethVal = atkVal.div(price);     
            if (!msg.sender.send(ethVal)) throw;   
            balances[msg.sender] = 0;
            totalSupply = totalSupply.sub(atkVal); 
        }
}
