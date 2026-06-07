import { initWasm } from '@trustwallet/wallet-core';
import * as bip39 from '@scure/bip39';

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

/**
 * Normalizes a string by:
 * 1. Removing extra spaces (trim and internal multiple spaces)
 * 2. Converting to lowercase
 * 3. NFKD normalization
 */
export function normalizeString(str) {
    if (typeof str !== 'string') return '';
    return str
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .normalize('NFKD');
}

/**
 * Generates a mnemonic phrase based on size and language.
 * Only necessary logic transferred from keygen.js.
 */
export function mnemonicJsonGen(mnemonicSize, language) {
    const wordlist = wordlists[language] || english;
    const mnemonic = bip39.generateMnemonic(wordlist, mnemonicSize);
    return { mnemonic };
}

// Configuration map for supported coins
const COIN_MAP = {
    'BTC': { coin: 'bitcoin', type: 0 },
    'ETH': { coin: 'ethereum', type: 60 },
    'USDT': { coin: 'ethereum', type: 60 },
    'BNB': { coin: 'binanceSmartChain', type: 60 },
    'XRP': { coin: 'xrp', type: 144 },
    'USDC': { coin: 'ethereum', type: 60 },
    'SOL': { coin: 'solana', type: 501 },
    'TRX': { coin: 'tron', type: 195 },
    'DOGE': { coin: 'dogecoin', type: 3 },
    'ADA': { coin: 'cardano', type: 1815 },
    'TON': { coin: 'ton', type: 607 },
    'AVAX': { coin: 'avalancheCChain', type: 60 },
    'LINK': { coin: 'ethereum', type: 60 },
    'DOT': { coin: 'polkadot', type: 354 },
    'MATIC': { coin: 'polygon', type: 60 },
    'NEAR': { coin: 'near', type: 397 },
    'ICP': { coin: 'internetComputer', type: 223 },
    'APT': { coin: 'aptos', type: 637 },
    'RNDR': { coin: 'ethereum', type: 60 },
    'SHIB': { coin: 'ethereum', type: 60 },
};

/**
 * Generates detailed wallet data for a given coin using Trust Wallet Core.
 */
export async function getDetailedWalletData({
    mnemonic,
    mnemonicSize,
    language,
    coinKey,
    account = 0,
    change = 0,
    variant = 'native' // Options: legacy, nested, native, taproot
}) {
    const core = await initWasm();
    const { HDWallet, CoinType, Purpose, HDVersion, AnyAddress, Curve, Mnemonic } = core;

    mnemonic = normalizeString(mnemonic);

    console.log("str1: "+mnemonic);


    if (mnemonic) {
        // Validate imported mnemonic
        if (!bip39.validateMnemonic(mnemonic, wordlists[language])) {
            throw new Error('Invalid mnemonic phrase');
        }
    } else {
        // Generate a new mnemonic with language support
        const baseMnemonicData = mnemonicJsonGen(mnemonicSize, language);
        mnemonic = baseMnemonicData.mnemonic;
        console.log("str1: "+mnemonic)
    }

    const seed = bip39.mnemonicToEntropy(mnemonic, wordlists[language])
    console.log("str2 "+seed.toString('hex'))
    console.log("str3 "+Buffer.from(seed).toString('hex'))
    

    const wallet = HDWallet.createWithEntropy(seed, "");

    const config = COIN_MAP[coinKey];
    if (!config) throw new Error(`Coin ${coinKey} not supported`);
    
    const coin = CoinType[config.coin];

    let purpose = Purpose.bip44;
    let hdVersion = HDVersion.xprv;

    switch (variant) {
        case 'legacy': 
            purpose = Purpose.bip44; 
            hdVersion = HDVersion.xprv;
            break;
        case 'nested': 
            purpose = Purpose.bip49; 
            hdVersion = HDVersion.yprv;
            break;
        case 'native': 
            purpose = Purpose.bip84; 
            hdVersion = HDVersion.zprv;
            break;
        case 'taproot': 
            purpose = Purpose.bip86; 
            hdVersion = HDVersion.xprv;
            break;
    }

    const purposeValue = (variant === 'native') ? 84 : (variant === 'nested' ? 49 : (variant === 'taproot' ? 86 : 44));
    const derivationPath = `m/${purposeValue}'/${config.type}'/${account}'/${change}`;

    const result = {
        mnemonic: mnemonic,
        seed: Buffer.from(wallet.seed()).toString('hex'),
        rootKey: Buffer.from(seed).toString('hex'), 
        extendedPrivateKey: wallet.getExtendedPrivateKey(purpose, coin, hdVersion),
        derivationPath: derivationPath,
        addresses: []
    };

    for (let i = 0; i < 10; i++) {
        const fullPath = `${derivationPath}/${i}`;
        const privateKey = wallet.getKey(coin, fullPath);
        const publicKey = privateKey.getPublicKey(coin);
        const address = AnyAddress.createWithPublicKey(publicKey, coin).description();

        result.addresses.push({
            index: i,
            path: fullPath,
            address: address
        });
    }

    return result;
}
