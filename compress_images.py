from PIL import Image
from pathlib import Path


# ================================
# 文件夹设置
# ================================

SOURCE_DIR = Path("images")
OUTPUT_DIR = Path("images_compressed")


# ================================
# 支持的图片格式
# ================================

SUPPORTED_FORMATS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
}


# ================================
# 压缩参数
# ================================

# JPG / JPEG 图片质量
JPEG_QUALITY = 82

# PNG 如果需要转换成 JPG
PNG_QUALITY = 82

# 最大宽度
MAX_WIDTH = 2000


# ================================
# 创建输出文件夹
# ================================

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ================================
# 压缩单张图片
# ================================

def compress_image(source_path):

    # 保持 images 下面的目录结构
    relative_path = source_path.relative_to(
        SOURCE_DIR
    )

    output_path = OUTPUT_DIR / relative_path


    # 创建对应文件夹

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )


    # 如果压缩图片已经存在
    # 并且比原图更新
    # 就跳过

    if output_path.exists():

        if output_path.stat().st_mtime >= source_path.stat().st_mtime:

            print(
                f"跳过：{source_path}"
            )

            return


    try:

        with Image.open(source_path) as img:

            # =========================
            # 处理图片方向
            # =========================

            try:

                from PIL import ImageOps

                img = ImageOps.exif_transpose(img)

            except Exception:

                pass


            # =========================
            # 控制最大宽度
            # =========================

            width, height = img.size


            if width > MAX_WIDTH:

                new_height = int(
                    height * MAX_WIDTH / width
                )

                img = img.resize(
                    (
                        MAX_WIDTH,
                        new_height
                    ),
                    Image.Resampling.LANCZOS
                )


            # =========================
            # 转 RGB
            # =========================

            if img.mode not in (
                "RGB",
                "L"
            ):

                # 如果有透明背景
                # 使用白色背景

                if img.mode == "RGBA":

                    background = Image.new(
                        "RGB",
                        img.size,
                        "white"
                    )

                    background.paste(
                        img,
                        mask=img.getchannel("A")
                    )

                    img = background

                else:

                    img = img.convert("RGB")


            else:

                if img.mode == "L":

                    img = img.convert("RGB")


            # =========================
            # 输出为 JPG
            # =========================

            output_path = output_path.with_suffix(
                ".jpg"
            )


            img.save(
                output_path,
                "JPEG",
                quality=JPEG_QUALITY,
                optimize=True,
                progressive=True
            )


            print(
                f"完成：{source_path}"
            )

            print(
                f"  → {output_path}"
            )


    except Exception as e:

        print(
            f"处理失败：{source_path}"
        )

        print(
            f"错误：{e}"
        )


# ================================
# 扫描 images 文件夹
# ================================

def main():

    print()
    print("==============================")
    print("开始扫描图片")
    print("==============================")
    print()


    image_files = []


    for path in SOURCE_DIR.rglob("*"):

        if not path.is_file():

            continue


        if path.suffix.lower() in SUPPORTED_FORMATS:

            image_files.append(path)


    if not image_files:

        print("没有找到图片。")

        return


    print(
        f"找到 {len(image_files)} 张图片"
    )

    print()


    for image_path in image_files:

        compress_image(
            image_path
        )


    print()
    print("==============================")
    print("全部处理完成")
    print("==============================")
    print()


if __name__ == "__main__":

    main()