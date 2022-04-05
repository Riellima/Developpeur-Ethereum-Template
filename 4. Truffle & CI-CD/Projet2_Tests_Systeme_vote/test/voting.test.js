const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("Voting", (accounts) => {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];

    const fromOwner = { from: owner };
    const fromVoter1 = { from: voter1 };
    const fromVoter2 = { from: voter2 };
    const fromVoter3 = { from: voter3 };

    let votingInstance;

    //onlyowner
    //require des status
    //les variables d'etat

    describe("WORKFLOW STATUS CHANGE TESTS, STATUS ONLY", function() {
        before(async function() {
            votingInstance = await Voting.new(fromOwner);
        });

        it("should get initial workflow status in string", async() => {
            const wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.RegisteringVoters.toString());
        });

        // ---------startProposalsRegistering / actual status is RegisteringVoters
        it("should not set a status other than ProposalsRegistrationStarted", async() => {
            await expectRevert(votingInstance.endProposalsRegistering(fromOwner), "Registering proposals havent started yet");
        });

        it("should not set a status by a non owner", async() => {
            await expectRevert(votingInstance.startProposalsRegistering(fromVoter1), "Ownable: caller is not the owner");
        });

        it("should set the ProposalsRegistrationStarted status", async() => {
            let wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.RegisteringVoters.toString());

            await votingInstance.startProposalsRegistering(fromOwner);
            wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.ProposalsRegistrationStarted.toString());
        });

        // ----------endProposalsRegistering / actual status is ProposalsRegistrationStarted
        it("should not set a status  other than ProposalsRegistrationEnded", async() => {
            await expectRevert(votingInstance.startVotingSession(fromOwner), "Registering proposals phase is not finished");
        });

        it("should not set a status by a non owner", async() => {
            await expectRevert(votingInstance.endProposalsRegistering(fromVoter1), "Ownable: caller is not the owner");
        });

        it("should set the ProposalsRegistrationEnded status", async() => {
            let wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.ProposalsRegistrationStarted.toString());

            await votingInstance.endProposalsRegistering(fromOwner);
            wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.ProposalsRegistrationEnded.toString());
        });

        // ---------startVotingSession / actual status is ProposalsRegistrationEnded
        it("should not set a status other than VotingSessionStarted ", async() => {
            await expectRevert(votingInstance.endVotingSession(fromOwner), "Voting session havent started yet");
        });

        it("should not set a status by a non owner", async() => {
            await expectRevert(votingInstance.startVotingSession(fromVoter1), "Ownable: caller is not the owner");
        });

        it("should set the VotingSessionStarted status", async() => {
            let wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.ProposalsRegistrationEnded.toString());

            await votingInstance.startVotingSession(fromOwner);
            wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.VotingSessionStarted.toString());
        });

        // ---------endVotingSession / actual status is VotingSessionStarted
        it("should not set a status other than VotingSessionEnded", async() => {
            //next status shoul be ProposalsRegistrationEnded
            await expectRevert(votingInstance.tallyVotes(fromOwner), "Current status is not voting session ended");
        });

        it("should not set a status by a non owner", async() => {
            await expectRevert(votingInstance.endVotingSession(fromVoter1), "Ownable: caller is not the owner");
        });

        it("should set the VotingSessionEnded status", async() => {
            let wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.VotingSessionStarted.toString());

            await votingInstance.endVotingSession(fromOwner);
            wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.VotingSessionEnded.toString());
        });

        // ---------tallyVotes / actual status is  VotingSessionEnded
        it("should not set a status other than VotesTallied", async() => {
            //next status shoul be ProposalsRegistrationEnded
            await expectRevert(votingInstance.startVotingSession(fromOwner), "Registering proposals phase is not finished");
        });

        it("should not set a status by a non owner", async() => {
            await expectRevert(votingInstance.tallyVotes(fromVoter1), "Ownable: caller is not the owner");
        });

        it("should set the VotesTallied status", async() => {
            let wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.VotingSessionEnded.toString());

            await votingInstance.tallyVotes(fromOwner);
            wfstatus = await votingInstance.workflowStatus();
            expect(wfstatus.toString()).to.equal(Voting.WorkflowStatus.VotesTallied.toString());
        });
    });

    describe("WORKFLOW STATUS CHANGE TESTS, EVENTS ONLY", function() {
        before(async function() {
            votingInstance = await Voting.new(fromOwner);
        });

        it("should emit WorkflowStatusChange event, (RegisteringVoters, ProposalsRegistrationStarted) ", async() => {
            expectEvent(
                await votingInstance.startProposalsRegistering(fromOwner),
                "WorkflowStatusChange", { previousStatus: new BN(0), newStatus: new BN(1) }
            );
        });

        it("should emit WorkflowStatusChange event, (ProposalsRegistrationStarted, ProposalsRegistrationEnded) ", async() => {
            expectEvent(
                await votingInstance.endProposalsRegistering(fromOwner),
                "WorkflowStatusChange", { previousStatus: new BN(1), newStatus: new BN(2) }
            );
        });


        it("should emit WorkflowStatusChange event, (ProposalsRegistrationEnded, VotingSessionStarted)", async() => {
            expectEvent(
                await votingInstance.startVotingSession(fromOwner),
                "WorkflowStatusChange", { previousStatus: new BN(2), newStatus: new BN(3) }
            );
        });

        it("should emit WorkflowStatusChange event, (VotingSessionStarted, VotingSessionEnded)", async() => {
            expectEvent(
                await votingInstance.endVotingSession(fromOwner),
                "WorkflowStatusChange", { previousStatus: new BN(3), newStatus: new BN(4) }
            );
        });

        it("should emit WorkflowStatusChange event, (VotingSessionEnded, WorkflowStatus.VotesTallied)", async() => {
            expectEvent(
                await votingInstance.tallyVotes(fromOwner),
                "WorkflowStatusChange", { previousStatus: new BN(4), newStatus: new BN(5) }
            );
        });

    });

    describe("REGISTRATION TESTS", function() {
        beforeEach(async function() {
            votingInstance = await Voting.new(fromOwner);
        });

        it("should store and get a voter", async() => {
            await votingInstance.addVoter(voter1, fromOwner);
            const storedVoter = await votingInstance.getVoter(voter1, fromVoter1);
            expect(storedVoter.isRegistered).to.be.true;
            expect(storedVoter.hasVoted).to.be.false;
        });

        it("should add the 3 accounts as voters, get 1 account registered", async() => {
            await votingInstance.addVoter(owner, fromOwner); //1st voter

            let storedVoter2 = await votingInstance.getVoter(voter2, fromOwner); //voter2 is not yet registered
            expect(storedVoter2.isRegistered).to.be.false;

            await votingInstance.addVoter(voter1, fromOwner);
            await votingInstance.addVoter(voter2, fromOwner);

            storedVoter2 = await votingInstance.getVoter(voter2, fromOwner); //voter2 is registered
            expect(storedVoter2.isRegistered).to.be.true;
        });


        it("should not store a voter already registered", async() => {
            await votingInstance.addVoter(voter1, fromOwner); //1rst registration
            await expectRevert(votingInstance.addVoter(voter1, fromOwner), "Already registered");
        });

        it("should emit VoterRegistered event", async() => {
            expectEvent(
                await votingInstance.addVoter(voter1, fromOwner),
                "VoterRegistered", { voterAddress: voter1 }
            );
        });

        it("should not store a voter if status is not right", async() => {
            await votingInstance.startProposalsRegistering(fromOwner); //sets the status to ProposalsRegistrationStarted
            await expectRevert(
                votingInstance.addVoter(voter1, fromOwner),
                "Voters registration is not open yet."
            );
        });

        it("should not allow a non owner to add a voter", async() => {
            await expectRevert(votingInstance.addVoter(voter2, fromVoter1), "Ownable: caller is not the owner");
        });
    });

    describe("PROPOSAL SESSION TESTS", function() {
        beforeEach(async function() {
            votingInstance = await Voting.new(fromOwner);
            await votingInstance.addVoter(voter1, fromOwner);
            await votingInstance.startProposalsRegistering(fromOwner);
        });

        it("should store a proposal in an array", async() => {
            await votingInstance.addProposal("This is proposal 0", fromVoter1);
            const storedData = await votingInstance.getOneProposal(0, fromVoter1);
            expect(storedData.description).to.equal("This is proposal 0");
            expect(new BN(storedData.voteCount)).to.be.bignumber.equal(new BN(0));
        });

        it("should store 5 proposals in an array and get one", async() => {
            await votingInstance.addProposal("This is proposal 0", fromVoter1);
            await votingInstance.addProposal("This is proposal 1", fromVoter1);
            await votingInstance.addProposal("This is proposal 2", fromVoter1);
            await votingInstance.addProposal("This is proposal 3", fromVoter1);
            await votingInstance.addProposal("This is proposal 4", fromVoter1);

            const storedData = await votingInstance.getOneProposal(3, fromVoter1);
            expect(storedData.description).to.equal("This is proposal 3");
            expect(new BN(storedData.voteCount)).to.be.bignumber.equal(new BN(0));
        });

        it("should not store an empty proposal", async() => {
            await expectRevert(
                votingInstance.addProposal("", fromVoter1),
                "Vous ne pouvez pas ne rien proposer"
            );
        });

        it("should not allow a non registered to add a proposal", async() => {
            //only voter1 is registered 
            await expectRevert(
                votingInstance.addProposal("This is a proposal from voter 2", fromVoter2),
                "You're not a voter"
            );
        });

        it("should emit ProposalRegistered event", async() => {
            expectEvent(
                await votingInstance.addProposal("This is proposal 0", fromVoter1),
                "ProposalRegistered",
                0
            );
        });

        it("should not store a proposal if status is not ProposalsRegistrationStarted", async() => {
            await votingInstance.endProposalsRegistering(fromOwner); //sets the status to ProposalsRegistrationEnded
            await expectRevert(
                votingInstance.addProposal("This is proposal 1", fromVoter1),
                "Proposals are not allowed yet"
            );
        });
    });

    describe("VOTE SESSION TESTS", function() {
        beforeEach(async function() {
            votingInstance = await Voting.new(fromOwner);
            await votingInstance.addVoter(voter1, fromOwner);

            await votingInstance.startProposalsRegistering(fromOwner);
            await votingInstance.addProposal("This is proposal 0", fromVoter1);
            await votingInstance.addProposal("This is proposal 1", fromVoter1);
            await votingInstance.addProposal("This is proposal 2", fromVoter1);
            await votingInstance.endProposalsRegistering(fromOwner);

            await votingInstance.startVotingSession(fromOwner);
        });

        it("should update voter after a vote, check votedProposalId", async() => {
            const proposalId = new BN(2);
            await votingInstance.setVote(proposalId, fromVoter1);
            const storedVoter = await votingInstance.getVoter(voter1, fromVoter1);
            expect(new BN(storedVoter.votedProposalId)).to.be.bignumber.equal(proposalId);
        });

        it("should update voter after a vote, check hasVoted", async() => {
            await votingInstance.setVote(0, fromVoter1);
            const storedVoter = await votingInstance.getVoter(voter1, fromVoter1);
            expect(storedVoter.hasVoted).to.be.true;
        });

        it("should update proposal after a vote, check voteCount", async() => {
            const proposalId = new BN(0);
            await votingInstance.setVote(proposalId, fromVoter1); //voter1 votes for id 0
            const storedData = await votingInstance.getOneProposal(proposalId, fromVoter1);
            expect(storedData.description).to.equal("This is proposal 0");
            expect(new BN(storedData.voteCount)).to.be.bignumber.equal(new BN(1)); //after the vote, voteCount = 1
        });

        it("should emit Voted event", async() => {
            const proposalId = new BN(0);
            expectEvent(await votingInstance.setVote(proposalId, fromVoter1), "Voted", { voter: voter1, proposalId: proposalId });
        });

        it("should not store a vote if status is not VotingSessionStarted", async() => {
            await votingInstance.endVotingSession(fromOwner); //sets the status to VotingSessionEnded
            await expectRevert(votingInstance.setVote(0, fromVoter1), "Voting session havent started yet");
        });

        it("should not allow to vote more than once", async() => {
            await votingInstance.setVote(0, fromVoter1); //first vote
            await expectRevert(votingInstance.setVote(1, fromVoter1), "You have already voted");
        });

        it("should not allow to vote for an unexisting proposal", async() => {
            await expectRevert(votingInstance.setVote(11, fromVoter1), "Proposal not found");
        });

        it("should not allow a non registered to vote", async() => {
            //only voter1 is registered 
            await expectRevert(
                votingInstance.setVote(2, fromVoter3),
                "You're not a voter"
            );
        });
    });

    describe("TALLY VOTES TESTS", function() {
        beforeEach(async function() {
            votingInstance = await Voting.new(fromOwner);
            await votingInstance.addVoter(voter1, fromOwner);
            await votingInstance.addVoter(voter2, fromOwner);
            await votingInstance.addVoter(voter3, fromOwner);

            await votingInstance.startProposalsRegistering(fromOwner);
            await votingInstance.addProposal("This is proposal 0", fromVoter1);
            await votingInstance.addProposal("This is proposal 1", fromVoter1);
            await votingInstance.addProposal("This is proposal 2", fromVoter1);
            await votingInstance.addProposal("This is proposal 3", fromVoter1);
            await votingInstance.addProposal("This is proposal 4", fromVoter1);
            await votingInstance.endProposalsRegistering(fromOwner);

            await votingInstance.startVotingSession(fromOwner);
        });

        it("should get initial winningProposalID with 0 vote", async() => {
            await votingInstance.endVotingSession(fromOwner);
            await votingInstance.tallyVotes(fromOwner);

            const storedWinningId = new BN(await votingInstance.winningProposalID());
            const storedProposal = await votingInstance.getOneProposal(storedWinningId, fromVoter1);

            expect(storedProposal.voteCount).to.be.bignumber.equal(new BN(0));
        });

        it("should get the winning proposal ", async() => {
            await votingInstance.setVote(3, fromVoter1);
            await votingInstance.setVote(3, fromVoter2);
            await votingInstance.setVote(4, fromVoter3);
            await votingInstance.endVotingSession(fromOwner);
            await votingInstance.tallyVotes(fromOwner);

            //proposal3 : 2 votes, proposal4: 1 vote, else 0 vote => ID 3 wins
            const storedWinningId = new BN(await votingInstance.winningProposalID());
            const storedProposal = await votingInstance.getOneProposal(storedWinningId, fromVoter1);

            expect(storedWinningId).to.be.bignumber.equal(new BN(3));
            expect(storedProposal.voteCount).to.be.bignumber.equal(new BN(2));
            expect(storedProposal.description).to.equal("This is proposal 3");
        });

    });

});