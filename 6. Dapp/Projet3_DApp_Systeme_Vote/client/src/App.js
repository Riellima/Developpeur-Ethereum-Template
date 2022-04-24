import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Header from "./Header.js";
import Footer from "./Footer.js";
import Content from "./Content.js";
import LeftColumn from "./LeftColumn";
import "./App.css";

class App extends Component {
  state = { workflowStatus: 0, web3: null, accounts: null, contract: null, voters: null, owner: null, isOwner: false, isVoter:false, proposals: [], winningProposalID: 0};

  componentDidMount = async () => {
    try {
      window.ethereum.on('accountsChanged',function(){
        window.location.reload();
      });
      window.ethereum.on('chainChanged',function(){ 
        window.location.reload();
      });

      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      let options = {
        fromBlock: 0,
        toBlock: 'latest'
      };

      let voters = (await instance.getPastEvents('VoterRegistered', options)).map(
        (addr) => (addr.returnValues.voterAddress));

      const workflowStatus = await instance.methods.workflowStatus().call();
      const owner = await instance.methods.owner().call();
      const isOwner =  accounts[0]===owner;
      const isVoter = voters.includes(accounts[0]);

      // Get the proposals 
      let proposals = [];
      if (isVoter){
        const idProposalList = (await instance.getPastEvents('ProposalRegistered', options))
        .map((proposal) => (proposal.returnValues.proposalId));

        for (let id of idProposalList){
          proposals.push(await instance.methods.getOneProposal(id).call({ from: accounts[0] }));
        }
      }

      //Winning proposal id
      let winningProposalID = 0;
      if (workflowStatus === 5){
        winningProposalID = await instance.methods.winningProposalID().call();
      }

      // Set state 
      this.setState({workflowStatus, web3, accounts, contract: instance, voters, owner, isOwner, isVoter, proposals, winningProposalID});


    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runAddVoter = async () => {
    const { accounts, contract} = this.state;
    let voterAddr = document.getElementById("voter-addr").value;
    await contract.methods.addVoter(voterAddr).send({ from: accounts[0] });

    let options = {
      fromBlock: 0,
      toBlock: 'latest'
    };

    const addrList = (await contract.getPastEvents('VoterRegistered', options))
                      .map((addr) => (addr.returnValues.voterAddress));
    this.setState({voters: addrList });
    document.getElementById("voter-addr").value = "";
  };

  runAddProposal = async () => {
    const { accounts, contract} = this.state;
    let proposal = document.getElementById("proposal").value;

    await contract.methods.addProposal(proposal).send({ from: accounts[0] });

    this.getProposals();
    document.getElementById("proposal").value = "";
  };

  runSetVote = async () => {
    const { accounts, contract} = this.state;
    let proposalId = document.getElementById("proposal-id");
    let voteButton = document.getElementById("vote-button");
    let voteText = document.getElementById("vote-text");

    await contract.methods.setVote(parseInt(proposalId.value)).send({ from: accounts[0] });
 
    proposalId.remove();
    voteButton.remove();
    voteText.innerHTML = "You voted for proposal " + proposalId.value;
    this.getProposals();
  };

  runNextStatus = async () => {
    const { workflowStatus, accounts, contract} = this.state;
    switch(workflowStatus){
      case "0":
        await contract.methods.startProposalsRegistering().send({ from: accounts[0] }); 
        break;
      case "1":
        await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
        break;
      case "2":
        await contract.methods.startVotingSession().send({ from: accounts[0] }); 
        break;
      case "3":
        await contract.methods.endVotingSession().send({ from: accounts[0] }); 
        break;
      case "4":
        await contract.methods.tallyVotes().send({ from: accounts[0] });
        const winningProposalID = await contract.methods.winningProposalID().call();
        this.setState({winningProposalID});
        break;
      default: 
        console.log("Error runNextStatus: invalid workflow status");
        break;
    }
    const newStatus = await contract.methods.workflowStatus().call();
    this.setState({workflowStatus: newStatus});


  };

  getProposals = async () => {
    const { accounts, contract} = this.state;
    let options = {
      fromBlock: 0,
      toBlock: 'latest'
    };

    let proposals = [];

    const idProposalList = (await contract.getPastEvents('ProposalRegistered', options))
    .map((proposal) => (proposal.returnValues.proposalId));

    for (let id of idProposalList){
      proposals.push(await contract.methods.getOneProposal(id).call({ from: accounts[0] }));
    }

    // Set state 
    this.setState({proposals});
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Header addr={this.state.accounts[0]} isOwner={this.state.isOwner} isVoter={this.state.isVoter}/>
        <hr/>
        <LeftColumn workflowStatus={this.state.workflowStatus}/>
        
        <Content
          workflowStatus={this.state.workflowStatus}
          voters={this.state.voters}
          proposals={this.state.proposals}
          owner={this.state.owner}
          isOwner={this.state.isOwner}
          isVoter={this.state.isVoter}
          winningProposalID={this.state.winningProposalID}
          runAddVoter={this.runAddVoter}
          runAddProposal={this.runAddProposal}
          runNextStatus={this.runNextStatus}
          runSetVote={this.runSetVote}
        />
        <Footer/>
      </div>
    );
  }
}

export default App;