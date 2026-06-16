const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'chatbot_knowledge.txt');

let combinedText = '';
const checkMtime = (currentDir) => {
    if (!fs.existsSync(currentDir)) return;
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            checkMtime(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.jsx'))) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const cleanContent = content.replace(/import.*?;/g, '')
                                      .replace(/export default function/g, 'SECTION:')
                                      .replace(/className="[^"]*"/g, '')
                                      .replace(/<[^>]+>/g, ' ')
                                      .replace(/\s+/g, ' ');
            if (cleanContent.length > 50) {
                combinedText += '\n[Source: ' + file + ']\n' + cleanContent + '\n';
            }
        }
    }
};

checkMtime(path.join(__dirname, '../frontend/app'));
fs.writeFileSync(targetPath, combinedText);
console.log('Saved to ' + targetPath + ' (' + combinedText.length + ' chars)');
