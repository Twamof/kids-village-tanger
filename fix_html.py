import glob

def fix_html_files():
    html_files = glob.glob("*.html")
    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # 1. Fix the logo specifically
        content = content.replace("Logo Kids Village Tanger.webp.webp", "Logo Kids Village Tanger.jpg.webp")
        
        # 2. Fix the IMG_XXXX files that had .JPG
        content = content.replace(".webp.webp", ".JPG.webp")
        
        # 3. Fix any case where IMG_XXXX.webp.webp was missed (just in case)
        # We already handled it above.

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed broken paths in {file_path}")

if __name__ == "__main__":
    fix_html_files()
    print("\n✅ All broken image paths are fixed!")
