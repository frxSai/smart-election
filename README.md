
install node.js


install truffle and ganache-cli
- npm install -g truffle
- npm install -g ganache-cli

install bootstrap and lite-server
- npm i bootstrap @truffle/contract web3@1.10.4 jquery
- npm i -g lite-server

Run ganache-cli (local Ethereum blockchain)
- ganache-cli

Run migrate (blockchain network)
- truffle migrate --reset

run
- cd client
- npm install
- npm start

If cannot run ganache and truffle use this command in powershell.
- Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned


How-to-use
- Create and start Event
- Register voter
- Approve voter at verification page 
- Vote candidate
- End event at admin page
- Check event result