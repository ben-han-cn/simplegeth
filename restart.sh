rm -rf etherdata/*
rm -rf ~/.ethash
geth --datadir=etherdata init mygenesis.json
geth --datadir=etherdata --networkid=1234 --nodiscover --jspath /home/vagrant/simplegeth console
