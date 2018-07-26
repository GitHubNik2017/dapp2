var SimpleTokenMint = artifacts.require("./SimpleTokenMint.sol");

module.exports = function(deployer) {
    deployer.deploy(SimpleTokenMint);
};
