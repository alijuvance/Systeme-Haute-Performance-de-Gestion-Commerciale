const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const dirsToCreate = [
  'config',
  'constants',
  'schemas',
  'store',
  'utils',
  'components/shared'
];

const features = ['auth', 'dashboard', 'sales', 'products', 'customers', 'suppliers', 'purchases', 'stocks', 'pos', 'finance'];
const featureSubDirs = ['api', 'components', 'hooks', 'schemas', 'types'];

dirsToCreate.forEach(dir => {
  const p = path.join(srcDir, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

features.forEach(feature => {
  featureSubDirs.forEach(sub => {
    const p = path.join(srcDir, 'features', feature, sub);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  });
});

console.log('Frontend folder skeleton created.');
