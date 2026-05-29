import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';

import { HDKey } from '@scure/bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { ethers } from 'ethers';
import { Keypair } from '@solana/web3.js';


const mnemonic128 = bip39.generateMnemonic(wordlist, 128);

console.log('Generated 12-word phrase:');
console.log(mnemonic128);
console.log('--------------------------------------------------');
console.log();

const mnemonic256 = bip39.generateMnemonic(wordlist, 256);


console.log('Generated 24-word phrase:');
console.log(mnemonic256);
console.log('--------------------------------------------------');
console.log();

// Reversible: Converts mnemonic string to raw entropy in form of byte array.
const ent = bip39.mnemonicToEntropy(mnemonic128, wordlist);

console.log('Phrase 12 in numeric form (entropy):');
console.log(ent);
console.log('--------------------------------------------------');
console.log();

const repared128 = bip39.entropyToMnemonic(ent, wordlist);

console.log('Phrase 12 restored from entropy:');
console.log(repared128);
console.log('--------------------------------------------------');
console.log();

const isValide128 = bip39.validateMnemonic(mnemonic128, wordlist);
const isValide256 = bip39.validateMnemonic(mnemonic256, wordlist);


console.log('Validity check:');
console.log("Phrase 12: ", isValide128);
console.log("Phrase 24: ", isValide256);
console.log('--------------------------------------------------');
console.log();

//---------------------------------------------------------------------
//---------------------------------------------------------------------

/*
const seed = bip39.mnemonicToSeedSync(mnemonic128);

console.log('--------------------------------------------------');
console.log('Seed 12:');
console.log(seed);
console.log('--------------------------------------------------');
console.log();

const masterNode = HDKey.fromMasterSeed(seed);

console.log('masterNode 12:');
console.log(masterNode);
console.log('--------------------------------------------------');
console.log(); */

// ETHEREUM ADDRESS GENERATION
function getEthereumAddress(masterKey) {
    const path = "m/44'/60'/0'/0/0";
    const childNode = masterKey.derive(path);
    
    // Format the private key to hexadecimal
    const privateKeyHex = Buffer.from(childNode.privateKey).toString('hex');
    const wallet = new ethers.Wallet(privateKeyHex);
    
    return wallet.address;
}


// BITCOIN ADDRESS GENERATION
function getBitcoinAddress(masterKey) {
    const path = "m/84'/0'/0'/0/0";
    const childNode = masterKey.derive(path);
    
    // Public key is required for address generation
    const { address } = bitcoin.payments.p2wpkh({
        pubkey: Buffer.from(childNode.publicKey),
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


export default function mnemonicJsonGen() {
    
    const mnemonic = bip39.generateMnemonic(wordlist, 128);

    const seed = bip39.mnemonicToSeedSync(mnemonic);

    console.log('--------------------------------------------------');
    console.log('Seed 12:');
    console.log(seed);
    console.log('--------------------------------------------------');
    console.log();

    const masterNode = HDKey.fromMasterSeed(seed);


    const ethereumAddress =  getEthereumAddress(masterNode);
    const bitcoinAddress = getBitcoinAddress(masterNode);
    const solanaAddress = getSolanaAddress(masterNode);
    
    return {
        mnemonic: mnemonic,
        ethereumAddress: ethereumAddress,
        bitcoinAddress: bitcoinAddress,
        solanaAddress: solanaAddress
    };
}