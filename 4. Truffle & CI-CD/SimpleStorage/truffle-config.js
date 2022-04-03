const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
        },

        ropsten: {
            provider: function() {
                return new HDWalletProvider({
                    mnemonic: { phrase: `${process.env.MNEMONIC}` },
                    providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
                    from: 0x44d15a84ea024ffc12c2b861b6b2dd8124f5fc36,
                });
            },
            network_id: 3,
        },

        kovan: {
            provider: function() {
                return new HDWalletProvider({
                    mnemonic: { phrase: `${process.env.MNEMONIC}` },
                    providerOrUrl: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`,
                });
            },
            network_id: 42,
        },
    },

    mocha: {},

    compilers: {
        solc: {
            version: "0.8.13", // Récupérer la version exacte de solc-bin (par défaut : la  version de truffle)
            settings: {
                // Voir les documents de solidity pour des conseils sur l'optimisation et l'evmVersion
                optimizer: {
                    enabled: false,
                    runs: 200,
                },
            },
        },
    },
};