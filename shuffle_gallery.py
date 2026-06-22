import re
import random

html_path = 'c:/Users/HP/Desktop/kids-village-tanger/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Find the gallery grid
grid_match = re.search(r'(<div class=\"gallery-grid max-w-6xl mx-auto\">)(.*?)(</div>\s*<!-- Pagination Controls -->)', html, flags=re.DOTALL)
if not grid_match:
    print('Gallery grid not found')
    exit(1)

prefix = grid_match.group(1)
content = grid_match.group(2)
suffix = grid_match.group(3)

# Extract items
# Each item starts with <div class=\"gallery-item and ends with the matching </div>
items = []
# Using regex to split items
item_matches = re.finditer(r'(<!-- ============ [A-Z ]+ ============ -->\s*)?(<div class=\"gallery-item .*?</div>\s*</div>)', content, flags=re.DOTALL)
for m in item_matches:
    # We will ignore the comments to shuffle cleanly, so just take the div part
    items.append(m.group(2).strip())

# New images
new_images = [
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.16.18.jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.17.22 (1).jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.17.22 (2).jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.17.22.jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.17.23 (1).jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.17.23 (2).jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.17.23 (3).jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.17.23.jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.18.58.jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.23.50.jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.23.51 (1).jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.23.51 (2).jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.23.51 (3).jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.23.51 (4).jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.23.51 (5).jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.23.51.jpeg',
    'img/pictures of children/WhatsApp Image 2026-06-21 at 22.23.52.jpeg'
]

for img in new_images:
    # Use generic 'tout' class so it only shows in 'all' view
    item_html = f'''            <div class=\"gallery-item tout relative overflow-hidden group cursor-pointer\">
                <img src=\"{img}\" alt=\"Kids Village\" class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-110\" loading=\"lazy\">
                <div class=\"gallery-overlay absolute inset-0 flex flex-col justify-end p-5 text-white transition-all duration-300\">
                    <h3 class=\"font-fredoka text-lg font-bold leading-tight\">Kids Village ✨</h3>
                </div>
            </div>'''
    items.append(item_html)

# Shuffle all items
random.seed(42) # For reproducibility
random.shuffle(items)

# Rebuild the grid content
new_content = '\n\n'.join(items)
new_html = html[:grid_match.start()] + prefix + '\n' + new_content + '\n        ' + suffix + html[grid_match.end():]

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

print(f'Successfully shuffled and added {len(new_images)} new images. Total items: {len(items)}')
