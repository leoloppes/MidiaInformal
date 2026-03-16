const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const newGalleryHtml = `<div class="grid grid-cols-2 gap-3">
                        <div
                            class="relative aspect-square overflow-hidden rounded-lg bg-gray-200 cursor-zoom-in group shadow-sm">
                            <img src="https://s2-g1.glbimg.com/9fLUfOFCT-37wmhvLAeL7AzGx2U=/0x0:5040x3360/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2026/2/O/aAfRBdSo2zQCryC2KYow/2026-03-08t120301z-1220104982-rc2c0kamaxjc-rtrmadp-3-iran-crisis-1-.jpg"
                                alt="Estrada no Irã após ataque a refinaria" data-author="Majid Asgaripour/WANA (West Asia News Agency) via REUTERS"
                                class="gallery-img w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            <div
                                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-3">
                                <p class="text-[9px] text-white font-bold uppercase tracking-wider truncate">Foto:
                                    Majid Asgaripour/WANA</p>
                            </div>
                        </div>
                        <div
                            class="relative aspect-square overflow-hidden rounded-lg bg-gray-200 cursor-zoom-in group shadow-sm">
                            <img src="https://s2-g1.glbimg.com/mNnE8I8Rway2xClCOVRTUOpXx-0=/0x0:1400x788/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2026/1/Q/Pae70VSrOYsvUqpGKHFQ/league-of-legends.jpg"
                                alt="League of legends bloqueado para menores" data-author="Divulgação"
                                class="gallery-img w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            <div
                                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-3">
                                <p class="text-[9px] text-white font-bold uppercase tracking-wider truncate">Foto:
                                    Divulgação
                                </p>
                            </div>
                        </div>
                        <div
                            class="relative aspect-square overflow-hidden rounded-lg bg-gray-200 cursor-zoom-in group shadow-sm">
                            <img src="https://s2-g1.glbimg.com/PJJ0YOYpNFmahjZo2Jh4KqJ2cxg=/0x0:3706x2160/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2026/A/n/JTXyWsQ6CE9JcwIfeeaA/2026-03-08t041714z-501078789-up1em380blg12-rtrmadp-3-motor-f1-australia.jpg"
                                alt="Fórmula 1 cancelada" data-author="Hollie Adams/Reuters"
                                class="gallery-img w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            <div
                                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-3">
                                <p class="text-[9px] text-white font-bold uppercase tracking-wider truncate">Foto:
                                    Hollie Adams/Reuters</p>
                            </div>
                        </div>
                        <div
                            class="relative aspect-square overflow-hidden rounded-lg bg-gray-200 cursor-zoom-in group shadow-sm">
                            <img src="https://s2-g1.glbimg.com/rsfwKBKFT6hDRxFFxbw3EpjYUgY=/0x0:1280x960/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2025/G/e/Jn2qE3RrK1oXg1cKsxDg/design-sem-nome.jpg"
                                alt="Carteira Nacional de Habilitação (CNH)" data-author="Crystofher Andrade/g1"
                                class="gallery-img w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            <div
                                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-3">
                                <p class="text-[9px] text-white font-bold uppercase tracking-wider truncate">Foto:
                                    Crystofher Andrade/g1</p>
                            </div>
                        </div>
                    </div>`;

// Use regex to replace everything between <div class="grid grid-cols-2 gap-3"> and </section> -> wait, </section> closes it but there might be spaces.
// Let's replace the whole section.

const sectionRegex = /(<section id="fotos"[^>]*>[\s\S]*?(<h2[^>]*>.*?<\/h2>))([\s\S]*?)(<\/section>)/;
content = content.replace(sectionRegex, (match, beforeGallery, h2, oldGallery, endSection) => {
    return beforeGallery + '\n                    ' + newGalleryHtml + '\n                ' + endSection;
});

fs.writeFileSync('index.html', content, 'utf8');
console.log('Homepage gallery patched!');
