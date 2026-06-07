# BIP39 Phrase Generator

A simple and secure BIP39 phrase generator for creating cryptocurrency wallet seeds with advanced derivation support.

## Overview

This project generates BIP39 (Bitcoin Improvement Proposal 39) compliant mnemonic phrases for cryptocurrency wallets. It uses the Trust Wallet Core library to derive addresses for various cryptocurrencies and supports custom derivation paths.

## 🌐 Live Demo

Check out the live version of the BIP39 Phrase Generator:
[https://bip39-keygen-latest.onrender.com/](https://bip39-keygen-latest.onrender.com/)

## Features

- **Generate & Import**: Create new BIP39 mnemonic phrases or import existing ones.
- **Multilingual Support**: Supports English, Japanese, Spanish, Chinese, French, Italian, Korean, Czech, and Portuguese.
- **Single-Coin Generation**: Focused generation for one coin at a time for better performance and clarity.
- **Advanced Derivation Settings**:
    - **Purpose Selection**: Choose between BIP44 (Legacy), BIP49 (Nested SegWit), BIP84 (Native SegWit), and BIP86 (Taproot).
    - **Account Index**: Specify custom account numbers.
    - **Change/Internal Path**: Toggle between External (0) and Internal (1) chains, or set a custom index.
    - **Start Index**: Choose the starting index for address generation (generates 10 addresses starting from this index).
- **Supported Coins**: Bitcoin (all variants), Ethereum, Solana, Tron, Dogecoin, Binance Smart Chain, XRP, Cardano, TON, Polkadot, Polygon, and Avalanche.

## Tech Stack

- **Node.js & Express**: Backend server.
- **Trust Wallet Core**: Industrial-grade wallet logic for key derivation and address generation.
- **BIP39 (scure-bip39)**: Secure mnemonic generation and entropy handling.
- **Vanilla JavaScript/HTML/CSS**: Clean and fast frontend.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EliseiFox/crypto-keygen.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser at `http://localhost:3000`.

## Security

This tool is designed for educational and development purposes. Always ensure you are running it in a secure environment when handling real seed phrases.
