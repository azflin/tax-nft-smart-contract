const { expect } = require('chai');

describe('taxNFT contract', function () {
  before(async function () {
    this.TaxNFT = await ethers.getContractFactory('TaxNFT');
  });

  beforeEach(async function () {
    taxNFT = await this.TaxNFT.deploy();
    await taxNFT.deployed();

    [this.account1, this.account2, this.account3] = await ethers.getSigners();
    this.taxNFT = await ethers.getContractAt(
      'TaxNFT',
      taxNFT.address
    );
  });

  it("should only mint when minting isn't paused", async function () {
    const taxNFT = this.taxNFT.connect(this.account1);
    await taxNFT.mint(1, {value: ethers.utils.parseEther("0.08")});
    await taxNFT.setMintingPaused(true);
    await expect(taxNFT.mint(1, {value: ethers.utils.parseEther("0.08")})).to.be.revertedWith("Minting has been paused.");
  });

  it("should withdraw correct amounts", async function () {
    const taxNFT = this.taxNFT.connect(this.account1);
    await taxNFT.mint(10, {value: ethers.utils.parseEther("0.8")});
    await taxNFT.withdraw();
    // These 3 addresses are the default hardhat accounts that start with 10,000 ETH
    expect(await ethers.provider.getBalance(await taxNFT.dev1())).to.equal(ethers.utils.parseEther("10000.04"));
    expect(await ethers.provider.getBalance(await taxNFT.dev2())).to.equal(ethers.utils.parseEther("10000.04"));
    expect(await ethers.provider.getBalance(await taxNFT.otherPayee())).to.equal(ethers.utils.parseEther("10000.72"));
  });

  it("should claim code", async function () {
    const taxNFT = this.taxNFT.connect(this.account1);
    await taxNFT.mint(1, {value: ethers.utils.parseEther("0.08")});
    expect(await taxNFT.claimedCode(1)).to.equal('0x0000000000000000000000000000000000000000');
    await taxNFT.claimCode(1);
    expect(await taxNFT.claimedCode(1)).to.equal(this.account1.address);
  });

  it("should not let you claim claimed code", async function () {
    const taxNFT = this.taxNFT.connect(this.account1);
    await taxNFT.mint(1, {value: ethers.utils.parseEther("0.08")});
    expect(await taxNFT.claimedCode(1)).to.equal('0x0000000000000000000000000000000000000000');
    await taxNFT.claimCode(1);
    await expect(taxNFT.claimCode(1)).to.be.revertedWith("tokenId has already been claimed");
  });

  it("should not let you claim a code if you don't own the NFT", async function () {
    let taxNFT = this.taxNFT.connect(this.account1);
    await taxNFT.mint(1, {value: ethers.utils.parseEther("0.08")});
    taxNFT = this.taxNFT.connect(this.account2);
    await expect(taxNFT.claimCode(1)).to.be.revertedWith("You do not own this tokenId");
  });
});