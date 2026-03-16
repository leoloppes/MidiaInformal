const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Replace the PMS article block with the new School Harassment article block
const oldBlock = `<a href="materias/2026/03/pms-operacao-contencao-red-legacy.html"
                            class="group bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-red hover:shadow-md transition-all">
                            <div class="aspect-video overflow-hidden rounded mb-4">
                                <img src="https://s2-g1.glbimg.com/0CdiZG0tzhc8Rk9D8f4NQYKHHPY=/0x0:642x497/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2026/y/2/7eE3DFRl26IV9jOMH8bw/11pms.jpg"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            </div>
                            <span
                                class="text-brand-red font-black text-[10px] uppercase tracking-tighter">Polícia</span>
                            <h3
                                class="text-lg font-black text-gray-900 leading-tight mt-2 group-hover:text-brand-red transition-colors uppercase">
                                PMS TERIAM COMBINADO APREENSÃO FALSA COM TRAFICANTES PARA CUMPRIR METAS, APONTA INVESTIGAÇÃO
                            </h3>
                        </a>`;

const newBlock = `<a href="materias/2026/03/denuncia-assedio-colegio-pensi.html"
                            class="group bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-red hover:shadow-md transition-all">
                            <div class="aspect-video overflow-hidden rounded mb-4">
                                <img src="https://odia.ig.com.br/_midias/jpg/2026/03/13/whatsapp_image_2026_03_13_at_12_48_46-38289002.jpeg"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            </div>
                            <span
                                class="text-brand-red font-black text-[10px] uppercase tracking-tighter">Rio</span>
                            <h3
                                class="text-lg font-black text-gray-900 leading-tight mt-2 group-hover:text-brand-red transition-colors uppercase">
                                DENÚNCIA: ADOLESCENTE DE 14 ANOS SOFRE ASSÉDIO EM COLÉGIO NA ZONA NORTE; PAIS ACUSAM ESCOLA DE OMISSÃO
                            </h3>
                        </a>`;

// Try both CRLF and LF
if (content.includes(oldBlock.replace(/\n/g, '\r\n'))) {
    content = content.replace(oldBlock.replace(/\n/g, '\r\n'), newBlock.replace(/\n/g, '\r\n'));
} else {
    content = content.replace(oldBlock, newBlock);
}

fs.writeFileSync('index.html', content, 'utf8');
console.log('Homepage patched!');
