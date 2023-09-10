import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import myEpicNft from "./utils/MyEpicNFT.json"
import twitterLogo from './assets/twitter-logo.svg';
import './styles/App.css';

// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = 'auaiyuma';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CONTRACT_ADDRESS = "0xC8304b49CFEb0eDf6a2C50F8334F0c2240De790c";
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [currentNFTNum, setCurrentNFTNum] = useState(0);
  console.log("[init] currentAccount: ", currentAccount);

  const checkIWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.error(); ("Make sure you have Metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);

      // この時点で、ユーザーはウォレット接続が済んでいる
      setupEventListener();
    } else {
      console.error("No authorized account found!");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      })
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      setupEventListener();
    } catch (error) {
      console.error(error);
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer,
        );

        connectedContract.on('NewEpicNFTMinted', (from, tokenId, currentNFTNum) => {
          console.log(from, tokenId.toNumber(), currentNFTNum.toNumber());
          setCurrentNFTNum(currentNFTNum.toNumber())
          alert(
            `あなたのウォレットにNFTを送信しました。gemcaseに表示されるまで数分かかることがあります。\n
            NFTへのリンクはこちらです:\n
             https://gemcase.vercel.app/view/evm/sepolia/${CONTRACT_ADDRESS}/${tokenId.toNumber()}
            `
          );
        });
        console.log("Setup event listener");
      } else {
        console.error("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error(error);
    }
  }
  const askContratToMintNft = async () => {

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(`Minted, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.error("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error(error);
    }

  }

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button
      onClick={askContratToMintNft}
      className='cta-button connect-wallet-button'>
      Mint NFT
    </button>
  )

  const renderMintNum = () => (
    <p className='sub-text'>{"これまでに作成された" + currentNFTNum + "/" + TOTAL_MINT_COUNT + "NFT"}</p>
  )

  useEffect(() => {
    checkIWalletIsConnected();
  })

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">あなただけの特別な NFT を Mint しよう💫</p>
          {renderMintNum()}
          <p className="sub-text">{currentAccount ? currentAccount.slice(0, 4) + "..." + currentAccount.slice(-4) : ""}</p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()
          }
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
