let allTravels = [];

const list = document.getElementById("travel-list");


// ================================
// 读取 travels.json
// ================================

fetch("travels.json")
    .then(response => response.json())
    .then(data => {

        allTravels = data;

        showTravels(allTravels);

    })
    .catch(error => {

        console.error("读取 travels.json 失败：", error);

    });


// ================================
// 获取压缩图片路径
// ================================

function getCompressedImage(path) {

    // 例如：
    // images/beijing/beijing.jpg
    //
    // 自动变成：
    // images_compressed/beijing/beijing.jpg

    if (!path) {
        return "";
    }

    return path.replace(
        /^images\//,
        "images_compressed/"
    );

}


// ================================
// 显示旅行卡片
// ================================

function showTravels(travels) {

    list.innerHTML = "";

    travels.forEach(travel => {

        const originalImage = travel.image;

        const compressedImage =
            getCompressedImage(originalImage);


        list.innerHTML += `

        <a 
            href="travel.html?id=${travel.id}" 
            class="travel-link"
        >

            <div class="card">

                <!-- 封面 -->

                <img 
                    src="${compressedImage}"
                    data-original="${originalImage}"
                    alt="${travel.title}"
                    loading="lazy"
                    decoding="async"
                >


                <div class="card-content">

                    <!-- 地点名称 -->

                    <h3>
                        ${travel.title}
                    </h3>


                    <!-- 地点 + 分类 -->

                    <div class="card-meta">

                        <span>
                            ${travel.location}
                        </span>

                        <span>
                            ${travel.type}
                        </span>

                    </div>


                    <!-- 地点特色 -->

                    <small>
                        ${travel.subtitle || ""}
                    </small>

                </div>

            </div>

        </a>

        `;

    });


    // ================================
    // 压缩图片加载失败时
    // 自动使用原图
    // ================================

    const images =
        list.querySelectorAll("img");


    images.forEach(img => {

        img.onerror = function () {

            const original =
                this.dataset.original;


            // 防止原图也加载失败时无限循环

            if (
                original &&
                this.src !==
                new URL(
                    original,
                    window.location.href
                ).href
            ) {

                this.src = original;

            }

        };

    });

}


// ================================
// 分类筛选
// ================================

const buttons =
    document.querySelectorAll(
        ".filters button"
    );


buttons.forEach(button => {

    button.onclick = function () {

        const type =
            this.dataset.type;


        // =========================
        // 全部
        // =========================

        if (type === "全部") {

            showTravels(allTravels);

        }


        // =========================
        // 分类
        // =========================

        else {

            const result =
                allTravels.filter(
                    travel =>
                        travel.type === type
                );


            showTravels(result);

        }

    };

});