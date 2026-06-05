import * as bip39 from '@scure/bip39';
import * as newBip39 from 'bip39';

import { wordlist as czech } from '@scure/bip39/wordlists/czech.js';
import { wordlist as english} from '@scure/bip39/wordlists/english.js';
import { wordlist as french } from '@scure/bip39/wordlists/french.js';
import { wordlist as italian } from '@scure/bip39/wordlists/italian.js';
import { wordlist as japanese } from '@scure/bip39/wordlists/japanese.js';
import { wordlist as korean } from '@scure/bip39/wordlists/korean.js';
import { wordlist as portuguese } from '@scure/bip39/wordlists/portuguese.js';
import { wordlist as simplifiedChinese } from '@scure/bip39/wordlists/simplified-chinese.js';
import { wordlist as spanish } from '@scure/bip39/wordlists/spanish.js';
import { wordlist as traditionalChinese } from '@scure/bip39/wordlists/traditional-chinese.js';

import { HDKey } from '@scure/bip32';
import { BIP32Factory  } from 'bip32';

import * as ecc from 'tiny-secp256k1';


import * as bitcoin from 'bitcoinjs-lib';
import { ethers } from 'ethers';
import { Keypair } from '@solana/web3.js';

const bip32 = BIP32Factory(ecc);

const wordlists = {
    czech,
    english,
    french,
    italian,
    japanese,
    korean,
    portuguese,
    simplifiedChinese,
    spanish,
    traditionalChinese
};

// ETHEREUM ADDRESS GENERATION
function getEthereumAddress(masterKey) {
    const path = "m/44'/60'/0'/0/0";
    const childNode = masterKey.derive(path);
    
    // Format the private key to hexadecimal
    const privateKeyHex = Buffer.from(childNode.privateKey).toString('hex');
    const wallet = new ethers.Wallet(privateKeyHex);
    
    return wallet.address;
}

// BITCOIN ADDRESS GENERATION 2
function getBitcoinAddress(masterKey) {
    const path = "m/84'/0'/0'/0/0";
    const childNode = masterKey.derivePath(path);
    
    // Public key is required for address generation
    const { address } = bitcoin.payments.p2wpkh({
        pubkey: childNode.publicKey,
        network: bitcoin.networks.bitcoin
    });
    
    return address;
}

// SOLANA ADDRESS GENERATION
function getSolanaAddress(masterKey) {
    const path = "m/44'/501'/0'/0'";
    const childNode = masterKey.derive(path);
    
    // Solana uses the Ed25519 curve; Keypair is created from the session private key (seed)
    const keypair = Keypair.fromSeed(childNode.privateKey);
    
    return keypair.publicKey.toBase58();
}

/*
console.log('--- Generating addresses from seed phrase ---');
console.log('Ethereum/EVM (m/44\'/60\'/0\'/0/0): ', getEthereumAddress(masterNode));
console.log('Bitcoin Segwit (m/84\'/0\'/0\'/0/0): ', getBitcoinAddress(masterNode));
console.log('Solana (m/44\'/501\'/0\'/0\'):        ', getSolanaAddress(masterNode));
console.log('---------------------------------------------'); */


export default function mnemonicJsonGen(mnemonicSize, language) {
    console.log(mnemonicSize)

    const mnemonic = bip39.generateMnemonic(wordlists[language], mnemonicSize);

    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const seed2 = newBip39.mnemonicToSeedSync(mnemonic)


    console.log('--------------------------------------------------');
    console.log('Mnemonic:');
    console.log(mnemonic);
    console.log('Seed 1:');
    console.log(seed);
    console.log('Seed 2:');
    console.log(seed2);
    console.log('--------------------------------------------------');
    console.log();

    const masterNode = HDKey.fromMasterSeed(seed);
    const masterNode2 = bip32.fromSeed(seed2);

    console.log('--------------------------------------------------');
    console.log('Master Node 1:');
    console.log(masterNode);
    console.log('Master Node 2:');
    console.log(masterNode2);
    console.log('--------------------------------------------------');
    console.log();


    const ethereumAddress =  getEthereumAddress(masterNode);
    const bitcoinAddress = getBitcoinAddress(masterNode2);
    const solanaAddress = getSolanaAddress(masterNode);
    
    return {
        mnemonic: mnemonic,
        ethereumAddress: ethereumAddress,
        bitcoinAddress: bitcoinAddress,
        solanaAddress: solanaAddress
    };
}