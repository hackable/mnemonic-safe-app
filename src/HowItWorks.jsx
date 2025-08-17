import React from 'react'
import './HowItWorks.css'

function HowItWorks({ onBack }) {
  return (
    <div className="how-it-works">
      <header className="how-it-works-header">
        <h1>🔍 How Mnemonic Safe Works</h1>
        <p>Understanding the cryptographic security behind your mnemonic backup</p>
      </header>

      <div className="how-it-works-container">
        
        {/* Overview Section */}
        <section className="overview-section">
          <h2>🎯 Overview</h2>
          <p>
            Mnemonic Safe uses <strong>Shamir's Secret Sharing</strong> combined with <strong>AES-256-GCM encryption</strong> 
            to create secure, distributed backups of your BIP-39 mnemonic phrases. This approach provides redundancy 
            and security without single points of failure.
          </p>
        </section>

        {/* Process Flow */}
        <section className="process-section">
          <h2>🔄 How It Works</h2>
          
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>🔐 Encryption</h3>
                <p>
                  Your BIP-39 mnemonic is encrypted using <strong>AES-256-GCM</strong> with a password-derived key. 
                  The key is generated using <strong>PBKDF2</strong> with 100,000 iterations and a random salt.
                </p>
                <div className="technical-detail">
                  <code>AES-256-GCM(mnemonic, PBKDF2(password, salt, 100000))</code>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>🧩 Secret Sharing</h3>
                <p>
                  The encrypted mnemonic is split into <strong>N shares</strong> using Shamir's Secret Sharing, 
                  where any <strong>K shares</strong> can reconstruct the original (threshold scheme).
                </p>
                <div className="technical-detail">
                  <code>SLIP-39 shares = ShamirSplit(encrypted_mnemonic, N, K)</code>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>📱 QR Generation</h3>
                <p>
                  Each encrypted share is encoded into a <strong>QR code</strong> for easy storage, transmission, 
                  and scanning. The QR codes contain the complete encrypted share data.
                </p>
                <div className="technical-detail">
                  <code>QR_Code = Encode(encrypted_share)</code>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>🔓 Reconstruction</h3>
                <p>
                  To recover your mnemonic, collect the minimum threshold of shares, decrypt each with 
                  its password, then use Shamir's algorithm to reconstruct the original mnemonic.
                </p>
                <div className="technical-detail">
                  <code>mnemonic = Decrypt(ShamirReconstruct(decrypted_shares))</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="security-section">
          <h2>🛡️ Security Features</h2>
          
          <div className="security-features">
            <div className="security-feature">
              <h3>🔒 Multi-Layer Protection</h3>
              <ul>
                <li><strong>Password Encryption:</strong> Each share is individually encrypted</li>
                <li><strong>Secret Sharing:</strong> No single share can reveal the mnemonic</li>
                <li><strong>Threshold Security:</strong> Requires minimum number of shares</li>
              </ul>
            </div>

            <div className="security-feature">
              <h3>🌐 Browser-Native Crypto</h3>
              <ul>
                <li><strong>Web Crypto API:</strong> Uses browser's native cryptographic functions</li>
                <li><strong>Local Processing:</strong> All operations happen in your browser</li>
                <li><strong>No Network Calls:</strong> Your mnemonic never leaves your device</li>
              </ul>
            </div>

            <div className="security-feature">
              <h3>🎲 Cryptographic Standards</h3>
              <ul>
                <li><strong>AES-256-GCM:</strong> Authenticated encryption with associated data</li>
                <li><strong>PBKDF2:</strong> 100,000 iterations for key derivation</li>
                <li><strong>SLIP-39:</strong> Shamir's Secret Sharing for cryptocurrency</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="use-cases-section">
          <h2>💡 Use Cases</h2>
          
          <div className="use-cases">
            <div className="use-case">
              <h3>🏠 Family Backup</h3>
              <p>
                Create 5 shares with a threshold of 3. Give one share each to 5 trusted family members. 
                Any 3 can help recover your wallet if needed.
              </p>
            </div>

            <div className="use-case">
              <h3>🏢 Corporate Security</h3>
              <p>
                Split company wallet access among multiple executives. Require 3 out of 5 signatures 
                for critical operations while maintaining security.
              </p>
            </div>

            <div className="use-case">
              <h3>🌍 Geographic Distribution</h3>
              <p>
                Store shares in different physical locations (safe deposit boxes, trusted friends) 
                to protect against natural disasters or theft.
              </p>
            </div>

            <div className="use-case">
              <h3>⏰ Time-Based Recovery</h3>
              <p>
                Give shares to lawyers or estate planners with instructions for family access 
                in case of emergency or inheritance scenarios.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="technical-section">
          <h2>⚙️ Technical Implementation</h2>
          
          <div className="tech-stack">
            <div className="tech-item">
              <h3>🎨 Frontend</h3>
              <ul>
                <li>React 19 with modern hooks</li>
                <li>Vite for fast development and building</li>
                <li>Responsive CSS with modern design</li>
                <li>Progressive Web App capabilities</li>
              </ul>
            </div>

            <div className="tech-item">
              <h3>🔐 Cryptography</h3>
              <ul>
                <li>mnemonicsafe package for core functionality</li>
                <li>Web Crypto API for secure operations</li>
                <li>SLIP-39 for Shamir's Secret Sharing</li>
                <li>BIP-39 standard compatibility</li>
              </ul>
            </div>

            <div className="tech-item">
              <h3>📱 Features</h3>
              <ul>
                <li>QR code generation with qrcode library</li>
                <li>PDF generation with jsPDF</li>
                <li>Clipboard API integration</li>
                <li>Local storage for preferences</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Repository Links */}
        <section className="links-section">
          <h2>🔗 Source Code & Dependencies</h2>
          
          <div className="repo-links">
            <div className="repo-link">
              <h3>🏗️ Mnemonic Safe App</h3>
              <p>This React application's source code and documentation</p>
              <a 
                href="https://github.com/hackable/mnemonic-safe-app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="repo-button"
              >
                📦 View on GitHub
              </a>
            </div>

            <div className="repo-link">
              <h3>🔐 Mnemonic Safe Package</h3>
              <p>Core cryptographic library implementing Shamir's Secret Sharing for BIP-39</p>
              <a 
                href="https://github.com/hackable/mnemonicsafe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="repo-button"
              >
                📚 Core Library
              </a>
            </div>

            <div className="repo-link">
              <h3>📦 NPM Package</h3>
              <p>Install the mnemonicsafe package in your own projects</p>
              <a 
                href="https://www.npmjs.com/package/mnemonicsafe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="repo-button npm"
              >
                📦 NPM Package
              </a>
            </div>
          </div>

          <div className="installation-guide">
            <h3>🚀 Quick Start</h3>
            <p>Add Mnemonic Safe to your project:</p>
            <div className="code-block">
              <code>npm install mnemonicsafe</code>
            </div>
            <div className="code-block">
              <code>
{`import { bip39ToSlip39, reconstructBip39Mnemonic } from 'mnemonicsafe'

// Generate shares
const shares = await bip39ToSlip39(mnemonic, 5, 3, passwords)

// Reconstruct mnemonic
const recovered = await reconstructBip39Mnemonic(decryptedShares)`}
              </code>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="footer-section">
          <div className="footer-content">
            <p>
              <strong>⚠️ Security Notice:</strong> Always verify the source code before using any cryptocurrency-related 
              software. This application processes sensitive cryptographic material and should only be used on 
              trusted, secure devices.
            </p>
            <div className="footer-links">
              <button 
                onClick={onBack} 
                className="back-button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#90cdf4',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: 'inherit',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
                onMouseLeave={(e) => e.target.style.color = '#90cdf4'}
              >
                ← Back to App
              </button>
              <a href="https://github.com/hackable/mnemonic-safe-app/blob/main/README.md" target="_blank" rel="noopener noreferrer">
                📖 Documentation
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default HowItWorks
