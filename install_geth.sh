sudo add-apt-repository ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install solc

#admin.setSolc("/usr/bin/solc")


git clone https://github.com/ethereum/go-ethereum.git
git co release/1.5
sudo apt-get install -y build-essential 
make all
