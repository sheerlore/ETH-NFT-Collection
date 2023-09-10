const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect } = require('chai')

describe('MyEpicNFT', function () {
    async function deployMyEpicNFTFixture() {
        const [owner] = await ethers.getSigners();

        const firstWords = [
            "Oliver",
            "Muhammed",
            "Noah",
            "Harry",
            "Jack",
            "John"
        ];
        const secondWords = [
            "likes",
            "hates",
            "loves",
            "makes",
            "creates",
            "writes"
        ];
        const thirdWords = [
            "JavaScript",
            "TypeScript",
            "Python",
            "Java",
            "PHP",
            "Solidity"
        ];
        const MyEpicNFTFactory = await ethers.getContractFactory("MyEpicNFT");
        const MyEpicNFT = await MyEpicNFTFactory.deploy();

        return { MyEpicNFT, owner, firstWords, secondWords, thirdWords };
    }

    describe('pickRandomWord', function () {
        it('should get strings in firstWords', async function () {
            const { MyEpicNFT, firstWords } = await loadFixture(deployMyEpicNFTFixture);
            expect(firstWords).to.include(await MyEpicNFT.pickRandomFirstWord(0));
        })
        it('should get strings in secondWords', async function () {
            const { MyEpicNFT, secondWords } = await loadFixture(deployMyEpicNFTFixture);
            expect(secondWords).to.include(await MyEpicNFT.pickRandomSecondWord(0));
        })
        it('should get strings in thirdWords', async function () {
            const { MyEpicNFT, thirdWords } = await loadFixture(deployMyEpicNFTFixture);
            expect(thirdWords).to.include(await MyEpicNFT.pickRandomThirdWord(0));
        })
    })

    describe('makeAnEpicNFT', function () {
        it('emit a NewEpicNFTMinted event', async function () {
            const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);

            await expect(MyEpicNFT.makeAnEpicNFT()).to.emit(MyEpicNFT, 'NewEpicNFTMinted').withArgs(owner.address, 1, 1);
        })
    })
})
