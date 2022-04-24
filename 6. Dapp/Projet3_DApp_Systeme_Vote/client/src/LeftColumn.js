import React from 'react';

export default class LeftColumn extends React.Component {

    render(){
        const workflowStatus = this.props.workflowStatus;
        //const workflowStatus = this.props.workflowStatus;
        const statusList = ["RegisteringVoters", "ProposalsRegistrationStarted", "ProposalsRegistrationEnded", "VotingSessionStarted", "VotingSessionEnded", "VotesTallied"];
        
        return(
            <div className="left-column">
                <h3>Workflow status</h3>

                <ul>
                    {statusList.map((status) => (
                        <li className={status===statusList[workflowStatus] ? "active" : ""}>{status}</li>
                    ))}
                </ul>
            </div>
        )
    }
}
