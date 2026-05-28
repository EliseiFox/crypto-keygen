import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';

import { HDKey } from '@scure/bip32';

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
console.log();