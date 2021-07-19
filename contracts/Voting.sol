//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Voting {

  struct Voter {
    bool allowedToVote;
    bool voted;
    uint votedProposal;
  }

  struct Proposal {
    string title;
    uint votes;
  }

  address public owner;
  
  mapping(address => Voter) public voters;
  mapping (uint => Proposal) public proposals;
  uint noOfProposals = 0;

  constructor() {
    console.log("Deploying a Voting contract");
    owner = msg.sender;
  }

  function addAProposal(string memory _title) public returns (uint) {
    Proposal memory proposal = Proposal(_title, 0);
    noOfProposals++;
    proposals[noOfProposals] = proposal;
    return noOfProposals;
  }

  function allowToVote(address _voter) public {
    require(msg.sender == owner, "Only the contract owner can allow to vote.");
    voters[_voter].allowedToVote = true;
    voters[_voter].voted = false;
  }

  function vote(uint _vote) public {
    require(true == voters[msg.sender].allowedToVote, "You are not allowed to vote.");
    require(voters[msg.sender].voted == false, "You already voted.");
    voters[msg.sender].votedProposal = _vote;
    voters[msg.sender].voted = true;
    proposals[_vote].votes++;
  }

  function getWinningProposal() public view returns (uint, string memory){
    uint maxNoOfVotes = 0;
    string memory title = "";
    for (uint i=1; i<=noOfProposals; i++){
      if (proposals[i].votes > maxNoOfVotes) {
        maxNoOfVotes = proposals[i].votes;
        title = proposals[i].title;
      }
    }
    return (maxNoOfVotes, title);
  }

  function getVote(address _voter) public view returns (uint) {
    return voters[_voter].votedProposal;
  }
}