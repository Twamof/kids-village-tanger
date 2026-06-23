import os
from PIL import Image

def compress_images():
    img_dir = os.path.join(os.path.dirname(__file__), 'img')
    if not os.path.exists(img_dir):
        print(f"Directory {img_dir} not found")
        return

    print("Starting image compression using Python...")
    max_dim = 1200
    quality = 75
    min_size_kb = 50

    for root, dirs, files in os.walk(img_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.jpg', '.jpeg', '.png']:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, img_dir)
                
                try:
                    size_before = os.path.getsize(file_path)
                except OSError:
                    continue

                if size_before < min_size_kb * 1024:
                    print(f"Skipping {rel_path} (already small: {size_before/1024:.2f} KB)")
                    continue

                print(f"Processing {rel_path} ({size_before/1024/1024:.2f} MB)... ", end="", flush=True)

                try:
                    with Image.open(file_path) as img:
                        # Handle orientation from EXIF if present
                        try:
                            # 274 is the orientation key
                            if hasattr(img, '_getexif') and img._getexif() is not None:
                                exif = dict(img._getexif().items())
                                orientation = exif.get(274)
                                if orientation == 3:
                                    img = img.rotate(180, expand=True)
                                elif orientation == 6:
                                    img = img.rotate(270, expand=True)
                                elif orientation == 8:
                                    img = img.rotate(90, expand=True)
                        except Exception:
                            pass

                        width, height = img.size
                        new_width, new_height = width, height

                        if width > max_dim or height > max_dim:
                            if width > height:
                                new_width = max_dim
                                new_height = int(height * (max_dim / width))
                            else:
                                new_height = max_dim
                                new_width = int(width * (max_dim / height))
                            
                            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

                        # Save back
                        if ext == '.png':
                            img.save(file_path, 'PNG', optimize=True)
                        else:
                            # Convert RGBA to RGB for JPEG if needed
                            if img.mode in ('RGBA', 'LA'):
                                background = Image.new('RGB', img.size, (255, 255, 255))
                                background.paste(img, mask=img.split()[3])
                                img = background
                            elif img.mode == 'P':
                                img = img.convert('RGB')
                            img.save(file_path, 'JPEG', quality=quality)

                        # Save WebP version next to it for modern browsers
                        webp_path = os.path.splitext(file_path)[0] + '.webp'
                        try:
                            img.save(webp_path, 'WEBP', quality=quality)
                        except Exception as e:
                            pass

                    size_after = os.path.getsize(file_path)
                    reduction = (1 - size_after / size_before) * 100
                    print(f"Done! New size: {size_after/1024:.2f} KB (Reduced by {reduction:.2f}%)")
                except Exception as e:
                    print(f"Failed: {e}")

if __name__ == '__main__':
    compress_images()
