from pathlib import Path
from PIL import Image
import json


# ============================================================
# Willa Travel
# 图片自动压缩 + 自动生成 photos.json
# ============================================================


# ============================================================
# 1. 基本路径
# ============================================================

BASE_DIR = Path(__file__).parent

# 原始照片
IMAGE_DIR = BASE_DIR / "images"

# 压缩后的照片
OUTPUT_DIR = BASE_DIR / "images_compressed"

# 自动生成的照片列表
PHOTOS_JSON = BASE_DIR / "photos.json"


# ============================================================
# 2. 图片设置
# ============================================================

# 图片最长边最大尺寸
MAX_WIDTH = 2000
MAX_HEIGHT = 2000

# JPG / WEBP 图片质量
QUALITY = 82

# 支持的图片格式
IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
}


# ============================================================
# 3. 判断是否需要重新压缩
# ============================================================

def need_compress(source_path, output_path):

    # 压缩图片不存在
    if not output_path.exists():
        return True

    # 原图修改时间
    source_time = source_path.stat().st_mtime

    # 压缩图修改时间
    output_time = output_path.stat().st_mtime

    # 原图比压缩图更新
    if source_time > output_time:
        return True

    return False


# ============================================================
# 4. 压缩图片
# ============================================================

def compress_image(source_path, output_path):

    try:

        with Image.open(source_path) as img:

            # 保存原始尺寸
            original_size = img.size

            # ------------------------------------------------
            # 等比例缩小
            # 不会放大原图
            # ------------------------------------------------

            img.thumbnail(
                (MAX_WIDTH, MAX_HEIGHT),
                Image.Resampling.LANCZOS
            )


            # ------------------------------------------------
            # 创建目标文件夹
            # ------------------------------------------------

            output_path.parent.mkdir(
                parents=True,
                exist_ok=True
            )


            # 文件后缀
            suffix = source_path.suffix.lower()


            # =================================================
            # JPG / JPEG
            # =================================================

            if suffix in [".jpg", ".jpeg"]:

                # JPG 不支持 RGBA
                if img.mode != "RGB":

                    img = img.convert("RGB")


                img.save(
                    output_path,
                    "JPEG",
                    quality=QUALITY,
                    optimize=True
                )


            # =================================================
            # PNG
            # =================================================

            elif suffix == ".png":

                img.save(
                    output_path,
                    "PNG",
                    optimize=True
                )


            # =================================================
            # WEBP
            # =================================================

            elif suffix == ".webp":

                img.save(
                    output_path,
                    "WEBP",
                    quality=QUALITY,
                    method=6
                )


            else:

                return False


            # ------------------------------------------------
            # 计算文件大小
            # ------------------------------------------------

            original_mb = (
                source_path.stat().st_size
                / 1024
                / 1024
            )

            compressed_mb = (
                output_path.stat().st_size
                / 1024
                / 1024
            )


            # ------------------------------------------------
            # 输出结果
            # ------------------------------------------------

            print(
                f"✓ {source_path.relative_to(IMAGE_DIR)}"
            )

            print(
                f"  {original_mb:.2f} MB"
                f" → "
                f"{compressed_mb:.2f} MB"
            )

            print(
                f"  {original_size}"
                f" → "
                f"{img.size}"
            )

            print()


            return True


    except Exception as e:

        print(
            f"✗ 压缩失败："
            f"{source_path}"
        )

        print(
            f"  原因：{e}"
        )

        print()


        return False


# ============================================================
# 5. 自动生成 photos.json
# ============================================================

def generate_photos_json():

    print()
    print("=" * 65)
    print("正在生成 photos.json")
    print("=" * 65)
    print()


    # 用来保存所有地点
    photos_data = {}


    # --------------------------------------------------------
    # 检查 images 文件夹
    # --------------------------------------------------------

    if not IMAGE_DIR.exists():

        print(
            "❌ 找不到 images 文件夹"
        )

        return


    # --------------------------------------------------------
    # 获取所有地点文件夹
    # --------------------------------------------------------

    location_folders = [

        folder

        for folder in IMAGE_DIR.iterdir()

        if folder.is_dir()

    ]


    # --------------------------------------------------------
    # 一个地点一个地点处理
    # --------------------------------------------------------

    for folder in sorted(
        location_folders,
        key=lambda x: x.name.lower()
    ):


        # 地点 ID
        location_id = folder.name


        # ----------------------------------------------------
        # 输出当前地点
        # ----------------------------------------------------

        print(
            f"📁 {location_id}"
        )


        # 当前地点的照片
        photos = []


        # ----------------------------------------------------
        # 获取这个文件夹里的所有图片
        # ----------------------------------------------------

        image_files = [

            file

            for file in folder.iterdir()

            if (
                file.is_file()
                and
                file.suffix.lower()
                in IMAGE_EXTENSIONS
            )

        ]


        # ----------------------------------------------------
        # 按文件名排序
        # ----------------------------------------------------

        image_files.sort(
            key=lambda x: x.name.lower()
        )


        # ====================================================
        # 处理每一张照片
        # ====================================================

        for image in image_files:


            # =================================================
            # ★★★ 关键逻辑 ★★★
            #
            # 如果：
            #
            # 文件夹：
            # daheifeng
            #
            # 图片：
            # daheifeng.jpg
            #
            # 那么：
            #
            # image.stem = daheifeng
            # location_id = daheifeng
            #
            # 说明它是封面。
            #
            # 封面：
            # ✔ 会被压缩
            # ❌ 不加入 photos.json
            # =================================================

            image_name_without_extension = (
                image.stem.lower()
            )

            location_id_lower = (
                location_id.lower()
            )


            if (
                image_name_without_extension
                ==
                location_id_lower
            ):

                print(
                    f"  🖼 封面：{image.name}"
                )

                # 封面不加入照片墙
                continue


            # =================================================
            # 普通照片
            # =================================================

            relative_path = (
                image.relative_to(
                    IMAGE_DIR
                )
            )


            # 压缩后的文件路径
            compressed_path = (
                OUTPUT_DIR
                / relative_path
            )


            # 转成网页路径
            web_path = str(
                compressed_path.relative_to(
                    BASE_DIR
                )
            ).replace(
                "\\",
                "/"
            )


            # 加入照片列表
            photos.append(
                web_path
            )


            print(
                f"  📸 照片：{image.name}"
            )


        # ----------------------------------------------------
        # 保存这个地点的照片
        # ----------------------------------------------------

        photos_data[
            location_id
        ] = photos


        print(
            f"  → 照片墙：{len(photos)} 张"
        )

        print()


    # ========================================================
    # 写入 photos.json
    # ========================================================

    with open(
        PHOTOS_JSON,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            photos_data,
            f,
            ensure_ascii=False,
            indent=4
        )


    print(
        "✓ photos.json 已生成"
    )

    print(
        f"✓ 共记录 {len(photos_data)} 个地点"
    )

    print()


# ============================================================
# 6. 主程序
# ============================================================

def main():

    print()
    print("=" * 65)
    print("Willa Travel · 图片压缩工具")
    print("=" * 65)
    print()


    # ========================================================
    # 检查 images
    # ========================================================

    if not IMAGE_DIR.exists():

        print(
            "❌ 找不到 images 文件夹"
        )

        print(
            f"应该存在：{IMAGE_DIR}"
        )

        return


    # ========================================================
    # 创建压缩文件夹
    # ========================================================

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )


    # ========================================================
    # 搜索所有图片
    # ========================================================

    image_files = [

        file

        for file in IMAGE_DIR.rglob("*")

        if (
            file.is_file()
            and
            file.suffix.lower()
            in IMAGE_EXTENSIONS
        )

    ]


    print(
        f"发现 {len(image_files)} 张照片"
    )

    print()


    # ========================================================
    # 统计
    # ========================================================

    compressed_count = 0

    skipped_count = 0

    failed_count = 0


    # ========================================================
    # 开始压缩
    # ========================================================

    for source_path in image_files:


        # ----------------------------------------------------
        # 获取相对路径
        # ----------------------------------------------------

        relative_path = (
            source_path.relative_to(
                IMAGE_DIR
            )
        )


        # ----------------------------------------------------
        # 压缩文件路径
        # ----------------------------------------------------

        output_path = (
            OUTPUT_DIR
            / relative_path
        )


        # ====================================================
        # 判断是否已经压缩
        # ====================================================

        if not need_compress(
            source_path,
            output_path
        ):

            print(
                f"⏭ 跳过："
                f"{relative_path}"
            )

            skipped_count += 1

            continue


        # ====================================================
        # 执行压缩
        # ====================================================

        success = compress_image(
            source_path,
            output_path
        )


        if success:

            compressed_count += 1

        else:

            failed_count += 1


    # ========================================================
    # 自动生成照片列表
    # ========================================================

    generate_photos_json()


    # ========================================================
    # 最终结果
    # ========================================================

    print()
    print("=" * 65)
    print("处理完成")
    print("=" * 65)
    print()


    print(
        f"新增 / 更新：{compressed_count} 张"
    )

    print(
        f"跳过：{skipped_count} 张"
    )

    print(
        f"失败：{failed_count} 张"
    )

    print()


    print(
        f"压缩照片位置："
    )

    print(
        f"  {OUTPUT_DIR}"
    )

    print()


    print(
        f"照片列表："
    )

    print(
        f"  {PHOTOS_JSON}"
    )

    print()


    print("=" * 65)
    print("全部完成 ✓")
    print("=" * 65)
    print()


# ============================================================
# 7. 程序入口
# ============================================================

if __name__ == "__main__":

    main()