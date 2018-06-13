import React, {Component} from 'react'
import _ from 'lodash';
//import SimpleToken from '../build/contracts/SimpleToken.json'
import SimpleTokenMint from '../../build/contracts/SimpleTokenMint.json'
import getWeb3 from '../utils/getWeb3'

import Account from './Account'
import StandardToken from './StandardToken'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

class SimpleTokenCoin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            accounts: null,
            currentAccount: null,
            storageValue: 0,
            web3: null,
            name: null,
            owner: null,
            balance: 0,
            mint: null,
            symbol: null,
            totalSupply: 0,
            decimals: null,
            token: null,
            mintingFinished: null,
            allowance: null,
            INITIAL_SUPPLY: null
        }
    }

    getBalance = (account) => {
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.balanceOf(account);
                }).then((result) => {
                    return this.setState({balance: result.c[0]})
                })

            })
    };

    componentWillMount() {
        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3,
                    accounts: results.web3.eth.accounts
                });

                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(this.state.web3.currentProvider);

                this.instantiateContract(contract);
                this.getInformationContract(simpleTokenMint);
                this.getBalance(document.getElementById("leaveCode").options[0].value);
                this.getTotalSupply();
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    getInformationContract(simpleTokenMint) {

        this.setState({currentAccount: document.getElementById("leaveCode").options[0].value});
        console.log(this.state.currentAccount);

        simpleTokenMint.deployed().then(function (instance) {
            return instance.name()
        }).then((result) => {
            return this.setState({name: result})
        });

        simpleTokenMint.deployed().then(function (instance) {
            return instance.mintingFinished()
        }).then((result) => {
            if (result) {
                return this.setState({mintingFinished: "ok"})
            } else {
                return this.setState({mintingFinished: "no"})
            }
        });

        simpleTokenMint.deployed().then(function (instance) {
            return instance.symbol()
        }).then((result) => {
            return this.setState({symbol: result})
        });

        simpleTokenMint.deployed().then(function (instance) {
            return instance.owner()
        }).then((result) => {
            return this.setState({owner: result})
        });

        simpleTokenMint.deployed().then(function (instance) {
            return instance.decimals()
        }).then((result) => {
            return this.setState({decimals: result.toNumber()})
        })

    }

    getTotalSupply = () => {
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.totalSupply()
                }).then((result) => {
                    return this.setState({totalSupply: result.toNumber()})
                })

            })
    };

    mintable = () => {
        let owner = this.state.owner;
        let account = document.getElementById("mint").value;
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.mint(account, document.getElementById("mintAmount").value, {from: owner})
                })

            })
    };

    finishMinting = () => {
        let account = this.state.owner;
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.finishMinting({from: account})
                })

            })
    };
    approve = () => {
        let owner = this.state.currentAccount;
        let account = document.getElementById("approve").value;
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.approve(account, document.getElementById("amount").value, {from: owner})
                })
            })
    };

    allowance = () => {
        let owner = this.state.currentAccount;
        let account = document.getElementById("allowance").value;
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.allowance(owner, account, {from: owner})
                }).then((result) => {
                    return this.setState({allowance: result.c[0]})
                })

            })
    };

    decreaseApproval = () => {
        let owner = this.state.currentAccount;
        let account = document.getElementById("decreaseApproval").value;
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.decreaseApproval(account, document.getElementById("amount").value, {from: owner})
                })

            })
    };

    increaseApproval = () => {
        let owner = this.state.currentAccount;
        let account = document.getElementById("decreaseApproval").value;
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.increaseApproval(account, document.getElementById("amount").value, {from: owner})
                })

            })
    };

    transfer = () => {
        let owner = this.state.currentAccount;
        let account = document.getElementById("toAddres").value;
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.transfer(account, document.getElementById("transferAmount").value, {from: owner})
                })

            })
    };

    simpleToken = () => {
        let account = this.state.currentAccount;
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.SimpleToken({from: account})
                })

            })
    };

    transferOwnership = () => {
        let owner = this.state.owner;
        let account = this.state.currentAccount;
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.transferOwnership(account, {from: owner})
                })

            })
    };

    putNextOwner = () => {
        let account = this.state.currentAccount;
        let newOwner = document.getElementById("nextOwner");
        newOwner.value = account;
    };

    transferFrom = () => {
        let account = document.getElementById("transferTo").value;
        let owner = document.getElementById("transferFrom").value;
        let value = document.getElementById("transferFromAmount").value;
        getWeb3
            .then(results => {
                const contract = require('truffle-contract');
                const simpleTokenMint = contract(SimpleTokenMint);
                simpleTokenMint.setProvider(results.web3.currentProvider);

                simpleTokenMint.deployed().then(function (instance) {
                    return instance.transferFrom(owner, account, value, {from: account})
                })

            })
    };

    instantiateContract(contract) {

        //const simpleToken = contract(SimpleToken)
        const simpleTokenMint = contract(SimpleTokenMint);

        //simpleToken.setProvider(this.state.web3.currentProvider)
        simpleTokenMint.setProvider(this.state.web3.currentProvider);

        let simpleStorageInstance;

        simpleTokenMint.deployed().then(function (instance) {
            simpleStorageInstance = instance;
            return simpleStorageInstance
        }).then((result) => {
            return this.setState({token: result})
        });

        simpleTokenMint.deployed().then(function (instance) {
            simpleStorageInstance = instance;
            console.log(simpleStorageInstance);
            console.log(document.getElementById("leaveCode").options[0].value);
        });

        simpleTokenMint.deployed().then(function (instance) {
            return instance.INITIAL_SUPPLY()
        }).then((result) => {
            return this.setState({INITIAL_SUPPLY: result.toNumber()})
        })

    }

    handleChange(e) {
        this.setState({currentAccount: e.target.value});
        console.log(e.target.value);
        console.log(this.state.currentAccount);
        this.getBalance(e.target.value);
        this.getTotalSupply();
    }

    transferAddres = () => {
        document.getElementById("toAddres").value = this.state.currentAccount;
    };
    transferApprove = () => {
        document.getElementById("approve").value = this.state.currentAccount;
    };
    transferDecIncApprove = () => {
        document.getElementById("decreaseApproval").value = this.state.currentAccount;
    };
    transferFromButton = () => {
        document.getElementById("transferFrom").value = this.state.currentAccount;
    };
    transferToButton = () => {
        document.getElementById("transferTo").value = this.state.currentAccount;
    };
    transferNewOwner = () => {
        document.getElementById("newOwner").value = this.state.currentAccount;
    };
    transferMint = () => {
        document.getElementById("mint").value = this.state.currentAccount;
    };
    transferAllowance = () => {
        document.getElementById("allowance").value = this.state.currentAccount;
    };

    render() {
        {return (
            <div className="App">
                <div className= "header">
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
                                    <td className="cell">{this.state.owner}</td>
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
                                        <button className="pure-button" onClick={this.transferAddres}>></button>
                                        <span>To Address</span>
                                    </td>
                                    <td className="cell">
                                        <input className="input" id="toAddres"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="cell">Amount</td>
                                    <td className="cell">
                                        <input className="input" id="transferAmount"></input>
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
                                        <button className="pure-button" onClick={this.transferApprove}>></button>
                                        <span>Approve</span>
                                    </td>
                                    <td className="cell">
                                        <input className="input" id="approve"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="cell">
                                        <button className="pure-button" onClick={this.transferDecIncApprove}>></button>
                                        <span>dec/inc Approve</span>
                                    </td>
                                    <td className="cell">
                                        <input className="input" id="decreaseApproval"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="cell">Amount</td>
                                    <td className="cell">
                                        <input className="input" id="amount"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="cell">
                                        <button className="pure-button" onClick={this.transferAllowance}>></button>
                                        <span>Allowance</span>
                                    </td>
                                    <td className="cell">
                                        <input className="input" id="allowance"></input>
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
                                        <button className="pure-button" onClick={this.transferFromButton}>></button>
                                        <span>Transfer from</span>
                                    </td>
                                    <td className="cell">
                                        <input className="input" id="transferFrom"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="cell">
                                        <button className="pure-button" onClick={this.transferToButton}>></button>
                                        <span>Transfer to</span>
                                    </td>
                                    <td className="cell">
                                        <input className="input" id="transferTo"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="cell">Amount</td>
                                    <td className="cell">
                                        <input className="input" id="transferFromAmount"></input>
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
                                        <button className="pure-button" onClick={this.transferMint}>></button>
                                        <span>Mint to</span>
                                    </td>
                                    <td className="cell">
                                        <input className="input" id="mint"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="cell">Amount</td>
                                    <td className="cell">
                                        <input className="input" id="mintAmount"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="cell">
                                        <button className="pure-button" onClick={this.transferNewOwner}>></button>
                                        <span>newOwner</span>
                                    </td>
                                    <td className="cell">
                                        <input className="input" id="newOwner"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="cell" colSpan={2}>
                                        <button className="pure-button" onClick={this.finishMinting}>fishing mint</button>
                                        <button className="pure-button" onClick={this.transferOwnership}>newOwner</button>
                                        <button className="pure-button" onClick={this.mintable}>mint</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        )};
    }
}

export default SimpleTokenCoin
