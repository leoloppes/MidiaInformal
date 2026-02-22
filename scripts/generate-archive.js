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
            const category = document.querySelector('nav .text-g1-orange')?.textContent?.trim() || 'Geral';
            const image = document.querySelector('article figure img')?.src || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';

            // Extract date from content or use file stats
            const dateStr = document.querySelector('.flex.items-center.gap-4.text-sm.text-gray-500 span:last-child')?.textContent || '';
            const relativePath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');

            // Extract summary (first paragraph in the article content)
            const summary = document.querySelector('.text-lg.text-gray-800 p')?.textContent?.trim() ||
                document.querySelector('article > p')?.textContent?.trim() || '';

            results.push({
                title,
                category,
                image,
                link: relativePath,
                date: dateStr,
                summary: summary.length > 160 ? summary.substring(0, 157) + '...' : summary,
                timestamp: stat.mtimeMs
            });
        }
    }
    return results;
}

async function updateIndex(articles) {
    if (!fs.existsSync(indexFile)) return;

    let indexContent = fs.readFileSync(indexFile, 'utf8');
    const indexDom = new JSDOM(indexContent);
    const indexDoc = indexDom.window.document;

    // Identify featured links (inside #destaques)
    const featuredLinks = Array.from(indexDoc.querySelectorAll('#destaques a')).map(a => a.getAttribute('href'));
    console.log('Links em destaque detectados:', featuredLinks);

    // Filter out articles that are already featured
    const feedArticles = articles.filter(art => !featuredLinks.includes(art.link)).slice(0, 3);

    const latestNewsHtml = feedArticles.map((art, index) => {
        const borderClass = index === feedArticles.length - 1 ? '' : 'border-b border-gray-200 pb-6';
        const categoryColor = art.category.toLowerCase().includes('rio') ? 'text-g1-orange' : 'text-g1-red';

        return `                    <!-- Item ${index + 1} -->
                    <a href="${art.link}"
                        class="flex flex-col md:group md:flex-row gap-4 group cursor-pointer ${borderClass}">
                        <div class="md:w-5/12 overflow-hidden rounded">
                            <img src="${art.image}"
                                alt="${art.title}"
                                class="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        </div>
                        <div class="md:w-7/12 flex flex-col justify-center">
                            <span class="${categoryColor} font-bold text-xs uppercase mb-1">${art.category}</span>
                            <h3
                                class="text-2xl font-bold text-gray-800 leading-tight mb-2 group-hover:${categoryColor} transition-colors">
                                ${art.title}
                            </h3>
                            <p class="text-gray-600 text-sm line-clamp-2">${art.summary}</p>
                            <span class="text-gray-400 text-xs mt-3">${art.date || 'Recente'}</span>
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
            <a href="${art.link}" class="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div class="aspect-video overflow-hidden">
                    <img src="${art.image}" alt="${art.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-4">
                    <span class="text-g1-red font-bold text-xs uppercase">${art.category}</span>
                    <h2 class="text-xl font-bold mt-2 group-hover:text-g1-red transition-colors">${art.title}</h2>
                    ${art.date ? `<p class="text-gray-400 text-xs mt-2">${art.date}</p>` : ''}
                </div>
            </a>`).join('\n');

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arquivo de Matérias - MÍDIA INFORMAL</title>
    <link href="dist/output.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-gray-100 text-gray-800 font-sans">
    <div class="bg-gray-100 border-b border-gray-200 text-xs py-1 text-gray-500">
        <div class="container mx-auto px-4 flex justify-between items-center">
            <span id="current-date">Carregando data...</span>
            <div class="flex gap-4">
                <span id="weather-info">Carregando clima...</span>
                <span id="dollar-info">Carregando dólar...</span>
            </div>
        </div>
    </div>
    <header class="bg-g1-red text-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <a href="index.html" class="text-3xl font-black tracking-tight flex items-center gap-1 leading-none">
                <span class="text-white">MÍDIA</span>
                <span class="text-g1-orange">INFORMAL</span>
            </a>
            <div class="hidden md:flex items-center gap-6 text-sm font-bold tracking-wide">
                <a href="index.html#destaques" class="hover:text-g1-orange transition-colors">DESTAQUES</a>
                <a href="materias.html" class="text-g1-orange">NOTÍCIAS</a>
                <a href="index.html#fotos" class="hover:text-g1-orange transition-colors">FOTOS</a>
            </div>
            <button id="mobile-menu-btn" class="md:hidden text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
        <div id="mobile-menu" class="hidden md:hidden bg-g1-red-dark absolute w-full left-0 border-t border-red-800 shadow-lg">
            <div class="flex flex-col p-4 space-y-4 text-center font-bold">
                <a href="index.html#destaques" class="text-white hover:text-g1-orange">DESTAQUES</a>
                <a href="materias.html" class="text-g1-orange">NOTÍCIAS</a>
                <a href="index.html#fotos" class="text-white hover:text-g1-orange">FOTOS</a>
            </div>
        </div>
    </header>
    <main class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-black text-gray-900 mb-8 border-b-4 border-g1-red inline-block">Arquivo de Notícias</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${articleCards}
        </div>
    </main>
    <footer class="bg-g1-red text-white mt-12">
        <div class="container mx-auto px-6 py-8">
            <div class="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div class="mb-6 md:mb-0">
                    <span class="text-2xl font-black tracking-tight">MÍDIA <span class="text-g1-orange">INFORMAL</span></span>
                    <p class="text-white/80 text-sm mt-1">Compromisso com a verdade.</p>
                </div>
                <div class="flex space-x-6 text-sm font-semibold">
                    <a href="index.html" class="hover:text-g1-orange transition-colors">Home</a>
                    <a href="#" class="hover:text-g1-orange transition-colors">Quem Somos</a>
                    <a href="#" class="hover:text-g1-orange transition-colors">Privacidade</a>
                </div>
            </div>
        </div>
    </footer>
    <script src="script.js"></script>
</body>
</html>`;

    fs.writeFileSync(outputFile, html);
    console.log('Arquivo materias.html gerado com sucesso!');
}

generateArchive().catch(console.error);
