const params = new URLSearchParams(
    window.location.search
);

const id = params.get("id");


// ================================
// 读取 travels.json
// ================================

fetch("travels.json")

    .then(response => response.json())

    .then(travels => {

        const travel = travels.find(
            item => item.id === id
        );


        // =========================
        // 找不到旅行记录
        // =========================

        if (!travel) {

            document.body.innerHTML =
                "<h2>没有找到该旅行记录</h2>";

            return;

        }


        // =========================
        // 标题
        // =========================

        document.getElementById("title")
            .innerText =
            travel.title;


        // =========================
        // 地点
        // =========================

        document.getElementById("location")
            .innerText =
            travel.location;


        // =========================
        // 信息区域
        // =========================

        const info =
            document.querySelector(".info");

        info.innerHTML = "";


        function addInfo(text) {

            if (text) {

                const p =
                    document.createElement("p");

                p.innerText = text;

                info.appendChild(p);

            }

        }


        addInfo(travel.type);

        addInfo(travel.date);


        if (travel.distance) {

            addInfo(
                "📏 " + travel.distance
            );

        }


        addInfo(travel.route);

        addInfo(travel.difficulty);


        // =========================
        // 封面
        // =========================

        const cover =
            document.getElementById("cover");


        const originalCover =
            travel.image;


        const compressedCover =
            getCompressedImage(
                originalCover
            );


        cover.src =
            compressedCover;


        cover.loading = "eager";

        cover.decoding = "async";


        // 如果压缩封面不存在
        // 自动退回原图

        cover.onerror = function () {

            if (
                this.src !==
                new URL(
                    originalCover,
                    window.location.href
                ).href
            ) {

                this.src =
                    originalCover;

            }

        };


        // =========================
        // 描述
        // =========================

        document.getElementById(
            "description"
        ).innerText =
            travel.description;


        // =========================
        // 图片墙
        // =========================

        const gallery =
            document.querySelector(
                ".gallery"
            );


        gallery.innerHTML = "";


        // 防止封面重复出现在照片墙
        const coverPath =
            normalizePath(
                travel.image
            );


        travel.photos.forEach(
            photo => {

                // 如果照片墙里有封面
                // 就跳过

                if (
                    normalizePath(photo) ===
                    coverPath
                ) {

                    return;

                }


                const img =
                    document.createElement(
                        "img"
                    );


                // 原始图片
                const originalPhoto =
                    photo;


                // 压缩图片
                const compressedPhoto =
                    getCompressedImage(
                        photo
                    );


                img.src =
                    compressedPhoto;


                img.loading =
                    "lazy";


                img.decoding =
                    "async";


                img.className =
                    "gallery-img";


                img.alt =
                    travel.title;


                // =====================
                // 压缩图加载失败
                // 自动使用原图
                // =====================

                img.onerror =
                    function () {

                        if (
                            this.src !==
                            new URL(
                                originalPhoto,
                                window.location.href
                            ).href
                        ) {

                            this.src =
                                originalPhoto;

                        }

                    };


                gallery.appendChild(
                    img
                );


                // =====================
                // 点击放大
                // =====================

                img.onclick =
                    function () {

                        openLightbox(
                            compressedPhoto
                        );

                    };

            }
        );


        // =========================
        // 封面点击放大
        // =========================

        cover.onclick =
            function () {

                openLightbox(
                    compressedCover
                );

            };

    });


// ================================
// 获取压缩图片路径
// ================================

function getCompressedImage(
    path
) {

    if (!path) {

        return "";

    }


    return path.replace(
        /^images\//,
        "images_compressed/"
    );

}


// ================================
// 统一路径
// 用于判断封面是否重复
// ================================

function normalizePath(
    path
) {

    if (!path) {

        return "";

    }


    return path
        .replace(
            /^\.?\//,
            ""
        )
        .replace(
            /^images_compressed\//,
            "images/"
        );

}


// ================================
// 图片放大
// ================================

const lightbox =
    document.querySelector(
        ".lightbox"
    );


const lightboxImg =
    document.getElementById(
        "lightbox-img"
    );


function openLightbox(src) {

    lightbox.style.display =
        "flex";


    lightboxImg.src =
        src;

}


// ================================
// 关闭
// ================================

const close =
    document.querySelector(
        ".close"
    );


close.onclick =
    function () {

        lightbox.style.display =
            "none";

    };


// ================================
// 点击背景关闭
// ================================

lightbox.onclick =
    function (e) {

        if (
            e.target === lightbox
        ) {

            lightbox.style.display =
                "none";

        }

    };