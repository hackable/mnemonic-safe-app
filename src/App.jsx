import { useState } from 'react'
import React from 'react'
import QRCode from 'qrcode'
import jsPDF from 'jspdf'
import { bip39ToSlip39, reconstructBip39Mnemonic, decryptShares } from 'mnemonicsafe'
import HowItWorks from './HowItWorks'
import './App.css'

// Install Button Component
function InstallButton() {
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  
  React.useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      return window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone ||
             document.referrer.includes('android-app://');
    };
    
    setIsInstalled(checkInstalled());
    
    // Listen for beforeinstallprompt event
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setShowInstall(true);
      window.deferredInstallPrompt = e;
    };
    
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstall(false);
    };
    
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
  
  const handleInstall = async () => {
    if (window.deferredInstallPrompt) {
      window.deferredInstallPrompt.prompt();
      const { outcome } = await window.deferredInstallPrompt.userChoice;
      console.log(`Install prompt outcome: ${outcome}`);
      window.deferredInstallPrompt = null;
      setShowInstall(false);
    }
  };
  
  if (isInstalled) {
    return (
      <span className="nav-link installed" style={{ 
        color: '#48bb78', 
        cursor: 'default',
        opacity: 0.8 
      }}>
        ✅ Installed
      </span>
    );
  }
  
  if (showInstall) {
    return (
      <button 
        onClick={handleInstall}
        className="nav-button install-button"
        style={{
          background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
          animation: 'pulse 2s infinite'
        }}
      >
        📲 Install App
      </button>
    );
  }
  
  return null;
}

function App() {
  const [mnemonic, setMnemonic] = useState('')
  const [password, setPassword] = useState('')
  const [totalShares, setTotalShares] = useState(3)
  const [threshold, setThreshold] = useState(2)
  const [encryptedShares, setEncryptedShares] = useState([])
  const [qrCodes, setQrCodes] = useState([])
  const [reconstructionMode, setReconstructionMode] = useState(false)
  const [reconstructionShares, setReconstructionShares] = useState([])
  const [reconstructionPasswords, setReconstructionPasswords] = useState([])
  const [reconstructedMnemonic, setReconstructedMnemonic] = useState('')
  const [error, setError] = useState('')
  const [currentView, setCurrentView] = useState('main') // 'main' or 'how-it-works'
  
  // Handle PWA shortcuts and URL parameters
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'generate') {
      setReconstructionMode(false);
    } else if (action === 'reconstruct') {
      setReconstructionMode(true);
    } else if (action === 'help') {
      setCurrentView('how-it-works');
    }
  }, []);

  const generateShares = async () => {
    try {
      setError('')
      
      // Validate inputs
      if (!mnemonic.trim()) {
        setError('Please enter a mnemonic phrase')
        return
      }
      if (!password.trim()) {
        setError('Please enter a password')
        return
      }
      if (threshold > totalShares) {
        setError('Threshold cannot be greater than total shares')
        return
      }

      // Generate passwords array (using the same password for all shares)
      const passwords = Array(totalShares).fill(password)
      
      // Generate encrypted shares using mnemonicsafe package
      const shares = await bip39ToSlip39(mnemonic, totalShares, threshold, passwords)
      setEncryptedShares(shares)

      // Generate QR codes for each share
      const qrPromises = shares.map((share) => 
        QRCode.toDataURL(share, { 
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
      )
      
      const qrResults = await Promise.all(qrPromises)
      setQrCodes(qrResults)
      
    } catch (err) {
      setError(`Error generating shares: ${err.message}`)
    }
  }

  const reconstructMnemonic = async () => {
    try {
      setError('')
      
      console.log('Starting reconstruction...')
      console.log('Reconstruction shares:', reconstructionShares)
      console.log('Reconstruction passwords:', reconstructionPasswords)
      
      if (reconstructionShares.length === 0) {
        setError('Please enter at least one share')
        return
      }
      if (reconstructionPasswords.length !== reconstructionShares.length) {
        setError('Number of passwords must match number of shares')
        return
      }

      // Decrypt shares using mnemonicsafe package
      console.log('Decrypting shares...')
      const decryptedShares = await decryptShares(reconstructionShares, reconstructionPasswords)
      console.log('Decrypted shares:', decryptedShares)
      
      // Reconstruct mnemonic using mnemonicsafe package
      console.log('Reconstructing mnemonic...')
      const mnemonic = await reconstructBip39Mnemonic(decryptedShares)
      console.log('Reconstructed mnemonic:', mnemonic)
      
      setReconstructedMnemonic(mnemonic)
      
    } catch (err) {
      console.error('Reconstruction error:', err)
      setError(`Error reconstructing mnemonic: ${err.message}`)
    }
  }

  const addReconstructionShare = () => {
    setReconstructionShares([...reconstructionShares, ''])
    setReconstructionPasswords([...reconstructionPasswords, ''])
  }

  const removeReconstructionShare = (index) => {
    const newShares = reconstructionShares.filter((_, i) => i !== index)
    const newPasswords = reconstructionPasswords.filter((_, i) => i !== index)
    setReconstructionShares(newShares)
    setReconstructionPasswords(newPasswords)
  }

  const updateReconstructionShare = (index, value) => {
    const newShares = [...reconstructionShares]
    newShares[index] = value
    setReconstructionShares(newShares)
  }

  const updateReconstructionPassword = (index, value) => {
    const newPasswords = [...reconstructionPasswords]
    newPasswords[index] = value
    setReconstructionPasswords(newPasswords)
  }

  const downloadQRCode = (qrCode, index) => {
    const link = document.createElement('a')
    link.download = `share-${index + 1}.png`
    link.href = qrCode
    link.click()
  }

  const generatePDF = async () => {
    if (qrCodes.length === 0) return

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Add title
    pdf.setFontSize(20)
    pdf.text('Mnemonic Safe - Encrypted Shares', pageWidth / 2, 20, { align: 'center' })
    
    // Add subtitle
    pdf.setFontSize(12)
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' })
    pdf.text(`Total Shares: ${qrCodes.length} | Threshold: ${threshold}`, pageWidth / 2, 40, { align: 'center' })
    
    // Calculate QR code size and positioning
    const qrSize = 60 // mm - larger since we have more space
    
    let currentY = 60
    
    for (let i = 0; i < qrCodes.length; i++) {
      // Estimate space needed for this share (QR + text + spacing)
      const estimatedTextLines = Math.ceil(encryptedShares[i].length / 80) // Rough estimate
      const estimatedHeight = qrSize + 20 + (estimatedTextLines * 3) + 20
      
      // Check if we need a new page
      if (currentY + estimatedHeight > pageHeight - 20) {
        pdf.addPage()
        currentY = 20
      }
      
      // Center the QR code horizontally
      const x = (pageWidth - qrSize) / 2
      
      try {
        // Generate QR code specifically for PDF with higher resolution
        const qrDataURL = await QRCode.toDataURL(encryptedShares[i], {
          width: 256,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        
        console.log(`Generated QR for share ${i + 1}:`, qrDataURL.substring(0, 100) + '...')
        
        // Add image to PDF - jsPDF should handle data URLs directly
        pdf.addImage(qrDataURL, 'PNG', x, currentY, qrSize, qrSize)
        
        console.log(`Added QR code ${i + 1} to PDF at position (${x}, ${currentY})`)
        
        // Add share number
        pdf.setFontSize(16)
        pdf.text(`Share ${i + 1}`, pageWidth / 2, currentY + qrSize + 12, { align: 'center' })
        
        // Add complete encrypted share string (multi-line)
        pdf.setFontSize(8)
        const shareText = encryptedShares[i]
        const maxWidth = pageWidth - 20 // Leave 10mm margin on each side
        const lines = pdf.splitTextToSize(shareText, maxWidth)
        pdf.text(lines, pageWidth / 2, currentY + qrSize + 20, { align: 'center' })
        
        // Move to next position (allowing more space for multi-line text)
        const textHeight = lines.length * 3 // Approximate height per line in mm
        currentY += qrSize + 20 + textHeight + 20 // QR + spacing + text + spacing
      } catch (error) {
        console.error('Error adding QR code to PDF:', error)
        // Add placeholder text if QR code fails
        pdf.setFontSize(10)
        pdf.text(`QR Code ${i + 1} (Error)`, pageWidth / 2, currentY + qrSize / 2, { align: 'center' })
        currentY += qrSize + 50 // Use fixed spacing for error case
      }
    }
    
    // Save the PDF
    pdf.save('mnemonic-safe-shares.pdf')
  }

  // Conditional rendering based on current view
  if (currentView === 'how-it-works') {
    return <HowItWorks onBack={() => setCurrentView('main')} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔐 Mnemonic Safe</h1>
        <p>Secure backup solution for BIP-39 mnemonics using Shamir's Secret Sharing</p>
        <nav className="app-nav">
          <button 
            onClick={() => setCurrentView('how-it-works')}
            className="nav-button"
          >
            🔍 How It Works
          </button>
          <InstallButton />
          <a 
            href="https://github.com/hackable/mnemonic-safe-app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-link"
          >
            📦 GitHub
          </a>
          <a 
            href="https://www.npmjs.com/package/mnemonicsafe" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-link"
          >
            📚 NPM Package
          </a>
        </nav>
      </header>

              <div className="app-container">
          <div className="mode-toggle">
            <button 
              className={!reconstructionMode ? 'active' : ''} 
              onClick={() => setReconstructionMode(false)}
            >
              Generate Shares
            </button>
            <button 
              className={reconstructionMode ? 'active' : ''} 
              onClick={() => setReconstructionMode(true)}
            >
              Reconstruct Mnemonic
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

        {!reconstructionMode ? (
          <div className="generate-section">
            <h2>Generate Secure Shares</h2>
            
            <div className="input-group">
              <label htmlFor="mnemonic">BIP-39 Mnemonic Phrase:</label>
              <textarea
                id="mnemonic"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="Enter your 12, 15, 18, 21, or 24 word mnemonic phrase"
                rows={3}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
              />
            </div>

            <div className="shares-config">
              <div className="input-group">
                <label htmlFor="totalShares">Total Shares:</label>
                <input
                  id="totalShares"
                  type="number"
                  min="2"
                  max="10"
                  value={totalShares}
                  onChange={(e) => setTotalShares(parseInt(e.target.value))}
                />
              </div>

              <div className="input-group">
                <label htmlFor="threshold">Threshold (Minimum Required):</label>
                <input
                  id="threshold"
                  type="number"
                  min="2"
                  max={totalShares}
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                />
              </div>
            </div>

            <button className="generate-btn" onClick={generateShares}>
              Generate Shares
            </button>

            <button 
              className="example-btn" 
              onClick={() => {
                setMnemonic('legal winner thank year wave sausage worth useful legal winner thank yellow')
                setPassword('password123!')
                setTotalShares(5)
                setThreshold(3)
              }}
              style={{
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginLeft: '10px',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              Load Example Data
            </button>

            <div className="example-info" style={{
              marginTop: '20px',
              padding: '15px',
              background: '#e3f2fd',
              border: '1px solid #2196f3',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0', color: '#1976d2', fontSize: '0.9rem' }}>
                <strong>💡 Tip:</strong> Click "Load Example Data" to test with a sample 24-word BIP-39 mnemonic. 
                This will create 5 shares where any 3 can reconstruct the original phrase.
              </p>
            </div>

            {encryptedShares.length > 0 && (
              <div className="shares-section">
                <h3>Generated Shares</h3>
                <p>Each share is encrypted with your password. Download the QR codes for secure storage.</p>
                
                {/* PDF Generation Button */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <button 
                    onClick={generatePDF}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '15px 30px',
                      borderRadius: '10px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginBottom: '20px'
                    }}
                  >
                    📄 Download All QR Codes as PDF
                  </button>
                  <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    Generate a single PDF containing all QR codes and share information
                  </p>
                </div>

                {/* Encrypted Shares as Strings */}
                <div className="encrypted-shares-strings">
                  <h4>Encrypted Shares (Text Format)</h4>
                  <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                    Copy these encrypted strings for text-based storage or sharing:
                  </p>
                  {encryptedShares.map((share, index) => (
                    <div key={index} className="share-string-item" style={{
                      background: '#f8f9fa',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <strong>Share {index + 1}</strong>
                        <button 
                          onClick={() => navigator.clipboard.writeText(share)}
                          style={{
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          Copy
                        </button>
                      </div>
                      <code style={{
                        background: '#e9ecef',
                        padding: '10px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        wordBreak: 'break-all',
                        display: 'block',
                        fontFamily: 'monospace'
                      }}>
                        {share}
                      </code>
                    </div>
                  ))}
                </div>
                
                {/* QR Codes Grid */}
                <div className="qr-section">
                  <h4>QR Codes</h4>
                  <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                    Individual QR codes for each share (or use the PDF above for all):
                  </p>
                  <div className="qr-grid">
                    {qrCodes.map((qrCode, index) => (
                      <div key={index} className="qr-item">
                        <h5>Share {index + 1}</h5>
                        <img src={qrCode} alt={`Share ${index + 1} QR Code`} />
                        <button onClick={() => downloadQRCode(qrCode, index)}>
                          Download QR Code
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="reconstruct-section">
            <h2>Reconstruct Mnemonic</h2>
            
            <div className="reconstruction-controls">
              <button onClick={addReconstructionShare}>Add Share</button>
              <button 
                onClick={() => {
                  // Add 3 test shares (minimum threshold)
                  setReconstructionShares([
                    'test-share-1-encrypted-data-here',
                    'test-share-2-encrypted-data-here', 
                    'test-share-3-encrypted-data-here'
                  ])
                  setReconstructionPasswords([
                    'password123!',
                    'password123!',
                    'password123!'
                  ])
                }}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginLeft: '10px'
                }}
              >
                Load Test Data
              </button>
              <p>Add the encrypted shares and their passwords to reconstruct your mnemonic.</p>
            </div>

            {reconstructionShares.map((share, index) => (
              <div key={index} className="share-input-group">
                <h4>Share {index + 1}</h4>
                <div className="share-inputs">
                  <div className="input-group">
                    <label>Encrypted Share:</label>
                    <textarea
                      value={share}
                      onChange={(e) => updateReconstructionShare(index, e.target.value)}
                      placeholder="Paste the encrypted share"
                      rows={2}
                    />
                  </div>
                  <div className="input-group">
                    <label>Password:</label>
                    <input
                      type="password"
                      value={reconstructionPasswords[index]}
                      onChange={(e) => updateReconstructionPassword(index, e.target.value)}
                      placeholder="Enter the password for this share"
                    />
                  </div>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeReconstructionShare(index)}
                >
                  Remove Share
                </button>
              </div>
            ))}

            {reconstructionShares.length > 0 && (
              <button className="reconstruct-btn" onClick={reconstructMnemonic}>
                Reconstruct Mnemonic
              </button>
            )}

            {reconstructedMnemonic && (
              <div className="result-section">
                <h3>Reconstructed Mnemonic</h3>
                <div className="mnemonic-display">
                  <textarea
                    value={reconstructedMnemonic}
                    readOnly
                    rows={3}
                    style={{
                      color: '#28a745',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      border: '2px solid #28a745',
                      borderRadius: '10px',
                      background: '#f8fff9',
                      padding: '20px',
                      fontFamily: 'Courier New, monospace'
                    }}
                  />
                  <button 
                    onClick={() => navigator.clipboard.writeText(reconstructedMnemonic)}
                    className="copy-btn"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
