import { expect } from "chai";
import { ethers } from "hardhat";

describe("RugDrop Test", function () {
  let RugDrop: any;
  let TestToken: any;
  let TestToken2: any;
  
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;
  
  let ownerAddress: any;
  let addr1Address: any;
  let addr2Address: any;
  let RugDropAddress: any;
  let TestTokenAddress: any;
  let TestTokenAddress2: any;

  beforeEach(async function() {
    RugDrop = await ethers.getContractFactory("RugDrop");
    TestToken = await ethers.getContractFactory("Ruggie");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    addr1Address = await addr1.getAddress();
    addr2Address = await addr2.getAddress();

    //Deploy TestToken1
    TestToken = await TestToken.deploy();
    await TestToken.waitForDeployment();

    TestTokenAddress = await TestToken.getAddress();

    //Deploy RugPoolFactory.sol
    RugDrop = await RugDrop.deploy();
    await RugDrop.waitForDeployment();

    RugDropAddress = await RugDrop.getAddress();
  });

  it("Test Single Amount RugDrop", async function () {
    expect(await TestToken.balanceOf(addr1Address)).to.equal(0);
    expect(await TestToken.balanceOf(addr2Address)).to.equal(0);

    await TestToken.approve(RugDrop, ethers.parseEther("50"));
    await RugDrop.RugDrop([ownerAddress, addr1Address, addr2Address], 5, TestTokenAddress);

    expect(await TestToken.balanceOf(addr1Address)).to.equal(5);
    expect(await TestToken.balanceOf(addr2Address)).to.equal(5);
  });

  it("Test Multiple Amounts RugDrop", async function () {
    expect(await TestToken.balanceOf(addr1Address)).to.equal(0);
    expect(await TestToken.balanceOf(addr2Address)).to.equal(0);

    await TestToken.approve(RugDrop, ethers.parseEther("50"));
    await RugDrop.RugDropMulti([ownerAddress, addr1Address, addr2Address], [1, 5, 7], TestTokenAddress);

    expect(await TestToken.balanceOf(addr1Address)).to.equal(5);
    expect(await TestToken.balanceOf(addr2Address)).to.equal(7);
  });

  it("Test ERC-20 Donations", async function () {
    TestToken2 = await ethers.getContractFactory("Ruggie");

    TestToken2 = await TestToken2.connect(addr1).deploy();
    await TestToken2.waitForDeployment();

    TestTokenAddress2 = await TestToken2.getAddress();

    await TestToken2.connect(addr1).transfer(RugDropAddress, ethers.parseEther("1"));

    expect(await TestToken2.balanceOf(RugDropAddress)).to.equal(ethers.parseEther("1"));
    expect(await TestToken2.balanceOf(ownerAddress)).to.equal(ethers.parseEther("0"));

    await RugDrop.withdrawERC20Donations(TestTokenAddress2);

    expect(await TestToken2.balanceOf(RugDropAddress)).to.equal(ethers.parseEther("0"));
    expect(await TestToken2.balanceOf(ownerAddress)).to.equal(ethers.parseEther("1"));
  });
});