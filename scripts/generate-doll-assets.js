const fs = require('fs');
const path = require('path');

// Function to scan a directory recursively for image files
function scanDirectory(dir, baseDir) {
  const assets = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      assets.push(...scanDirectory(filePath, baseDir));
    } else if (/\.(png|jpg|jpeg|svg)$/i.test(file)) {
      // It's an image file, add it to the assets
      assets.push({
        path: '/' + path.relative(baseDir, filePath).replace(/\\/g, '/')
      });
    }
  });
  
  return assets;
}

// Paths
const staticDir = path.join(__dirname, '..', 'static');
const dollAssetsDir = path.join(staticDir, 'doll-assets');

// Scan for assets
const assets = scanDirectory(dollAssetsDir, staticDir);

// Write the asset index to a JSON file
fs.writeFileSync(
  path.join(staticDir, 'doll-assets-index.json'),
  JSON.stringify(assets)
);

console.log(`Generated asset index with ${assets.length} items`);