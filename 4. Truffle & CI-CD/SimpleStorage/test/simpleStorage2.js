const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { inTransaction } = require("@openzeppelin/test-helpers/src/expectEvent");
const { expect } = require("chai");

contract("SimpleStorage2", (accounts) => {
    let simpleStorageInstance;
    const fromAccount0 = { from: accounts[0] };
    const bn89 = new BN(89);

    describe("Test complet", () => {
        beforeEach(async() => {
            simpleStorageInstance = await SimpleStorage.new(fromAccount0);
        });

        it("should store the value 89", async() => {
            await simpleStorageInstance.set(bn89, fromAccount0);
            const storedData = await simpleStorageInstance.get.call();
            expect(storedData).to.be.bignumber.equal(bn89);
        });

        it("should revert on setting value 0", async() => {
            await expectRevert(
                simpleStorageInstance.set(new BN(0), fromAccount0),
                "vous ne pouvez pas mettre une valeur nulle"
            ); //meme message d'erreur que celui qui est dans le require du set
        });

        it.only("should send dataStored event on set", async() => {
            expectEvent(await simpleStorageInstance.set(bn89), "dataStored", {
                _data: bn89,
                _addr: accounts[0],
            }); //action, nomEvent, arguments de l'event
        });
    });
});