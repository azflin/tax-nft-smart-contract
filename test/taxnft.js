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

  it("should be named TaxNFT", async function () {
    expect(await this.taxNFT.name()).to.be.equal("TaxNFT");
  });

  it("should only mint when minting isn't paused", async function () {
    const taxNFT = this.taxNFT.connect(this.account1);
    await taxNFT.mint(1, {value: ethers.utils.parseEther("0.08")});
    await taxNFT.setMintingPaused(true);
    await expect(taxNFT.mint(1, {value: ethers.utils.parseEther("0.08")})).to.be.revertedWith("Minting has been paused.");
  });
});