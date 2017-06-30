rm -rf compressed.txt
echo "pragma solidity ^0.4.11;" >> compressed.txt
cat SafeMath.sol ERC20Basic.sol ERC20.sol BasicToken.sol StandardToken.sol ATKToken.sol >> compressed.txt 
