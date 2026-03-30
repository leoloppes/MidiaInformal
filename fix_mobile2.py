import re

with open(r'c:\Users\leo_l\TESTE\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

def reorder_item(match):
    full_a = match.group(0)
    
    # Extract components
    badge_match = re.search(r'<span class="badge-category[^>]+>.*?</span>', full_a, re.DOTALL)
    if not badge_match: return full_a
    badge = badge_match.group(0)
    
    img_div_match = re.search(r'<div class="md:w-5/12 overflow-hidden rounded-xl">.*?<img([^>]+)>.*?</div>', full_a, re.DOTALL)
    if not img_div_match: return full_a
    img_div = img_div_match.group(0)
    img_attrs = img_div_match.group(1)
    
    mobile_img_attrs = img_attrs.replace('md:h-full', '')
    mobile_img_div = f'<div class="w-full overflow-hidden rounded-xl mb-4 block md:hidden">\n                                <img{mobile_img_attrs}>\n                            </div>'
    
    new_img_div = img_div.replace('class="md:w-5/12 overflow-hidden rounded-xl"', 'class="md:w-5/12 overflow-hidden rounded-xl hidden md:block"')
    
    modified_a = full_a.replace(img_div, new_img_div)
    modified_a = modified_a.replace(badge, badge + '\n                                ' + mobile_img_div)
    
    return modified_a

pattern = re.compile(r'<a href="materias/[^"]+".*?class="flex flex-col md:flex-row-reverse gap-6 group cursor-pointer border-b border-slate-100 pb-8">.*?</a>', re.DOTALL)

new_text = pattern.sub(reorder_item, text)

if new_text != text:
    with open(r'c:\Users\leo_l\TESTE\index.html', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print(f"Successfully updated {len(pattern.findall(text))} items!")
else:
    print("No changes were made. Pattern might have failed.")
