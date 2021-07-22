const IPFS = require('ipfs')
const uint8ArrayFromString = require('uint8arrays/from-string')
const uint8ArrayConcat = require('uint8arrays/concat')
const all = require('it-all')
const uint8ArrayToString = require('uint8arrays/to-string')
const hre = require("hardhat");

async function main () {
    const node = await IPFS.create()

    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();

    const title = 'hello.txt';
    const content = 'Hello World 101';
    const file = await node.add({
        path: title,
        content: uint8ArrayFromString(content)
    })

    const addProposalTx = await voting.addAProposal(title, file.cid.toString());
    const receipt = await addProposalTx.wait();

    const event = receipt.events?.filter((x) => {return x.event == "ProposalAdded"});

    hash = await voting.getProposalHash(event[0].args.id.toNumber());

    console.log("The hashes are equal: ", hash === file.cid.toString());

    const data = uint8ArrayConcat(await all(node.cat(file.cid)))

    console.log('File contents are equal:', uint8ArrayToString(data) === content)
}

main()
.then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });