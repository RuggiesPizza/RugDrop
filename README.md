# RugDrop

Currently the Fantom Community performs aidrops through Dispure's dApp which charges 80 $FTM.
I wiped up a simple Solidity 101 contract to allow non-technical projects to perform airdrops without a fee.

This contract supports aidropping multiple addresses the same amount and airdropping multiple addresses different amounts, in a single call.
Addresses must be organized in an array and wrapped in quotes

ex: ```["0x11...111", "0x22...222", "0x33...333"]```

Amounts must be passed in wei value

ex: `1` FTM would be equal to `1000000000000000000`

Recommended resource: https://eth-converter.com/

# Developer Notes 
## Install Requirements
```sh
git clone https://github.com/RuggiesPizza/RugDrop.git
cd rugdrop
npm install 
```

## Test
On a new terminal, go to the repository's root folder and run this to
test the contract(s):

```sh
npx hardhat test
```