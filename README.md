# Mnemonic Safe React App

A secure React application for backing up and recovering BIP-39 mnemonic phrases using Shamir's Secret Sharing and AES-256-GCM encryption. This app is built to work entirely in the browser for maximum security and privacy.

## Features

- **Generate Secure Shares**: Split your mnemonic phrase into multiple encrypted shares
- **Password Protection**: Each share is encrypted with a password
- **QR Code Generation**: Generate QR codes for easy storage and sharing
- **Flexible Configuration**: Set total shares and threshold (minimum required)
- **Reconstruction**: Recover your mnemonic phrase from encrypted shares
- **Modern UI**: Beautiful, responsive interface built with React and Vite
- **Browser-Native**: All cryptographic operations happen locally in the browser
- **📱 Progressive Web App (PWA)**: Install on iOS/Android for offline access
- **🔒 Offline Security**: Works completely offline once installed
- **📎 App Shortcuts**: Quick access to generate, reconstruct, or learn features

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Modern browser with Web Crypto API support

### Installation

1. Navigate to the project directory:
   ```bash
   cd mnemonic-safe-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 Progressive Web App (PWA) Installation

Mnemonic Safe can be installed as a native app on your mobile device or computer for enhanced security and offline access.

### Installing on Mobile (iOS/Android)

**🚀 Automatic Install Prompt**: The app automatically detects mobile devices and shows a guided installation modal 2 seconds after loading (if not dismissed recently).

#### iOS (Safari):
1. **Automatic**: Wait for the install modal to appear, or
2. **Manual**: Tap the Share button (□↗) → "Add to Home Screen" → "Add"

#### Android (Chrome):
1. **Automatic**: Wait for the install modal to appear, or  
2. **Manual**: Tap the menu (⋮) → "Add to Home screen" → "Install"

#### Smart Features:
- **📱 Platform Detection**: Shows iOS/Android-specific instructions
- **⏰ Respectful Timing**: Only shows prompt once every 3 days if dismissed
- **🎯 One-Click Install**: Direct install button when browser supports it
- **💾 Remember Choice**: Remembers if you've dismissed the prompt

### Installing on Desktop

#### Chrome/Edge:
1. Open the app in your browser
2. Look for the install icon (⊕) in the address bar
3. Click "Install" when prompted

#### Or use the in-app install button:
- Look for the animated "📲 Install App" button in the navigation
- Shows when installation is available
- Changes to "✅ Installed" when the app is installed

### PWA Benefits

- **🔒 Enhanced Security**: Runs in an isolated app environment
- **📱 Native Experience**: Looks and feels like a native app
- **⚡ Offline Access**: Works completely offline once cached
- **🚀 Quick Launch**: Accessible from home screen/app drawer
- **🔔 App Shortcuts**: Long-press icon for quick actions:
  - Generate Shares
  - Reconstruct Mnemonic  
  - How It Works guide

## Usage

### Generating Shares

1. **Enter Mnemonic**: Input your BIP-39 mnemonic phrase (12, 15, 18, 21, or 24 words)
2. **Set Password**: Choose a strong password for encryption
3. **Configure Shares**: Set the total number of shares and threshold
4. **Generate**: Click "Generate Shares" to create encrypted shares
5. **Download QR Codes**: Each share generates a QR code for easy storage

### Reconstructing Mnemonic

1. **Switch to Reconstruction Mode**: Click the "Reconstruct Mnemonic" tab
2. **Add Shares**: Input encrypted shares and their corresponding passwords
3. **Reconstruct**: Click "Reconstruct Mnemonic" to recover your phrase
4. **Copy Result**: Use the copy button to save your recovered mnemonic

## Security Features

- **Shamir's Secret Sharing**: Uses cryptographic secret sharing for secure distribution
- **AES-256-GCM Encryption**: Military-grade encryption for each share
- **Password Protection**: Each share requires its password for decryption
- **Threshold Security**: Only the minimum required shares can reconstruct the secret
- **Browser-Native Crypto**: Uses Web Crypto API for secure random generation and encryption
- **Local Processing**: All operations happen in your browser, no data leaves your device

## Technical Details

- **Frontend**: React 19 with Vite
- **Encryption**: AES-256-GCM with PBKDF2 key derivation (100,000 iterations)
- **Secret Sharing**: Shamir's Secret Sharing algorithm
- **BIP-39 Support**: Full BIP-39 mnemonic validation and processing
- **QR Codes**: Generated using the qrcode library
- **Styling**: Modern CSS with responsive design
- **Browser Compatibility**: Uses Web Crypto API and modern browser features

### Browser Compatibility

This app uses the following browser-native technologies:
- **Web Crypto API**: For secure random generation, key derivation, and encryption
- **ES6 Modules**: For modern JavaScript module system
- **Async/Await**: For handling asynchronous cryptographic operations

**Note**: Requires a modern browser with Web Crypto API support (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)

## Deployment

### GitHub Pages (Recommended)

This project is configured for automatic deployment to GitHub Pages:

1. Push your code to a GitHub repository
2. Enable GitHub Pages in repository settings (Source: GitHub Actions)
3. The site will be automatically deployed on every push to the main branch
4. Access your site at: `https://yourusername.github.io/mnemonic-safe-app/`

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Development

- **Development Server**: `npm run dev`
- **Build**: `npm run build`
- **Preview Build**: `npm run preview`
- **Linting**: `npm run lint`

## Security Considerations

- **Password Strength**: Use strong, unique passwords for each share
- **Share Storage**: Store shares securely and separately
- **Network Security**: Use HTTPS in production
- **Local Processing**: All cryptographic operations happen locally in the browser
- **Browser Security**: Ensure your browser is up-to-date and secure
- **Device Security**: Use on a secure, trusted device

## Troubleshooting

### Common Issues

1. **"Invalid BIP-39 mnemonic"**: Ensure your mnemonic phrase is exactly 12, 15, 18, 21, or 24 words from the BIP-39 wordlist
2. **Browser compatibility**: Ensure you're using a modern browser with Web Crypto API support
3. **Encryption errors**: Check that passwords match the original ones used for encryption

### Testing

The app includes a test mode that can be accessed by opening `test.html` in your browser to verify the cryptographic functionality.

## License

This project is part of the Mnemonic Safe project.

## Support

For issues or questions, please refer to the main Mnemonic Safe repository.
