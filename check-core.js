import { initWasm } from '@trustwallet/wallet-core';

async function check() {
    const core = await initWasm();
    console.log('Core keys:', Object.keys(core));
    if (core.HDWallet) {
        console.log('HDWallet keys:', Object.keys(core.HDWallet));
    }
    if (core.Mnemonic) {
        console.log('Mnemonic keys:', Object.keys(core.Mnemonic));
    }
}

check();
