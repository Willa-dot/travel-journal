// ========================================
// 获取旅行 ID
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    params.get("id");


// ========================================
// 图片路径转换
// ========================================

function getCompressedImage(path) {

    if (!path) {
        return "";
    }

    if (
        path.includes(
            "images_compressed/"
        )
    ) {
        return path;
    }

    return path.replace(
        /^images\//,
        "images_compressed/"
    );
}


// ========================================
// 读取 travels.json
// ========================================

fetch("travels.json")

    .then(response => {

        if (!response.ok) {
            throw new Error(
                "travels.json 读取失败：" +
                response.status
            );
        }

        return response.json();

    })

    .then(travels => {

        const travel =
            travels.find(
                item => item.id === id
            );


        if (!travel) {

            document.body.innerHTML =
                "<h2>没有找到该旅行记录</h2>";

            return;
        }


        // ==================================
        // 标题
        // ==================================

        document.getElementById(
            "title"
        ).innerText =
            travel.title;


        // ==================================
        // 地点
        // ==================================

        document.getElementById(
            "location"
        ).innerText =
            travel.location;


        // ==================================
        // 信息
        // ==================================

        const info =
            document.querySelector(
                ".info"
            );

        info.innerHTML = "";


        function addInfo(text) {

            if (text) {

                const p =
                    document.createElement(
                        "p"
                    );

                p.innerText =
                    text;

                info.appendChild(p);
            }
        }


        addInfo(travel.type);

        addInfo(travel.date);


        if (travel.distance) {

            addInfo(
                "📏 " +
                travel.distance
            );
        }


        addInfo(travel.route);

        addInfo(travel.difficulty);


        // ==================================
        // 封面
        // ==================================

        const cover =
            document.getElementById(
                "cover"
            );


        const compressedCover =
            getCompressedImage(
                travel.image
            );


        cover.src =
            compressedCover;


        cover.alt =
            travel.title;


        cover.loading =
            "lazy";


        // ==================================
        // 描述
        // ==================================

        document.getElementById(
            "description"
        ).innerText =
            travel.description;


        // ==================================
        // 先读取照片列表
        // ==================================

        return fetch("photos.json")

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "photos.json 读取失败"
                    );

                }

                return response.json();

            })

            .then(photoData => {

                return {
                    travel,
                    photoData
                };

            })

            .catch(error => {

                console.warn(
                    "photos.json 不可用，使用 travels.json 中的 photos",
                    error
                );

                return {
                    travel,
                    photoData: null
                };

            });

    })

    .then(result => {

        if (!result) {
            return;
        }


        const travel =
            result.travel;


        const photoData =
            result.photoData;


        // ==================================
        // 获取照片
        // ==================================

        let photos = [];


        // 优先使用 photos.json

        if (
            photoData &&
            photoData[travel.id]
        ) {

            photos =
                photoData[travel.id];

        }


        // 如果没有 photos.json
        // 则使用 travels.json

        else {

            photos =
                travel.photos || [];

            photos =
                photos.map(
                    getCompressedImage
                );

        }


        // ==================================
        // 图片墙
        // ==================================

        const gallery =
            document.querySelector(
                ".gallery"
            );


        gallery.innerHTML = "";


        photos.forEach(photo => {

            const img =
                document.createElement(
                    "img"
                );


            img.src =
                photo;


            img.alt =
                travel.title;


            img.loading =
                "lazy";


            img.className =
                "gallery-img";


            gallery.appendChild(img);


            img.onclick =
                function () {

                    openLightbox(
                        photo
                    );

                };

        });


        // ==================================
        // 封面点击放大
        // ==================================

        const cover =
            document.getElementById(
                "cover"
            );


        cover.onclick =
            function () {

                openLightbox(
                    getCompressedImage(
                        travel.image
                    )
                );

            };

    })

    .catch(error => {

        console.error(
            "读取旅行数据失败：",
            error
        );

    });


// ========================================
// 图片放大
// ========================================

const lightbox =
    document.querySelector(
        ".lightbox"
    );


const lightboxImg =
    document.getElementById(
        "lightbox-img"
    );


// ========================================
// 打开
// ========================================

function openLightbox(src) {

    lightbox.style.display =
        "flex";

    lightboxImg.src =
        src;
}


// ========================================
// 关闭
// ========================================

const close =
    document.querySelector(
        ".close"
    );


close.onclick =
    function () {

        lightbox.style.display =
            "none";

    };


// ========================================
// 点击背景关闭
// ========================================

lightbox.onclick =
    function (e) {

        if (
            e.target === lightbox
        ) {

            lightbox.style.display =
                "none";

        }

    };