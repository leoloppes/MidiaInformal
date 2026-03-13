const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const updates = [
  { file: 'prisao-vereador-salvino-oliveira.html', cat: 'Política' },
  { file: 'pms-operacao-contencao-red-legacy.html', cat: 'Polícia' },
  { file: 'delegado-investigacao-concluida.html', cat: 'Rio' },
  { file: 'tarifa-metro-rio-8-20.html', cat: 'Economia' },
  { file: 'secretaria-seguranca-paes.html', cat: 'Rio' },
  { file: 'mandelson-epstein.html', cat: 'Mundo' },
  { file: 'castro-tse.html', cat: 'Política' },
  { file: 'monobloco-desfile.html', cat: 'Rio' },
  { file: 'paes-jane-reis.html', cat: 'Rio' },
  { file: 'witzel-filiacao.html', cat: 'Rio' },
  { file: 'pf-vazamento.html', cat: 'Polícia' },
  { file: 'epstein-policia.html', cat: 'Mundo' },
  { file: 'carnaval-rj.html', cat: 'Rio' }
];

function processDir(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            processDir(filePath);
        } else if (file.endsWith('.html')) {
            const update = updates.find(u => u.file === file);
            if (update) {
                let content = fs.readFileSync(filePath, 'utf8');
                const dom = new JSDOM(content);
                const document = dom.window.document;
                
                let updated = false;
                
                // Try different selectors for category
                const spanInNav = document.querySelector('nav span:last-child') || document.querySelector('nav .text-brand-blue');
                if (spanInNav) {
                    spanInNav.textContent = update.cat;
                    updated = true;
                }
                
                const badge = document.querySelector('.badge-category') || document.querySelector('#article-category');
                if (badge) {
                     badge.textContent = update.cat;
                     updated = true;
                }
                
                if (updated) {
                    fs.writeFileSync(filePath, dom.serialize());
                    console.log(`Updated ${file} to ${update.cat}`);
                } else {
                    console.log(`Could not find where to update category in ${file}`);
                }
            }
        }
    }
}
processDir(path.join(__dirname, 'materias'));
