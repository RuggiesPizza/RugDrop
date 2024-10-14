import { expect } from "chai";
import { ethers } from "hardhat";

describe("Deployment Test", function () {
  let RugDrop: any;
  let TestToken: any;
  
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;
  
  let ownerAddress: any;
  let TestTokenAddress: any;

  beforeEach(async function() {
    RugDrop = await ethers.getContractFactory("RugDrop");
    TestToken = await ethers.getContractFactory("Ruggie");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();

    //Deploy TestToken1
    TestToken = await TestToken.deploy();
    await TestToken.waitForDeployment();

    TestTokenAddress = await TestToken.getAddress();

    //Deploy RugPoolFactory.sol
    RugDrop = await RugDrop.deploy();
    await RugDrop.waitForDeployment();
  });

  it("Verify Factory Deployment", async function () {
    // Verify RugPoolFactory Deployment
    expect(await RugDrop.owner()).to.equal(ownerAddress);
  });
});