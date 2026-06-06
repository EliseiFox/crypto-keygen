import { initWasm } from '@trustwallet/wallet-core';

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

export async function getDetailedWalletData({
    mnemonic,
    coinKey,
    account = 0,
    isInternal = false,
    variant = 'nativeSegwit' // Options: legacy, nested, native, taproot
}) {
    // Initialize Wasm module
    const core = await initWasm();
    const { HDWallet, CoinType, Purpose, HDVersion, AnyAddress, Curve } = core;

    // 1. Initialize HDWallet using the provided mnemonic
    const wallet = HDWallet.createWithMnemonic(mnemonic, "");

    const config = COIN_MAP[coinKey];
    if (!config) throw new Error(`Coin ${coinKey} not supported`);
    
    const coin = CoinType[config.coin];
    const change = isInternal ? 1 : 0;

    // 2. Determine Purpose (BIP) and HD Key Version (mostly for Bitcoin)
    let purpose = Purpose.bip44;
    let hdVersion = HDVersion.xprv; // Default xprv

    if (coinKey === 'BTC') {
        switch (variant) {
            case 'legacy': 
                purpose = Purpose.bip44; 
                hdVersion = HDVersion.xprv; // Starts with xprv
                break;
            case 'nested': 
                purpose = Purpose.bip49; 
                hdVersion = HDVersion.yprv; // Starts with yprv
                break;
            case 'native': 
                purpose = Purpose.bip84; 
                hdVersion = HDVersion.zprv; // Starts with zprv
                break;
            case 'taproot': 
                purpose = Purpose.bip86; 
                hdVersion = HDVersion.xprv; // Taproot standard uses xprv/zprv
                break;
        }
    }

    // 3. Construct the Derivation Path
    // Wallet Core follows: m / purpose' / coin' / account' / change / index
    const purposeValue = (variant === 'native') ? 84 : (variant === 'nested' ? 49 : (variant === 'taproot' ? 86 : 44));
    const derivationPath = `m/${purposeValue}'/${config.type}'/${account}'/${change}`;

    // 4. Aggregate Wallet Data
    const result = {
        mnemonic: wallet.mnemonic(),
        seed: Buffer.from(wallet.seed()).toString('hex'),
        // BIP32 Root Key (Master Key for the Secp256k1 curve)
        rootKey: wallet.getMasterKey(Curve.secp256k1).data().toString(), 
        // Account-level Extended Private Key (e.g., xprv/yprv/zprv)
        extendedPrivateKey: wallet.getExtendedPrivateKey(purpose, coin, hdVersion),
        derivationPath: derivationPath,
        addresses: []
    };

    // 5. Generate 10 addresses based on the derivation path indices
    for (let i = 0; i < 10; i++) {
        const fullPath = `${derivationPath}/${i}`;
        
        // Derive private key for the specific path
        const privateKey = wallet.getKey(coin, fullPath);
        // Get public key from private key
        const publicKey = privateKey.getPublicKey(coin);
        // Generate formatted address string
        const address = AnyAddress.createWithPublicKey(publicKey, coin).description();

        result.addresses.push({
            index: i,
            path: fullPath,
            address: address
        });
    }

    return result;
}

// USAGE EXAMPLES
const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

// Example 1: Bitcoin Native SegWit (bc1q...)
getDetailedWalletData({
    mnemonic: mnemonic,
    coinKey: 'BTC',
    variant: 'native',
    account: 0
}).then(data => {
    console.log("--- BITCOIN NATIVE SEGWIT DATA ---");
    console.log("Extended Key:", data.extendedPrivateKey);
    console.log("Path:", data.derivationPath);
    console.log("Addresses:", data.addresses);
}).catch(console.error);

// Example 2: Ethereum (0x...)
getDetailedWalletData({
    mnemonic: mnemonic,
    coinKey: 'ETH',
    account: 0
}).then(res => {
    console.log("\n--- ETHEREUM ADDRESS INDEX 0 ---");
    console.log("Address:", res.addresses[0].address);
});