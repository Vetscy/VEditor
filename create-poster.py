#!/usr/bin/env python3
"""
Captura um frame do vídeo e aplica blur para usar como miniatura.
Requer: Pillow, imageio, opencv-python (ou apenas Pillow + imageio)
Instalação: pip install Pillow imageio imageio-ffmpeg
"""

import os
import sys
from pathlib import Path

# Verificar se Pillow está disponível
try:
    from PIL import Image, ImageFilter
except ImportError:
    print("❌ Pillow não está instalado.")
    print("Instale com: pip install Pillow")
    sys.exit(1)

# Tentar importar imageio para capturar frame do vídeo
try:
    import imageio
except ImportError:
    print("❌ imageio não está instalado.")
    print("Instale com: pip install imageio imageio-ffmpeg")
    sys.exit(1)

# Caminhos
video_path = Path("demonstrações/demonstração.mp4")
output_path = Path("image/Miniatura.png")

if not video_path.exists():
    print(f"❌ Vídeo não encontrado: {video_path}")
    sys.exit(1)

print(f"📹 Lendo vídeo: {video_path}")
try:
    reader = imageio.get_reader(str(video_path))
    # Capturar frame no segundo 2 (ou o primeiro frame disponível)
    frame_index = min(2 * reader.get_meta_data()['fps'], len(reader) - 1)
    frame = reader.get_data(int(frame_index))
    reader.close()
except Exception as e:
    print(f"❌ Erro ao ler vídeo: {e}")
    sys.exit(1)

# Converter para PIL Image
img = Image.fromarray(frame)

# Redimensionar para 1280x720 se necessário
if img.size != (1280, 720):
    img = img.resize((1280, 720), Image.Resampling.LANCZOS)

# Aplicar blur (radius 20 para blur bem notável)
print("✨ Aplicando blur na imagem...")
img_blurred = img.filter(ImageFilter.GaussianBlur(radius=20))

# Criar diretório se não existir
output_path.parent.mkdir(parents=True, exist_ok=True)

# Salvar imagem
print(f"💾 Salvando miniatura: {output_path}")
img_blurred.save(str(output_path), "PNG", quality=90)

print("✅ Miniatura criada com sucesso!")
print(f"   Arquivo: {output_path}")
print(f"   Tamanho: {output_path.stat().st_size / 1024:.1f} KB")
