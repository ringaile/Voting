import web3 from './web3';
//Your contract address
const address = '0xd9145CCE52D386f254917e481eB44e9943F39138';

//Your contract ABI
const abi = [ {  "constant": false,  "inputs": [   {    "name": "x",    "type": "string"   }  ],  "name": "sendHash",  "outputs": [],  "payable": false,  "stateMutability": "nonpayable",  "type": "function" }, {  "constant": true,  "inputs": [],  "name": "getHash",  "outputs": [   {    "name": "x",    "type": "string"   }  ],  "payable": false,  "stateMutability": "view",  "type": "function" }]
export default new web3.eth.Contract(abi, address);