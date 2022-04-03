const { inTransaction } = require("@openzeppelin/test-helpers/src/expectEvent");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");

const SimpleStorage = artifacts.require("./SimpleStorage.sol");

contract("SimpleStorage", (accounts) => {
    //accounts tableaux des comptes dispos sur ganache (ou reseau en gnl)
    it("...should store the value 89.", async() => {
        const simpleStorageInstance = await SimpleStorage.deployed();
        //instance de notre SimpleStorage a l'adresse deployee
        //a partir de cette instance on poura lancer nos tests
        //on appelle en await car on est en asynchrone

        // Set value of 89
        const value = 89;
        await simpleStorageInstance.set(value, { from: accounts[0] });
        //test de la fct set
        //on set la valeur 89 depuis le compte 0, ie c'est ce cpt qui va depenser son gas pour la fct set

        // Get stored value
        const storedData = await simpleStorageInstance.get.call();
        //on recupere la valeur qui a été set => du coup ça fait tester de set et le get, car var est private
        //cette fct est view dc pas besoin de from account car on ne signe pas la transaction,
        //pour ce faire on l'utilise avec le .call() methode de get pour ne pas preciser depuis quel cpt on fait la transac

        assert.equal(storedData, value, "The value 89 was not stored.");
        //assert est directmt integree a truffle
    });
});