
Install node.js
- website: https://nodejs.org/en/download/current
- Instant download: https://nodejs.org/dist/v21.7.1/node-v21.7.1-x64.msi


Install truffle and ganache-cli
- npm install -g truffle
- npm install -g ganache-cli

Install bootstrap and lite-server
- npm i bootstrap @truffle/contract web3@1.10.4 jquery
- npm i -g lite-server

----------------------------------------------------------------------------------------------


Run ganache-cli (local Ethereum blockchain)
- ganache-cli

Run migrate (blockchain network)
- truffle migrate --reset

Start
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
