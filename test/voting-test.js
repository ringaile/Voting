const { expect } = require("chai");

describe("Voting", function () {

  let Voting;
  let voting;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Voting = await ethers.getContractFactory("Voting");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

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

  describe("Access Rights", function () {
    it("Should let the owner to set a right to vote", async function () {
      expect(await voting.voters(addr1.address).allowedToVote == false);

      const allowToVoteTx = await voting.allowToVote(addr1.address);

      expect(await voting.voters(addr1.address).allowedToVote == true);
    });

    it("Should not let any account to set a right to vote", async function () {
      expect(await voting.voters(addr1.address).allowedToVote == false);

      await expect( voting.connect(addr1).allowToVote(addr1.address)).to.be.revertedWith("Only the contract owner can allow to vote.");

      expect(await voting.voters(addr1.address).allowedToVote == false);
    });
  });

  describe("Votes", function () {
    it("Should allow a voter to vote when he is allowed to vote and not voted yet", async function () {
      expect(await voting.voters(addr1.address).allowedToVote == false);

      const allowToVoteTx = await voting.allowToVote(addr1.address);

      await allowToVoteTx.wait();

      expect(await voting.voters(addr1.address).allowedToVote == true);

      const addProposalTx = await voting.addAProposal("My new proposal.");

      // wait until the transaction is mined
      await addProposalTx.wait();

      const voteTx = await voting.connect(addr1).vote(0);

      // wait until the transaction is mined
      await voteTx.wait();

      expect(await voting.voters(addr1.address).voted == false);
    });

    it("Should not allow a voter to vote when he is not allowed to vote and not voted yet", async function () {
      expect(await voting.voters(addr2.address).allowedToVote == false);

      const addProposalTx = await voting.addAProposal("My new proposal.");

      // wait until the transaction is mined
      await addProposalTx.wait();

      await expect(voting.connect(addr2).vote(0)).to.be.revertedWith("You are not allowed to vote.");
    });

    it("Should not allow a voter to vote when he is allowed to vote but already voted", async function () {
      expect(await voting.voters(addr1.address).allowedToVote == false);

      const allowToVoteTx = await voting.allowToVote(addr1.address);

      await allowToVoteTx.wait();

      expect(await voting.voters(addr1.address).allowedToVote == true);

      const addProposalTx = await voting.addAProposal("My new proposal.");

      // wait until the transaction is mined
      await addProposalTx.wait();

      const voteTx = await voting.connect(addr1).vote(0);

      // wait until the transaction is mined
      await voteTx.wait();

      await expect(voting.connect(addr1).vote(0)).to.be.revertedWith("You already voted.");
    });
  });

  describe("Proposals", function () {
    it("Should let anyone to add a proposal", async function () {

      const allowToVoteTx = await voting.addAProposal("My new proposal.");

      // wait until the transaction is mined
      await allowToVoteTx.wait();

      // TODO: return an integer
      expect(await voting.proposals(0).title == "My new proposal.");
    });

    it("Should return a winning proposal", async function () {
      const allowToVote1Tx = await voting.allowToVote(addr1.address);
      await allowToVote1Tx.wait();

      const allowToVote2Tx = await voting.allowToVote(addr2.address);
      await allowToVote2Tx.wait();

      const allowToVote3Tx = await voting.allowToVote(addr3.address);
      await allowToVote3Tx.wait();

      const addProposal1Tx = await voting.addAProposal("My new proposal.");
      // wait until the transaction is mined
      await addProposal1Tx.wait();
      const addProposal2Tx = await voting.addAProposal("My second proposal.");
      await addProposal1Tx.wait();

      const vote1Tx = await voting.connect(addr1).vote(1);
      await vote1Tx.wait();

      const vote2Tx = await voting.connect(addr2).vote(1);
      await vote2Tx.wait();

      const vote3Tx = await voting.connect(addr3).vote(2);
      await vote3Tx.wait();

      [x, y] = await voting.getWinningProposal();
      expect(x == 1 && y == "My new proposal.");
    });
  });
});
