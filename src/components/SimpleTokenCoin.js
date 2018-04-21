import React, {Component} from 'react'
//import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
//import SimpleToken from '../build/contracts/SimpleToken.json'
import SimpleTokenMint from '../../build/contracts/SimpleTokenMint.json'
import getWeb3 from '../utils/getWeb3'
import Test from './test'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

class SimpleTokenCoin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            accounnts: null,
            storageValue: 0,
            web3: null,
            name: null,
            owner: null,
            balance: null,
            mint: null
        }
    }

    componentWillMount() {
        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3
                });

                // Instantiate contract once web3 provided.

                this.instantiateContract()
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }


    instantiateContract() {
        const contract = require('truffle-contract');

        this.setState({
            accounnts: this.state.web3.eth.accounts
        });

        //const simpleStorage = contract(SimpleStorageContract)
        //const simpleToken = contract(SimpleToken)
        const simpleTokenMint = contract(SimpleTokenMint);

        //simpleStorage.setProvider(this.state.web3.currentProvider)
        //simpleToken.setProvider(this.state.web3.currentProvider)
        simpleTokenMint.setProvider(this.state.web3.currentProvider)

        var simpleStorageInstance;
        var account_one = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
        // Get accounts.

        simpleTokenMint.deployed().then(function(instance) {
            simpleStorageInstance = instance;
            console.log(simpleStorageInstance);

            return simpleStorageInstance.name()
            //console.log(simpleStorageInstance.mint(account_one, 10, {from: account_one}));
            //return simpleStorageInstance.mint(account_one, 10, {from: account_one})
            //return simpleStorageInstance.balanceOf(account_one)
        }).then((result) => {
          return this.setState({name: result})
          //return this.setState({balance: result.toNumber()})
          //return this.setState({mint: result})
        })

        /*this.state.web3.eth.getAccounts((error, accounts) => {
            simpleStorage.deployed().then((instance) => {
                simpleStorageInstance = instance

                // Stores a given value, 5 by default.
                return simpleStorageInstance.set(5, {from: accounts[0]})
            }).then((result) => {
                // Get the value from the contract to prove it worked.
                return simpleStorageInstance.get.call(accounts[0])
            }).then((result) => {
                // Update state with the result.
                return this.setState({storageValue: result.c[0]})
            })
        })*/
    }

    render() {
        var test = this.state.accounnts
        console.log(test);

        return (
            <div className="App">
                <nav className="navbar pure-menu pure-menu-horizontal">
                    <a href="#" className="pure-menu-heading pure-menu-link">SimpleToken</a>
                    <select id="leaveCode" name="leaveCode">
                        <Test props = {this.state.web3}/>
                    </select>
                </nav>

                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>Good to Go!</h1>
                            <p>Your Truffle Box is installed and ready.</p>
                            <h2>Smart Contract Example</h2>
                            <p>If your contracts compiled and migrated successfully, below will show a stored value of 5
                                (by default).</p>
                            <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
                            <p>The stored value is: {this.state.storageValue}</p>
                            <p>The Name is: {this.state.name}</p>
                            <p>The Owner is: {this.state.owner}</p>
                            <p>The Balance is: {this.state.balance}</p>
                            <p>The Mintable is: {this.state.mint}</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default SimpleTokenCoin
