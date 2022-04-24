import React from 'react';

export default class Header extends React.Component {

    render(){
        const isOwner = this.props.isOwner;
        const isVoter = this.props.isVoter;
        const userStatus = isOwner? "ADMIN": isVoter? "VOTER" : "UNREGISTERED";
        return(
            <div className="header">
                <h1>Voting DApp 🗳</h1>
                <div className="user-infos">
                    <p>Connected address:</p>
                    <p>{this.props.addr}</p>
                    <p>{userStatus}</p> 
                </div>
            </div>
        )
    }
}
