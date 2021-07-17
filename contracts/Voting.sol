//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Voting {

  address owner;
  
  mapping(address => uint) votes;

  constructor() {
    console.log("Deploying a Voting contract");
    owner = msg.sender;
  }

  function getVote(address _voter) public view returns (uint) {
    return votes[_voter];
  }

  function setVote(uint _vote) public {
    console.log("Setting a vote '%s' from '%s'", _vote, msg.sender);
    votes[msg.sender] = _vote;
  }
}