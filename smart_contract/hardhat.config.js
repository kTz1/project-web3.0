require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/OzVddfqGFV_GNE0tTCx3zk3571wtGP9E',
      accounts: [ '3f013ac8ec8a332941948478bb470dd1805a7f72826313596f118caff31df69a' ]
    }
  }
}
