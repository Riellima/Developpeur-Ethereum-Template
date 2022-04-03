// erc20.test.js
const { BN, ether } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const ERC20Token = artifacts.require("ERC20Token");

contract("ERC20", function(accounts) {
    const _name = "ALYRA";
    const _symbol = "ALY";
    const _initialsupply = new BN(1000);
    const _decimals = new BN(18);
    const owner = accounts[0];
    const fromOwner = { from: owner };
    const recipient = accounts[1];
    const spender = accounts[2];
    let ERC20Instance;

    beforeEach(async function() {
        ERC20Instance = await ERC20Token.new(_initialsupply, fromOwner);
    });

    it("has a name", async() => {
        expect(await ERC20Instance.name.call()).to.equal(_name);
    });

    it("has a symbol", async() => {
        expect(await ERC20Instance.symbol()).to.equal(_symbol);
    });

    it("has decimals", async() => {
        expect(await ERC20Instance.decimals()).to.be.bignumber.equal(_decimals);
    });

    it("verifies the balance of owner", async() => {
        const balanceOwner = await ERC20Instance.balanceOf(owner);
        const totalSupply = await ERC20Instance.totalSupply();

        expect(balanceOwner).to.be.bignumber.equal(totalSupply);
    });

    it("verifies a recipient balance after a transfer", async() => {
        const amount = new BN(25);
        const recipientBalanceBefore = await ERC20Instance.balanceOf(recipient);
        await ERC20Instance.transfer(recipient, amount, fromOwner);

        expect(recipientBalanceBefore.add(amount)).to.be.bignumber.equal(
            await ERC20Instance.balanceOf(recipient)
        );
    });

    it("verifies the owner balance after a transfer", async() => {
        const amount = new BN(47);
        const ownerBalanceBefore = await ERC20Instance.balanceOf(owner);
        await ERC20Instance.transfer(recipient, amount, fromOwner);

        expect(ownerBalanceBefore.sub(amount)).to.be.bignumber.equal(
            await ERC20Instance.balanceOf(owner)
        );
    });

    it("verifies an allowance", async() => {
        let spenderAllowanceBefore = await ERC20Instance.allowance(owner, spender);
        let amount = new BN(10);

        await ERC20Instance.approve(spender, amount, fromOwner);

        let spenderAllowanceAfter = await ERC20Instance.allowance(owner, spender);

        expect(spenderAllowanceAfter).to.be.bignumber.equal(
            spenderAllowanceBefore.add(amount)
        );
    });
});