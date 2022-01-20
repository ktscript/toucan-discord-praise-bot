import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ToucanPraiseToken } from "../typechain-types/ToucanPraiseToken";
import { ToucanPraiseToken__factory } from "../typechain-types/factories/ToucanPraiseToken__factory";

describe("ToucanPraiseToken", function () {
  let tpt: ToucanPraiseToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const tptFactory = (await ethers.getContractFactory(
      "ToucanPraiseToken",
      owner
    )) as ToucanPraiseToken__factory;
    tpt = await tptFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await tpt.balanceOf(owner.address);
      expect(await tpt.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Praise", function () {
    it("Should mint 1 token in addr2", async function () {
      await tpt.praise(addr1.address, addr2.address);
      const addr1Balance = await tpt.balanceOf(addr1.address);
      const addr2Balance = await tpt.balanceOf(addr2.address);
      expect(addr1Balance).to.equal(0);
      expect(addr2Balance).to.equal(1);
    });

    it("Should mint 20 tokens in addr2 and 2 tokens in addr1", async function () {
      for (let index = 0; index < 20; index++) {
        await tpt.praise(addr1.address, addr2.address);
      }
      await tpt.praise(addr2.address, addr1.address);
      const addr1Balance = await tpt.balanceOf(addr1.address);
      const addr2Balance = await tpt.balanceOf(addr2.address);
      expect(addr1Balance).to.equal(2);
      expect(addr2Balance).to.equal(20);
    });

    it("Should fail since you're trying to praise yourself", async function () {
      const initialOwnerBalance = await tpt.balanceOf(owner.address);

      // Try to send praise yourself.
      // `require` will evaluate false and revert the transaction.
      await expect(tpt.praise(owner.address, owner.address)).to.be.revertedWith(
        "Can't praise yourself"
      );

      // Owner balance shouldn't have changed.
      expect(await tpt.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });
});
