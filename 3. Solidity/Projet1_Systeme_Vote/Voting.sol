// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title Voting
 * @author Marielle Diandy
 * @notice This is a voting contract for a small organization. The entity who deploys the contract (owner) is the admin and manages the voting process.
 */
contract Voting is Ownable{

    struct Voter{
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    mapping(address => Voter) private voters; //authorized voters
    Proposal[] private proposals; //proposals given by voters
    uint private winningProposalId;
    WorkflowStatus private status;

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    modifier onlyVoters(){
        require(voters[msg.sender].isRegistered == true, "Only voters are allowed to use this function");
        _;
    }

    modifier onlyStatus(WorkflowStatus _rightStatus){
        require (status == _rightStatus, "Wait for the right session status to make this action (check the getWorkFlowStatus)");
        _;
    }

    /**
     * @notice Set the workflow status and emit the WorkflowStatusChange event.The new status has to follow the order of the voting process.
     * @param   _newStatus  0 : RegisteringVoters
     *                      1 : ProposalsRegistrationStarted
     *                      2 : ProposalsRegistrationEnded
     *                      3 : VotingSessionStarted
     *                      4 : VotingSessionEnded
     *                      5 : VotesTallied
     */
    function setWorkflowStatus(WorkflowStatus _newStatus) external onlyOwner {
        require(uint(_newStatus) == uint(status)+1, "Incorrect status, cannot go back or skip a step (check the getWorkFlowStatus)");
        WorkflowStatus previousStatus = status;
        status = _newStatus;
        
        if (_newStatus == WorkflowStatus.ProposalsRegistrationEnded){
            require(proposals.length > 0, "A least one proposal is needed");
        }

        if (_newStatus == WorkflowStatus.VotingSessionEnded){
            setWinner();
        }


        emit WorkflowStatusChange(previousStatus, _newStatus);
    }

    /**
     * @notice Add a voter address by registering their address
     * @param _address Voter address
     */
    function registerVoter(address _address) external onlyOwner onlyStatus(WorkflowStatus.RegisteringVoters) {
        voters[_address] = Voter(true, false, 0);
        emit VoterRegistered(_address);
    }

    /**
     * @notice Add a proposal by registering its description and emit ProposalRegistered(
     * @param _description Proposal description
     */
    function registerProposal(string memory _description) external onlyVoters onlyStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        for (uint i=0; i<proposals.length; i++){
            require(
                keccak256(abi.encodePacked(_description)) != keccak256(abi.encodePacked(proposals[i].description)),
                "Proposal already submitted"
            );
        }
        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length - 1);
    }

    /**
     * @notice Save a vote of a voter and emit the Voted event
     * @param _proposalId Id of the chosen proposal
     */
    function vote(uint _proposalId) external onlyVoters onlyStatus(WorkflowStatus.VotingSessionStarted) {
        require(voters[msg.sender].hasVoted == false, "You have already voted"); 
        require(_proposalId >= 0 && _proposalId < proposals.length, "Incorrect proposal ID");

        voters[msg.sender].votedProposalId = _proposalId;
        voters[msg.sender].hasVoted = true;
        proposals[_proposalId].voteCount++;

        emit Voted(msg.sender, _proposalId);
    }

    /**
     * @notice Getter of the current workflow status description
     */
    function getWorkFlowStatus() external view returns (string memory){
        string memory desc = "";

        if (status == WorkflowStatus.RegisteringVoters) {
            desc = "0 - Registering voters";
        }
        else if (status == WorkflowStatus.ProposalsRegistrationStarted) {
            desc = "1 - Proposals registration started";
        }       
        else if (status == WorkflowStatus.ProposalsRegistrationEnded) {
            desc = "2 - Proposals registration ended";
        }
        else if (status == WorkflowStatus.VotingSessionStarted) {
            desc = "3 - Voting session started";
        }
        else if (status == WorkflowStatus.VotingSessionEnded) {
            desc = "4 - Voting session ended";
        }
        else if (status == WorkflowStatus.VotesTallied) {
            desc = "5 - Votes tallied";
        }

        return desc;
    }

    /**
     * @notice Getter of the ID of the proposal voted by _voterAddress
     */
    function getVote(address _voterAddr) external view returns (uint _proposalId){
        require(voters[msg.sender].hasVoted == true, "This user has not voted yet"); 
        return voters[_voterAddr].votedProposalId;
    }

    /**
     * @notice Getter of the proposal description identified by the id _proposalId
     */
    function getProposal(uint _proposalId) external view returns (string memory _proposalDescription){
        return proposals[_proposalId].description;
    }

    /**
     * @notice Getter of the number of proposals
     */
    function getProposalCount() external view returns (uint _proposalCount){
        return proposals.length;
    }

    /**
     * @notice Define the first proposal id with the higher vote count
     */
    function setWinner() internal {
        uint maxCount = 0;
        for (uint i=0; i<proposals.length; i++) {
            if (proposals[i].voteCount > maxCount){
                maxCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
    }

    /**
     * @notice Getter of the number of proposals
     */
    function getWinner() external view onlyStatus(WorkflowStatus.VotesTallied) returns (Proposal memory _winningProposal) {
        return proposals[winningProposalId];
    }
}