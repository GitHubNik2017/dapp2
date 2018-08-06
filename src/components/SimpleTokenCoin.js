import React, {Component} from 'react';
import _ from 'lodash';
import SimpleTokenMint from '../../build/contracts/SimpleTokenMint.json';
import getWeb3 from '../utils/getWeb3';
import Account from './Account';
import '../css/oswald.css';
import '../css/open-sans.css';
import '../css/pure-min.css';
import '../App.css';

class SimpleTokenCoin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            accounts: null,
            currentAccount: null,
            web3: null,
            name: null,
            owner: null,
            balance: 0,
            totalSupply: 0,
            allowance: null,
            truffleInstance: null,
            verify: false
        }
    }

    componentWillMount() {
       getWeb3
           .then(results => {
                this.setState({
                    web3: results.web3,
                });
                this.instantiateContract();
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    instantiateContract() {
        const contract = require('truffle-contract');
        const SimpleToken  = contract(SimpleTokenMint);

        SimpleToken.setProvider(this.state.web3.currentProvider);

        this.state.web3.eth.getAccounts((error, accounts) => {
            SimpleToken.deployed().then((instance) => {
                instance
                    .owner()
                    .then((response) => {
                        this.setState({
                            owner: response
                        })
                    }).catch((error)=>{
                    console.log('ERROR ', error);
                });
                this.setState({
                    truffleInstance: instance,
                    accounts: accounts
                });
                return instance.name()
            }).then((result) => {
                this.setState({
                    name: result,
                });
            }).catch((error)=>{
                console.log('ERROR ', error);
            })
        });
    }

    handleChange(e) {
        this.setState({
            currentAccount: e.target.value
        });
        this.getBalance(e.target.value);
        this.getTotalSupply();
    }

    getBalance(currentAccount) {
        this.state.truffleInstance
            .balanceOf(currentAccount)
            .then((response) => {
                this.setState({
                    balance: response.c[0]
                })
            }).catch((error)=>{
            console.log('ERROR ', error);
        })
    };

    getTotalSupply() {
        this.state.truffleInstance
            .totalSupply()
            .then((response) => {
                this.setState({
                    totalSupply: response.toNumber()
                })
            }).catch((error)=>{
            console.log('ERROR ', error);
        })
    };

    transfer = () => {
        let owner = this.state.owner;
        let account = document.getElementById('toAddress').value;

        this.state.truffleInstance
            .transfer(account, document.getElementById('transferAmount').value, {from: owner})
            .then((response) => {
                if(response.tx){
                    this.setState({verify: true})
                }
                console.log('Operation completed successfully');
            }).catch((error)=>{
            console.log('ERROR ', error);
        })
    };

    approve = () => {
        let owner = this.state.currentAccount;
        let account = document.getElementById('approve').value;

        this.state.truffleInstance
            .approve(account, document.getElementById('amount').value, {from: owner})
            .then((response) => {
                if(response.tx){
                    this.setState({verify: true})
                }
                console.log('Operation completed successfully');
            }).catch((error)=>{
            console.log('ERROR ', error);
        });
    };

    allowance = () => {
        let owner = this.state.currentAccount;
        let account = document.getElementById('allowance').value;

        this.state.truffleInstance
            .allowance(owner, account, {from: owner})
            .then((response) => {
                this.setState({allowance: response.c[0]});
                console.log('Operation completed successfully');
            }).catch((error)=>{
            console.log('ERROR ', error);
        });
    };

    decreaseApproval = () => {
        let owner = this.state.currentAccount;
        let account = document.getElementById('approval').value;

        this.state.truffleInstance
            .decreaseApproval(account, document.getElementById('amount').value, {from: owner})
            .then((response) => {
                if(response.tx){
                    this.setState({verify: true});
                    console.log('Operation completed successfully');
                }
            }).catch((error)=>{
            console.log('ERROR ', error);
        });
    };

    increaseApproval = () => {
        let owner = this.state.currentAccount;
        let account = document.getElementById('approval').value;

        this.state.truffleInstance
            .increaseApproval(account, document.getElementById('amount').value, {from: owner})
            .then((response) => {
                if(response.tx){
                    this.setState({verify: true});
                    console.log('Operation completed successfully');
                }
            }).catch((error)=>{
            console.log('ERROR ', error);
        });
    };

    mint = () => {
        let owner = this.state.owner;
        let account = document.getElementById('mint').value;

        this.state.truffleInstance
            .mint(account, document.getElementById('mintAmount').value, {from: owner})
            .then((response) => {
                if(response.tx){
                    this.setState({verify: true});
                    console.log('Operation completed successfully');
                }
            }).catch((error)=>{
            console.log('ERROR ', error);
        });
    };

    finishMinting = () => {
        let account = this.state.owner;

        this.state.truffleInstance
            .finishMinting({from: account})
            .then((response) => {
                if(response.tx){
                    this.setState({verify: true});
                    console.log('Operation completed successfully');
                }
            }).catch((error)=>{
            console.log('ERROR ', error);
        });
    };

    transferOwnership = () => {
        let account = this.state.currentAccount;

        this.state.truffleInstance
            .owner()
            .then((result) => {
                this.state.truffleInstance
                    .transferOwnership(account, {from: result})
                    .then((response) => {
                        if(response.tx){
                            this.setState({verify: true});
                            console.log('Operation completed successfully');
                        }
                    }).catch((error)=>{
                    console.log('ERROR ', error);
                });
            }).catch((error)=>{
            console.log('ERROR ', error);
        });
    };

    transferFrom = () => {
        let account = document.getElementById('transferTo').value;
        let owner = document.getElementById('transferFrom').value;
        let value = document.getElementById('transferFromAmount').value;

        this.state.truffleInstance
            .transferFrom(owner, account, value, {from: account})
            .then((response) => {
                if(response.tx){
                    this.setState({verify: true});
                    console.log('Operation completed successfully');
                }
            }).catch((error)=>{
            console.log('ERROR ', error);
        });
    };


    transferAddress = (id)=> ()  => {
        document.getElementById(id).value = this.state.currentAccount;
    };

    render() {
        return (
            <div className="App">
                <div className="header">
                    <nav className="navbar pure-menu pure-menu-horizontal">
                        <a href="#" className="pure-menu-heading pure-menu-link">{this.state.name}</a>
                        {!_.isEmpty(this.state.accounts) && <Account account={this.state.accounts} onChange={this.handleChange.bind(this)}/>}
                    </nav>
                </div>
                <main className="container">
                    <div className="block">
                        <table className="table left">
                            <tbody>
                            <tr>
                                <td className="cell cell-header" colSpan={2}>Wallet</td>
                            </tr>
                            <tr>
                                <td className="cell">Addres</td>
                                <td className="cell">{this.state.currentAccount}</td>
                            </tr>
                            <tr>
                                <td className="cell">Balance</td>
                                <td className="cell">{this.state.balance}</td>
                            </tr>
                            <tr>
                                <td className="cell">TSupply</td>
                                <td className="cell">{this.state.totalSupply}</td>
                            </tr>
                            </tbody>
                        </table>
                        <table className="table right">
                            <tbody>
                            <tr>
                                <td className="cell cell-header" colSpan={2}>Send Token</td>
                            </tr>
                            <tr>
                                <td className="cell">
                                    <button className="pure-button" onClick={this.transferAddress("toAddress")}>></button>
                                    <span>To Address</span>
                                </td>
                                <td className="cell">
                                    <input className="input" id="toAddress"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell">Amount</td>
                                <td className="cell">
                                    <input className="input" id="transferAmount"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell" colSpan={2}>
                                    <button className="pure-button" onClick={this.transfer}>Send</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="block">
                        <table className="table left">
                            <tbody>
                            <tr>
                                <td className="cell cell-header">Allowance</td>
                                <td className="cell cell-header">
                                    <span>{this.state.allowance}</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell">
                                    <button className="pure-button" onClick={this.transferAddress("approve")}>></button>
                                    <span>Approve</span>
                                </td>
                                <td className="cell">
                                    <input className="input" id="approve"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell">
                                    <button className="pure-button" onClick={this.transferAddress("approval")}>></button>
                                    <span>dec/inc Approve</span>
                                </td>
                                <td className="cell">
                                    <input className="input" id="approval"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell">Amount</td>
                                <td className="cell">
                                    <input className="input" id="amount"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell">
                                    <button className="pure-button" onClick={this.transferAddress("allowance")}>></button>
                                    <span>Allowance</span>
                                </td>
                                <td className="cell">
                                    <input className="input" id="allowance"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell" colSpan={2}>
                                    <button className="pure-button" onClick={this.approve} >approve</button>
                                    <button className="pure-button" onClick={this.decreaseApproval} >decApproval</button>
                                    <button className="pure-button" onClick={this.increaseApproval} >incApproval</button>
                                    <button className="pure-button" onClick={this.allowance} >allowance</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table className="table right">
                            <tbody>
                            <tr>
                                <td className="cell cell-header" colSpan={2}>Transfer</td>
                            </tr>
                            <tr>
                                <td className="cell">
                                    <button className="pure-button" onClick={this.transferAddress("transferFrom")}>></button>
                                    <span>Transfer from</span>
                                </td>
                                <td className="cell">
                                    <input className="input" id="transferFrom"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell">
                                    <button className="pure-button" onClick={this.transferAddress("transferTo")}>></button>
                                    <span>Transfer to</span>
                                </td>
                                <td className="cell">
                                    <input className="input" id="transferTo"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell">Amount</td>
                                <td className="cell">
                                    <input className="input" id="transferFromAmount"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell" colSpan={2}>
                                    <button className="pure-button" onClick={this.transferFrom}>send</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="block">
                        <table className="table left">
                            <tbody>
                            <tr>
                                <td className="cell cell-header" colSpan={2}>Mint</td>
                            </tr>
                            <tr>
                                <td className="cell">
                                    <button className="pure-button" onClick={this.transferAddress("mint")}>></button>
                                    <span>Mint to</span>
                                </td>
                                <td className="cell">
                                    <input className="input" id="mint"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell">Amount</td>
                                <td className="cell">
                                    <input className="input" id="mintAmount"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell">
                                    <button className="pure-button" onClick={this.transferAddress("newOwner")}>></button>
                                    <span>newOwner</span>
                                </td>
                                <td className="cell">
                                    <input className="input" id="newOwner"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="cell" colSpan={2}>
                                    <button className="pure-button" onClick={this.finishMinting}>fishing mint</button>
                                    <button className="pure-button" onClick={this.transferOwnership}>newOwner</button>
                                    <button className="pure-button" onClick={this.mint}>mint</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        )
    }
}

export default SimpleTokenCoin
