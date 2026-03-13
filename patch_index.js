const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1) Swap the super manchete href
content = content.replace(
  'materias/2026/03/operacao-anomalia-ii-prisao-delegado.html"\n                            class="group relative block overflow-hidden rounded-xl shadow-lg bg-white"',
  'materias/2026/03/soltura-vereador-salvino-oliveira.html"\n                            class="group relative block overflow-hidden rounded-xl shadow-lg bg-white"'
);
// handle CRLF version too
content = content.replace(
  'materias/2026/03/operacao-anomalia-ii-prisao-delegado.html"\r\n                            class="group relative block overflow-hidden rounded-xl shadow-lg bg-white"',
  'materias/2026/03/soltura-vereador-salvino-oliveira.html"\r\n                            class="group relative block overflow-hidden rounded-xl shadow-lg bg-white"'
);

// 2)  Swap the super manchete image url
const oldImg = 'https://s2-oglobo.glbimg.com/9NipRyqBVyeHNjOVuEG3ji4aStw=/0x0:854x480/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/d/E/ubR8dvRsWjZGeALHEBJA/pf-gif.gif';
const newImg = 'https://s2-g1.glbimg.com/4XB3W62v_fIp0v0NK8yevg4Xpq8=/0x0:1080x607/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2026/u/Q/SS0TGCQbaig5AwGEBpUw/salviano.jpg';
// Only replace the first occurrence (the super manchete one)
content = content.replace(oldImg, newImg);

// 3) Swap the super manchete alt text
content = content.replace(
  'alt="POLÍCIA FEDERAL PRENDE DELEGADO E AGENTES POR EXTORSÃO CONTRA O COMANDO VERMELHO NO RIO"',
  'alt="JUSTIÇA DO RIO DETERMINA SOLTURA DE VEREADOR SALVINO OLIVEIRA"'
);

// 4) Swap the super manchete h1 title (handle both LF and CRLF)
content = content.replace(
  'POLÍCIA FEDERAL PRENDE DELEGADO E AGENTES POR EXTORSÃO CONTRA O COMANDO VERMELHO\r\n                                        NO RIO',
  'JUSTIÇA DO RIO DETERMINA SOLTURA DE VEREADOR SALVINO OLIVEIRA, PRESO EM OPERAÇÃO CONTRA O COMANDO VERMELHO'
);
content = content.replace(
  'POLÍCIA FEDERAL PRENDE DELEGADO E AGENTES POR EXTORSÃO CONTRA O COMANDO VERMELHO\n                                        NO RIO',
  'JUSTIÇA DO RIO DETERMINA SOLTURA DE VEREADOR SALVINO OLIVEIRA, PRESO EM OPERAÇÃO CONTRA O COMANDO VERMELHO'
);

// 5) Swap the super manchete subtitle
content = content.replace(
  'A Operação Anomalia II desarticulou um núcleo criminoso na Polícia Civil que\r\n                                        extorquia lideranças da facção Comando Vermelho.',
  'Desembargador classificou como &quot;bastante precário&quot; o indício de envolvimento do parlamentar com a organização criminosa e concedeu habeas corpus.'
);
content = content.replace(
  'A Operação Anomalia II desarticulou um núcleo criminoso na Polícia Civil que\n                                        extorquia lideranças da facção Comando Vermelho.',
  'Desembargador classificou como &quot;bastante precário&quot; o indício de envolvimento do parlamentar com a organização criminosa e concedeu habeas corpus.'
);

// 6) Swap secondary grid slot: SALVINO ARRESTED -> ANOMALIA II
content = content.replace(
  'href="materias/2026/03/prisao-vereador-salvino-oliveira.html"\r\n                            class="group bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-red hover:shadow-md transition-all"',
  'href="materias/2026/03/operacao-anomalia-ii-prisao-delegado.html"\r\n                            class="group bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-red hover:shadow-md transition-all"'
);
content = content.replace(
  'href="materias/2026/03/prisao-vereador-salvino-oliveira.html"\n                            class="group bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-red hover:shadow-md transition-all"',
  'href="materias/2026/03/operacao-anomalia-ii-prisao-delegado.html"\n                            class="group bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-red hover:shadow-md transition-all"'
);

// 7) Swap the secondary grid image for that slot (second occurrence of anomalia or salvino)
content = content.replace(
  'https://s2-oglobo.glbimg.com/p-SXJa-88vvToWQnibDiiCWM5hs=/0x0:1021x518/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/s/J/3rSAnnSgOG50ATUWaY5Q/vereador1.png',
  'https://s2-oglobo.glbimg.com/9NipRyqBVyeHNjOVuEG3ji4aStw=/0x0:854x480/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/d/E/ubR8dvRsWjZGeALHEBJA/pf-gif.gif'
);

// 8) Swap the secondary grid title for that slot
content = content.replace(
  'VEREADOR DO RIO, SALVINO OLIVEIRA É PRESO EM OPERAÇÃO QUE INVESTIGA NEGOCIAÇÃO COM TRAFICANTE DO COMANDO VERMELHO',
  'POLÍCIA FEDERAL PRENDE DELEGADO E AGENTES POR EXTORSÃO CONTRA O COMANDO VERMELHO NO RIO'
);

// 9) Swap the category badge for that grid slot
content = content.replace(
  /(<span\s[^>]*?tracking-tighter">\s*)Política(\s*<\/span>\s*\r?\n\s*<h3[^>]*>\s*POLÍCIA FEDERAL PRENDE DELEGADO)/,
  '$1Polícia$2'
);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Patched!');
console.log('soltura occurrences:', (content.match(/soltura-vereador/g) || []).length);
