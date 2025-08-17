import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, reload to update
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Handle PWA install prompt
let deferredPrompt;
let installPromptShown = false;

// Detect mobile device
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
}

// Check if already installed
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone ||
         document.referrer.includes('android-app://');
}

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA install prompt triggered');
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show install promotion
  if (!installPromptShown) {
    showInstallPromotion();
    installPromptShown = true;
  }
});

window.addEventListener('appinstalled', (evt) => {
  console.log('PWA was installed successfully');
  hideInstallPromotion();
  
  // Show success message
  showInstallSuccessMessage();
});

// Auto-show install prompt for mobile users
window.addEventListener('load', () => {
  // Small delay to let page load
  setTimeout(() => {
    if (isMobile() && !isStandalone() && !installPromptShown) {
      // Check if user has dismissed the prompt recently
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const dayInMs = 24 * 60 * 60 * 1000;
      
      // Show prompt if not dismissed in last 3 days
      if (!dismissed || (Date.now() - dismissedTime) > (3 * dayInMs)) {
        showMobileInstallPromotion();
        installPromptShown = true;
      }
    }
  }, 2000); // 2 second delay
});

function showInstallPromotion() {
  // Create install banner
  const installBanner = document.createElement('div');
  installBanner.id = 'install-banner';
  installBanner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      text-align: center;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    ">
      <div style="max-width: 600px; margin: 0 auto;">
        📱 <strong>Install Mnemonic Safe</strong> for offline access and better security!
        <button id="install-button" style="
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          margin-left: 15px;
          cursor: pointer;
          font-weight: 600;
        ">Install App</button>
        <button id="dismiss-install" style="
          background: none;
          border: none;
          color: white;
          margin-left: 10px;
          cursor: pointer;
          opacity: 0.8;
        ">✕</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(installBanner);
  
  // Add event listeners
  document.getElementById('install-button').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      hideInstallPromotion();
    }
  });
  
  document.getElementById('dismiss-install').addEventListener('click', () => {
    hideInstallPromotion();
  });
}

function hideInstallPromotion() {
  const banner = document.getElementById('install-banner');
  if (banner) {
    banner.remove();
  }
}

function showMobileInstallPromotion() {
  // Detect specific mobile platform for tailored instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  let instructions = '';
  let icon = '📱';
  
  if (isIOS) {
    icon = '🍎';
    instructions = `
      <div style="margin: 15px 0; text-align: left;">
        <strong>📱 Install on iOS:</strong><br/>
        1. Tap the <strong>Share</strong> button (□↗) below<br/>
        2. Scroll down and tap <strong>"Add to Home Screen"</strong><br/>
        3. Tap <strong>"Add"</strong> to install the app
      </div>
    `;
  } else if (isAndroid) {
    icon = '🤖';
    instructions = `
      <div style="margin: 15px 0; text-align: left;">
        <strong>📱 Install on Android:</strong><br/>
        1. Tap the <strong>menu</strong> (⋮) in your browser<br/>
        2. Tap <strong>"Add to Home screen"</strong><br/>
        3. Tap <strong>"Install"</strong> to confirm
      </div>
    `;
  } else {
    instructions = `
      <div style="margin: 15px 0; text-align: left;">
        <strong>📱 Install this app:</strong><br/>
        Look for the install option in your browser menu<br/>
        or add this page to your home screen
      </div>
    `;
  }

  // Create mobile install modal
  const installModal = document.createElement('div');
  installModal.id = 'mobile-install-modal';
  installModal.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(5px);
    ">
      <div style="
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 350px;
        width: 100%;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        text-align: center;
        position: relative;
      ">
        <div style="font-size: 3rem; margin-bottom: 15px;">${icon}</div>
        <h2 style="margin: 0 0 10px 0; color: #333; font-size: 1.5rem;">
          Install Mnemonic Safe
        </h2>
        <p style="color: #666; margin: 0 0 20px 0; line-height: 1.4;">
          Get the full app experience with offline access and enhanced security!
        </p>
        
        ${instructions}
        
        <div style="display: flex; gap: 10px; margin-top: 25px;">
          ${deferredPrompt ? `
            <button id="mobile-install-button" style="
              flex: 1;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 15px 20px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 1rem;
              cursor: pointer;
              transition: transform 0.2s ease;
            ">
              Install Now
            </button>
          ` : ''}
          <button id="mobile-dismiss-install" style="
            ${deferredPrompt ? 'flex: 0.5;' : 'flex: 1;'}
            background: #f8f9fa;
            color: #6c757d;
            border: 2px solid #e9ecef;
            padding: 15px 20px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            ${deferredPrompt ? 'Later' : 'Got it'}
          </button>
        </div>
        
        <p style="
          margin: 20px 0 0 0;
          font-size: 0.8rem;
          color: #999;
          line-height: 1.3;
        ">
          Your data stays private - everything runs locally on your device
        </p>
      </div>
    </div>
  `;
  
  document.body.appendChild(installModal);
  
  // Add event listeners
  if (deferredPrompt) {
    document.getElementById('mobile-install-button').addEventListener('click', async () => {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      hideMobileInstallPromotion();
    });
  }
  
  document.getElementById('mobile-dismiss-install').addEventListener('click', () => {
    // Remember that user dismissed it
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    hideMobileInstallPromotion();
  });
  
  // Close on backdrop click
  installModal.addEventListener('click', (e) => {
    if (e.target === installModal) {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      hideMobileInstallPromotion();
    }
  });
}

function hideMobileInstallPromotion() {
  const modal = document.getElementById('mobile-install-modal');
  if (modal) {
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9)';
    setTimeout(() => modal.remove(), 200);
  }
}

function showInstallSuccessMessage() {
  const successMessage = document.createElement('div');
  successMessage.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(72, 187, 120, 0.3);
      z-index: 10001;
      animation: slideDown 0.3s ease;
    ">
      ✅ App installed successfully! You can now use Mnemonic Safe offline.
    </div>
    <style>
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
    </style>
  `;
  
  document.body.appendChild(successMessage);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (successMessage.parentNode) {
      successMessage.style.opacity = '0';
      successMessage.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(() => successMessage.remove(), 300);
    }
  }, 4000);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
