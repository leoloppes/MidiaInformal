import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1) Swap the Super Manchete link/image/title
content = content.replace(
    'materias/2026/03/operacao-anomalia-ii-prisao-delegado.html\"\r\n                            class=\"group relative block overflow-hidden rounded-xl shadow-lg bg-white',
    'materias/2026/03/soltura-vereador-salvino-oliveira.html\"\r\n                            class=\"group relative block overflow-hidden rounded-xl shadow-lg bg-white'
)
content = content.replace(
    'https://s2-oglobo.glbimg.com/9NipRyqBVyeHNjOVuEG3ji4aStw=/0x0:854x480/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/d/E/ubR8dvRsWjZGeALHEBJA/pf-gif.gif\"\r\n                                    alt=\"POL\u00cdCIA FEDERAL PRENDE DELEGADO E AGENTES POR EXTORS\u00c3O CONTRA O COMANDO VERMELHO NO RIO\"\r\n                                    class=\"w-full h-full object-cover group-hover:scale-105 transition-transform duration-700',
    'https://s2-g1.glbimg.com/4XB3W62v_fIp0v0NK8yevg4Xpq8=/0x0:1080x607/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2026/u/Q/SS0TGCQbaig5AwGEBpUw/salviano.jpg\"\r\n                                    alt="JUSTI\u00c7A DO RIO DETERMINA SOLTURA DE VEREADOR SALVINO OLIVEIRA"\r\n                                    class=\"w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
)
content = content.replace(
    'POL\u00cdCIA FEDERAL PRENDE DELEGADO E AGENTES POR EXTORS\u00c3O CONTRA O COMANDO VERMELHO\r\n                                        NO RIO',
    'JUSTI\u00c7A DO RIO DETERMINA SOLTURA DE VEREADOR SALVINO OLIVEIRA, PRESO EM OPERA\u00c7\u00c3O CONTRA O COMANDO VERMELHO'
)
content = content.replace(
    'A Opera\u00e7\u00e3o Anomalia II desarticulou um n\u00facleo criminoso na Pol\u00edcia Civil que\r\n                                        extorquia lideran\u00e7as da fac\u00e7\u00e3o Comando Vermelho.',
    'Desembargador classificou como "bastante prec\u00e1rio" o ind\u00edcio de envolvimento do parlamentar com a organiza\u00e7\u00e3o criminosa e concedeu habeas corpus.'
)

# 2) Swap secondary grid: SALVINO ARRESTED -> ANOMALIA II
content = content.replace(
    'materias/2026/03/prisao-vereador-salvino-oliveira.html\"\r\n                            class=\"group bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-red hover:shadow-md transition-all',
    'materias/2026/03/operacao-anomalia-ii-prisao-delegado.html\"\r\n                            class=\"group bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-red hover:shadow-md transition-all'
)
content = content.replace(
    'https://s2-oglobo.glbimg.com/p-SXJa-88vvToWQnibDiiCWM5hs=/0x0:1021x518/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/s/J/3rSAnnSgOG50ATUWaY5Q/vereador1.png',
    'https://s2-oglobo.glbimg.com/9NipRyqBVyeHNjOVuEG3ji4aStw=/0x0:854x480/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/d/E/ubR8dvRsWjZGeALHEBJA/pf-gif.gif'
)
content = content.replace(
    'VEREADOR DO RIO, SALVINO OLIVEIRA \u00c9 PRESO EM OPERA\u00c7\u00c3O QUE INVESTIGA NEGOCIA\u00c7\u00c3O COM TRAFICANTE DO COMANDO VERMELHO',
    'POL\u00cdCIA FEDERAL PRENDE DELEGADO E AGENTES POR EXTORS\u00c3O CONTRA O COMANDO VERMELHO NO RIO'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done!')
