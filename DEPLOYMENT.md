# GitHub Pages Deployment Guide

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

## Automatic Deployment (Recommended)

### Prerequisites
1. Push your code to a GitHub repository
2. Go to your repository settings on GitHub
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"

### Setup Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your GitHub repository
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "GitHub Actions"
   - The deployment will start automatically on the next push

3. **Access Your Site:**
   - Your site will be available at: `https://yourusername.github.io/mnemonic-safe-app/`
   - GitHub will show you the exact URL in the Pages settings

### How It Works

- The `.github/workflows/deploy.yml` file contains the deployment configuration
- On every push to the `main` branch, GitHub Actions will:
  1. Install dependencies
  2. Run linting
  3. Build the project
  4. Deploy to GitHub Pages

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build and deploy manually
npm run deploy
```

This will build the project and push it to the `gh-pages` branch.

## Local Testing

To test the production build locally:

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## Configuration Details

### Vite Configuration
- Base path set to `/mnemonic-safe-app/` for GitHub Pages
- Optimized chunking for better performance
- Assets organized in proper directories

### GitHub Actions Workflow
- Runs on Node.js 18
- Includes linting check
- Automatic deployment on successful build
- Uses official GitHub Pages actions

## Troubleshooting

### Common Issues

1. **404 Error on GitHub Pages:**
   - Make sure the base path in `vite.config.js` matches your repository name
   - Verify GitHub Pages is enabled in repository settings

2. **Build Failures:**
   - Check the Actions tab in your GitHub repository
   - Review the build logs for specific errors

3. **Assets Not Loading:**
   - Verify the base path configuration
   - Check browser developer tools for 404 errors

### Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

## Security Considerations

- The application runs entirely in the browser
- No server-side components or data storage
- All cryptographic operations happen locally
- Source code is publicly visible (as expected for GitHub Pages)

## Performance Notes

- The crypto libraries result in larger bundle sizes
- Consider implementing lazy loading for better initial load times
- Use browser caching for returning visitors
