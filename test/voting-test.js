const { expect } = require("chai");

describe("Voting", function () {

  let Voting;
  let voting;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Voting = await ethers.getContractFactory("Voting");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    voting = await Voting.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should return a vote of a contract owner", async function () {

      const setVoteTx = await voting.setVote(2);

      await setVoteTx.wait();
  
      expect(await voting.getVote(owner.address)).to.equal(2);
    });

    it("Should return a vote of a given address", async function () {

      const setVoteTx = await voting.connect(addr1).setVote(5);

      await setVoteTx.wait();
  
      expect(await voting.getVote(addr1.address)).to.equal(5);
    });
  });
});
