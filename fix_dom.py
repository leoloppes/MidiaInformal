import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pattern = re.compile(
    r'(<a href="materias/[^"]+"\s*class="flex )flex-col-reverse( md:flex-row gap-6 group cursor-pointer border-b border-slate-100 pb-8">\s*)'
    r'(<div class="md:w-5/12 overflow-hidden rounded-xl">[\s\S]*?</div>)\s*'
    r'(<div class="md:w-7/12 flex flex-col justify-center">[\s\S]*?</div>)\s*'
    r'(</a>)'
)

def replacer(match):
    prefix1 = match.group(1)
    prefix2 = match.group(2)
    img_div = match.group(3)
    txt_div = match.group(4)
    suffix = match.group(5)
    
    new_prefix2 = prefix2.replace(' md:flex-row ', ' md:flex-row-reverse ')
    
    return f"{prefix1}flex-col{new_prefix2}{txt_div}\n                            {img_div}\n                        {suffix}"

new_html, count = pattern.subn(replacer, html)

print(f"Replaced {count} items.")

if count > 0:
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
