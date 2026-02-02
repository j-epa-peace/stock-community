const fs = require('fs');
const path = require('path');

const logos = [
    { file: 'aapl.svg', color: '#000000', text: 'Apple' },
    { file: 'msft.svg', color: '#00BCF2', text: 'MSFT' },
    { file: 'googl.svg', color: '#4285F4', text: 'Google' },
    { file: 'amzn.svg', color: '#FF9900', text: 'Amazon' },
    { file: 'tsla.svg', color: '#CC0000', text: 'TESLA' },
    { file: 'meta.svg', color: '#1877F2', text: 'Meta' },
    { file: 'nvda.svg', color: '#76B900', text: 'NVIDIA' },
    { file: 'nflx.svg', color: '#E50914', text: 'NETFLIX' },
    { file: 'adbe.svg', color: '#FF0000', text: 'Adobe' },
    { file: 'crm.svg', color: '#00A1E0', text: 'Salesforce' },
    { file: 'samsung.svg', color: '#1428A0', text: 'SAMSUNG' },
    { file: 'baba.svg', color: '#FF6A00', text: 'Alibaba' },
    { file: 'v.svg', color: '#1A1F71', text: 'VISA' },
    { file: 'jpm.svg', color: '#0066B2', text: 'JPMorgan' },
    // JNJ is already created manually, but let's overwrite for consistency
    { file: 'jnj.svg', color: '#CC0000', text: 'J&J' }
];

const outputDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

logos.forEach(logo => {
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#ffffff" rx="40" ry="40"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="${logo.text.length > 5 ? 30 : 50}" fill="${logo.color}">${logo.text}</text>
</svg>
`;
    fs.writeFileSync(path.join(outputDir, logo.file), svgContent.trim());
    console.log(`Created ${logo.file}`);
});
