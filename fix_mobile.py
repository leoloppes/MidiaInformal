import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace parent container
content = content.replace(
    'class="flex flex-col md:flex-row gap-6 group cursor-pointer border-b border-slate-100 pb-8"',
    'class="flex flex-col-reverse md:flex-row gap-6 group cursor-pointer border-b border-slate-100 pb-8"'
)

# Replace image child wrapper
content = content.replace(
    'class="order-2 md:order-1 md:w-5/12 overflow-hidden rounded-xl"',
    'class="md:w-5/12 overflow-hidden rounded-xl"'
)

# Replace text child wrapper
content = content.replace(
    'class="order-1 md:order-2 md:w-7/12 flex flex-col justify-center"',
    'class="md:w-7/12 flex flex-col justify-center"'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement done.")
