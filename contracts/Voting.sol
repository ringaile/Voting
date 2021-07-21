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
        string documentHash;
        uint votes;
    }

    address public owner;
  
    mapping(address => Voter) public voters;
    mapping (uint => Proposal) public proposals;
    uint noOfProposals = 0;

    event ProposalAdded(uint id, string title);
    event VoterIsAllowedToVote(address voter, bool allowToVote);
    event VoterHasVoted(address voter, bool voted);

    constructor() {
        console.log("Deploying a Voting contract");
        owner = msg.sender;
    }

    function addAProposal(string memory _title, string memory _hash) public {
        Proposal memory proposal = Proposal(_title, _hash, 0);
        noOfProposals++;
        proposals[noOfProposals] = proposal;
        emit ProposalAdded(noOfProposals, _title);
    }

    function allowToVote(address _voter) public {
        require(msg.sender == owner, "Only the contract owner can allow to vote.");
        voters[_voter].allowedToVote = true;
        voters[_voter].voted = false;
        emit VoterIsAllowedToVote(_voter, voters[_voter].allowedToVote );
    }

    function vote(uint _vote) public {
        require(true == voters[msg.sender].allowedToVote, "You are not allowed to vote.");
        require(voters[msg.sender].voted == false, "You already voted.");
        voters[msg.sender].votedProposal = _vote;
        voters[msg.sender].voted = true;
        proposals[_vote].votes++;
        emit VoterHasVoted(msg.sender, voters[msg.sender].voted);
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

    function getProposalHash(uint _id) public view returns (string memory) {
        return proposals[_id].documentHash;
    }
}