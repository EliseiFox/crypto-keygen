# Crypto-Roma (Crypto Keygen)

Crypto-Roma is a multi-chain blockchain wallet generator built with Node.js and Express. It provides a web interface and API for generating BIP39 mnemonic phrases and deriving hierarchical deterministic (HD) wallet addresses for various cryptocurrency networks.

## 🚀 Features

- **BIP39 Mnemonic Generation**: Generate seed phrases (12, 15, 18, 21, or 24 words).
- **Multi-Language Support**: Supports English, Japanese, Spanish, Chinese (Simplified/Traditional), French, Italian, Korean, Czech, and Portuguese.
- **Multi-Chain Address Derivation**:
    - **Bitcoin (BTC)**: Native SegWit (Bech32, BIP84).
    - **Ethereum (ETH)**: Standard EVM addresses (BIP44).
    - **Solana (SOL)**: Ed25519-based public keys.
- **Advanced Wallet Data**: Support for extended private keys (xprv, yprv, zprv) and derivation path exploration via Trust Wallet Core.
- **Web Interface**: Simple and intuitive UI for generating phrases and viewing addresses.

## 🛠 Technical Stack

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Crypto Libraries**:
    - `@scure/bip39` & `bip39`: Mnemonic and seed logic.
    - `bitcoinjs-lib`: Bitcoin network operations.
    - `ethers`: Ethereum wallet management.
    - `@solana/web3.js`: Solana keypair utilities.
    - `@trustwallet/wallet-core`: WASM-based multi-coin wallet support.
- **Deployment**: Docker support included.

## 📂 Project Structure

- `server.js`: The Express server and API entry point.
- `keygen.js`: Core logic for standard BTC, ETH, and SOL address generation.
- `keygen-trust-wallet.js`: Advanced generation logic using Trust Wallet Core for detailed wallet data.
- `public/`: Contains the frontend assets (HTML, CSS, JS).
- `Dockerfile`: Containerization configuration.

## 🛠 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Server**:
   ```bash
   npm start
   ```

3. **Access the App**:
   Open `http://localhost:3000` in your browser.

## 📡 API Usage

**POST `/api/data`**
Generates a new mnemonic and derived addresses.

**Payload**:
```json
{
  "mnemonicSize": 256,
  "language": "english"
}
```

## 📄 License

This project is licensed under the ISC License.
