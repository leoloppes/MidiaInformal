const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Replace the Iran article block with the new Illegal Medicines article block
const oldBlock = `<a href="materias/2026/03/novo-lider-ira-ameaca-eua.html"
                            class="group bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-red hover:shadow-md transition-all">
                            <div class="aspect-video overflow-hidden rounded mb-4">
                                <img src="https://tribunadonorte.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-09-at-05.56.49.jpeg"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            </div>
                            <span class="text-brand-red font-black text-[10px] uppercase tracking-tighter">Mundo</span>
                            <h3
                                class="text-lg font-black text-gray-900 leading-tight mt-2 group-hover:text-brand-red transition-colors uppercase">
                                NOVO LÍDER DO IRÃ AMEAÇA ATACAR BASES DOS EUA E DEFENDE MANTER ESTREITO DE HORMUZ FECHADO
                            </h3>
                        </a>`;

const newBlock = `<a href="materias/2026/03/operacao-clandestina-medicamentos-emagrecedores.html"
                            class="group bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-red hover:shadow-md transition-all">
                            <div class="aspect-video overflow-hidden rounded mb-4">
                                <img src="https://s2-oglobo.glbimg.com/UCx0AsLBJ47VVPvNiil9wdD4oX4=/0x0:841x449/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/x/N/nvpH6dRgiB9LasVDW76g/medicamento.jpg"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            </div>
                            <span class="text-brand-red font-black text-[10px] uppercase tracking-tighter">Polícia</span>
                            <h3
                                class="text-lg font-black text-gray-900 leading-tight mt-2 group-hover:text-brand-red transition-colors uppercase">
                                OPERAÇÃO NA ZONA OESTE: 10 SÃO PRESOS EM DEPÓSITO ILEGAL DE MEDICAMENTOS EMAGRECEDORES
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
