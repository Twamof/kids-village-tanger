def fix_index_paths():
    file_path = "index.html"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # The user mistakenly used "img/pictures of children/" for images that are actually in "img/Divers/"
    # specifically for the WhatsApp images starting with "22.1" and "22.2"
    content = content.replace("img/pictures of children/WhatsApp Image 2026-06-21 at 22.1", "img/Divers/WhatsApp Image 2026-06-21 at 22.1")
    content = content.replace("img/pictures of children/WhatsApp Image 2026-06-21 at 22.2", "img/Divers/WhatsApp Image 2026-06-21 at 22.2")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed incorrect paths in index.html!")

if __name__ == "__main__":
    fix_index_paths()
