const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const materiasDir = path.join(__dirname, '..', 'materias');
const outputFile = path.join(__dirname, '..', 'materias.html');
const indexFile = path.join(__dirname, '..', 'index.html');

async function getArticles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(await getArticles(filePath));
        } else if (file.endsWith('.html') && file !== 'template-materia.html') {
            const content = fs.readFileSync(filePath, 'utf8');
            const dom = new JSDOM(content);
            const document = dom.window.document;

            const title = document.querySelector('h1')?.textContent?.trim() || 'Sem título';
            const category = (document.querySelector('nav .text-g1-orange') || document.querySelector('nav span#article-category') || document.querySelector('.badge-category'))?.textContent?.trim() || 'Geral';
            const image = document.querySelector('article figure img')?.src || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';

            // Extract date from content
            const dateStr = document.querySelector('#article-date')?.textContent || 
                           document.querySelector('.flex.items-center.gap-4.text-sm.text-gray-500 span:last-child')?.textContent || '';

            // Helper to parse "DD/MM/YYYY HHhMM" or "DD/MM/YYYY"
            function parseDate(s) {
                const match = s.match(/(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2})[h:](\d{2}))?/);
                if (!match) return 0;
                const [_, d, m, y, hr, min] = match;
                return new Date(y, m - 1, d, hr || 0, min || 0).getTime();
            }

            const timestamp = parseDate(dateStr) || stat.mtimeMs;
            const relativePath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');

            // Extract summary (first paragraph in the article content)
            const summary = document.querySelector('#article-content p')?.textContent?.trim() ||
                document.querySelector('.text-lg.text-gray-800 p')?.textContent?.trim() ||
                document.querySelector('article > p')?.textContent?.trim() || '';

            results.push({
                title,
                category,
                image,
                link: relativePath,
                date: dateStr,
                summary: summary.length > 160 ? summary.substring(0, 157) + '...' : summary,
                timestamp: timestamp
            });
        }
    }
    return results;
}

async function updateIndex(articles) {
    if (!fs.existsSync(indexFile)) return;

    let indexContent = fs.readFileSync(indexFile, 'utf8');
    
    // Identificar links em destaque no index.html
    const indexDom = new JSDOM(indexContent);
    const indexDoc = indexDom.window.document;
    const featuredLinks = Array.from(indexDoc.querySelectorAll('#destaques a')).map(a => a.getAttribute('href'));
    console.log('Links em destaque detectados:', featuredLinks);

    // Filtrar artigos que não estão em destaque
    const feedArticles = articles.filter(art => !featuredLinks.includes(art.link)).slice(0, 4);

    const latestNewsHtml = feedArticles.map((art, index) => {
        const isLast = index === feedArticles.length - 1;
        const borderClass = isLast ? '' : 'border-b border-slate-100 pb-8';
        const categoryColor = art.category.toLowerCase().includes('rio') ? 'bg-brand-orange' : 'bg-brand-blue';

        return `                    <!-- Item ${index + 1} - ${art.title.substring(0, 20)}... -->
                    <a href="${art.link}"
                        class="flex flex-col md:group md:flex-row gap-6 group cursor-pointer ${borderClass}">
                        <div class="md:w-5/12 overflow-hidden rounded-xl">
                            <img src="${art.image}"
                                alt="${art.title}"
                                class="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        </div>
                        <div class="md:w-7/12 flex flex-col justify-center">
                            <span class="badge-category ${categoryColor} text-white mb-2">${art.category}</span>
                            <h3
                                class="text-xl font-extrabold text-[#0f172a] leading-tight mb-2 group-hover:text-brand-blue transition-colors uppercase">
                                ${art.title}
                            </h3>
                            <p class="text-slate-500 text-sm line-clamp-2 font-medium">${art.summary}</p>
                            <span class="text-slate-400 text-[10px] font-bold mt-4 uppercase tracking-widest">${art.date || 'Recente'}</span>
                        </div>
                    </a>`;
    }).join('\n\n');

    const startMarker = '<!-- LATEST-NEWS-START -->';
    const endMarker = '<!-- LATEST-NEWS-END -->';

    const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
    const newContent = indexContent.replace(regex, `${startMarker}\n${latestNewsHtml}\n                    ${endMarker}`);

    fs.writeFileSync(indexFile, newContent);
    console.log('index.html atualizado com as últimas notícias!');
}

async function generateArchive() {
    console.log('Gerando arquivo de matérias...');
    const articles = await getArticles(materiasDir);

    // Sort by timestamp (newest first)
    articles.sort((a, b) => b.timestamp - a.timestamp);

    // Update Homepage
    await updateIndex(articles);

    const articleCards = articles.map(art => `
            <!-- ${art.title} -->
            <a href="${art.link}" class="stitch-card group flex flex-col">
                <div class="aspect-video overflow-hidden">
                    <img src="${art.image}" alt="${art.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <span class="badge-category bg-brand-blue text-white mb-3 self-start">${art.category}</span>
                    <h2 class="text-xl font-extrabold text-slate-900 group-hover:text-brand-blue transition-colors uppercase leading-tight">${art.title}</h2>
                    <div class="mt-auto pt-6 flex items-center justify-between">
                        <span class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">${art.date || 'Recente'}</span>
                        <span class="text-brand-blue font-black text-[10px] uppercase tracking-tighter group-hover:translate-x-1 transition-transform">Ler mais →</span>
                    </div>
                </div>
            </a>`).join('\n');

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arquivo de Notícias - MÍDIA INFORMAL</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#f8fafc] text-[#0f172a] font-sans antialiased">
    <!-- Top Bar -->
    <div class="bg-slate-50 border-b border-slate-200 text-[10px] py-1.5 text-slate-500 font-medium">
        <div class="container mx-auto px-6 flex justify-between items-center uppercase tracking-wider">
            <span id="current-date">Sexta-feira, 27 de fevereiro de 2026</span>
            <div class="flex gap-6">
                <span>Rio de Janeiro 26°C</span>
                <span>Dólar R$ 5,12</span>
            </div>
        </div>
    </div>

    <!-- Header -->
    <header class="glass-header sticky top-0 z-50">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="index.html" class="flex items-center gap-2 group">
                <div class="bg-slate-900 text-white px-3 py-1.5 rounded-lg font-black text-xl">MÍDIA</div>
                <div class="text-[#0f172a] font-black text-xl tracking-tighter">INFORMAL</div>
            </a>
            <nav class="hidden md:flex items-center gap-8 text-[11px] font-black tracking-[0.1em] text-slate-600 uppercase">
                <a href="index.html" class="hover:text-brand-blue transition-colors">Home</a>
                <a href="materias.html" class="text-brand-blue border-b-2 border-brand-blue pb-1">Arquivo</a>
            </nav>
        </div>
    </header>

    <main class="container mx-auto px-6 py-12 max-w-7xl animate-fade-in">
        <div class="flex items-center gap-3 mb-12">
            <span class="w-10 h-1 bg-brand-blue rounded-full"></span>
            <h1 class="text-3xl font-black text-slate-900 uppercase">Arquivo de Notícias</h1>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
${articleCards}
        </div>
    </main>

    <footer class="bg-white border-t border-slate-200 pt-20 pb-12 mt-20">
        <div class="container mx-auto px-6 text-center">
            <div class="flex items-center justify-center gap-2 mb-8">
                <div class="bg-slate-900 text-white px-3 py-1.5 rounded-lg font-black text-xl">MÍDIA</div>
                <div class="text-slate-900 font-black text-xl tracking-tighter">INFORMAL</div>
            </div>
            <p class="text-slate-400 text-[10px] font-medium uppercase tracking-[0.25em]">© 2026 Mídia Informal • Transparência e Verdade</p>
        </div>
    </footer>
    <script src="script.js"></script>
</body>
</html>`;

    fs.writeFileSync(outputFile, html);
    console.log('Arquivo materias.html gerado com sucesso!');
}

generateArchive().catch(console.error);
