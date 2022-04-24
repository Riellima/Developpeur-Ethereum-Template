import React from 'react';

export default class Content extends React.Component {

    render(){
        const workflowStatus = this.props.workflowStatus;
        const owner = this.props.owner;
        const isOwner = this.props.isOwner;
        const isVoter = this.props.isVoter;
        const voters = this.props.voters;
        const proposals = this.props.proposals;
        const winningProposalID = this.props.winningProposalID;

        const runAddVoter = this.props.runAddVoter;
        const runNextStatus = this.props.runNextStatus;
        const runAddProposal = this.props.runAddProposal;
        const runSetVote = this.props.runSetVote;

        const textChangeStatus = ["Start proposals registering", "End proposals registering", "Start voting session", "End voting session", "Tally votes"];
        

        console.log("owner", owner);
        console.log("isOwner", isOwner);
        console.log("isVoter", isVoter);
        console.log("voters", voters);
        //console.log("runAddVoter", runAddVoter);
        console.log("proposals", proposals);
        
        // 0 - Registerig voters
        if (workflowStatus==="0"){
            if (isOwner){
                return (
                    <div className="content">
                        <h1>Registering session</h1>
                        <br />
                        <br />
                        <input type="text" id="voter-addr" placeholder="Voter address"/>
                        <button onClick={runAddVoter}>Add voter</button>

                        <br />
                        <p>Registered voters</p>
                        <ul>
                            {voters.map((addr) => (
                                <li>{addr}</li>
                            ))}
                        </ul>
                        <br />
                        <button onClick={runNextStatus}>{textChangeStatus[workflowStatus]}</button>
                    </div>
                );
            }
            else if (isVoter){
                return (   
                    <div className="content">
                        <h1>Registering session</h1>

                        <p>You are registered as a voter!</p>
                        <p>Wait for the next session to give proposals</p>
                        <br />
                        <br />
                        <p>Registered voters</p>
                        <ul>
                            {voters.map((addr) => (
                                <li>{addr}</li>
                            ))}
                        </ul>
                    </div>
                );
            }
            else{
                return (   
                    <div className="content">
                        <h1>Registering session</h1>
                        <p>You are not yet registered as a voter...</p>
                        <br />
                        <br />
                        <p>Registered voters</p>
                        <ul>
                            {voters.map((addr) => (
                                <li>{addr}</li>
                            ))}
                        </ul>
                    </div>
                );
            }
        }

        // 1 - Proposals 
        else if (workflowStatus==="1"){
            if(isOwner){
                return(
                    <div className="content">
                        <h1>Proposals session</h1>
                        <p>The workflow status is: {workflowStatus}</p>
                        <p>Voters are giving proposals...</p>
                        <br />
                        <button onClick={runNextStatus}>{textChangeStatus[workflowStatus]}</button>
                    </div>
                );
            }
            else if (isVoter){
                return (   
                    <div className="content">
                        <h1>Proposals session</h1>
                        <br/>
                        <input type="text" id="proposal" placeholder="Proposal"/>
                        <button onClick={runAddProposal}>Add proposal</button>
                        <br/>
                        <br/>
                        <p>List of proposals</p>
                        <ul>{proposals.map((proposal) => (
                                <li>{proposal.description}</li>
                            ))}
                        </ul>
                    </div>
                );
            }
            else{
                return (   
                    <div className="content">
                        <h1>Proposals session</h1>
                    </div>
                );
            }
        }

        //2 - End of proposal session
        else if (workflowStatus==="2"){
            if (isOwner){
                return (   
                    <div>
                        <h1>End of proposals session</h1>
                        <br />
                        <button onClick={runNextStatus}>{textChangeStatus[workflowStatus]}</button>
                    </div>
                )
            }
            else if (isVoter){
                return (   
                    <div>
                        <h1>End of proposals session</h1>
                        <p>Wait for the next session to vote for your favorite proposal</p>
                    </div>
                )
            }
        }
        //else

        //3 - voting session
        else if (workflowStatus==="3"){
            if (isOwner){
                return (   
                    <div className="content">
                        <h1>Voting session</h1>
                        <br />
                        <p>Voters are voting for their favorite proposal...</p>
                        <br/>
                        <button onClick={runNextStatus}>{textChangeStatus[workflowStatus]}</button>
                    </div>
                )
            }
            else if (isVoter){
                return (   
                    <div className="content">
                        <h1>Voting session</h1>
                        <p>List of proposals</p>
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Desciption</th>
                                <th>Votes count</th>
                            </tr>
                            </thead>

                            <tbody>
                            {proposals.map((proposal, index) => (
                                <tr>
                                    <td>{index}</td>
                                    <td>{proposal.description}</td>
                                    <td>{proposal.voteCount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <h3>Your choice:</h3>
                        <input type="text" id="proposal-id" placeholder="Enter ID"/>
                        <button id="vote-button" onClick={runSetVote}>Vote</button>
                        <p id="vote-text"></p>

                    </div>
                )
            }
        }
        // 4 - end of voting session
        else if (workflowStatus==="4"){
            if (isOwner){
                return (   
                    <div>
                        <h1>End of voting session</h1>
                        <br />
                        <button onClick={runNextStatus}>{textChangeStatus[workflowStatus]}</button>
                    </div>
                )
            }
            else if (isVoter){
                return (   
                    <div>
                        <p>End of voting session</p>
                        <p>Wait for the results in next session</p>
                    </div>
                )
            }
        }

        // 5 - tally votes
        else if (workflowStatus==="5"){
            return (   
                <div>
                    <h1>The winner is:</h1>
                    <h2> Proposal {winningProposalID} </h2>
                </div>
            )
        }

        else {
            return (   
                <div>
                    <p>Workflow status ERROR</p>
                </div>
            )
        }

    }
}