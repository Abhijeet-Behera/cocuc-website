import os
from PIL import Image

public_dir = os.path.join(os.path.dirname(__file__), 'public')
max_size_hero = (1920, 1080)
max_size_logo = (400, 400)

images_to_compress = {
    'cocuc-heroimage-afternoon.jpeg': max_size_hero,
    'cocuc-heroimage-morning.jpeg': max_size_hero,
    'cocuc-heroimage-night.jpeg': max_size_hero,
    'church-logo.png': max_size_logo,
    'COCUC_LOGO.png': max_size_logo
}

for img_name, max_size in images_to_compress.items():
    img_path = os.path.join(public_dir, img_name)
    if os.path.exists(img_path):
        size_before = os.path.getsize(img_path)
        try:
            with Image.open(img_path) as img:
                # Resize if larger than max_size while maintaining aspect ratio
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Convert PNG to optimized or RGB if it's a JPEG
                if img_name.endswith('.png'):
                    img.save(img_path, format="PNG", optimize=True)
                else:
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    img.save(img_path, format="JPEG", quality=75, optimize=True)
                    
            size_after = os.path.getsize(img_path)
            print(f"Compressed {img_name}: {size_before/1024/1024:.2f}MB -> {size_after/1024/1024:.2f}MB")
        except Exception as e:
            print(f"Error processing {img_name}: {e}")
    else:
        print(f"File not found: {img_path}")
