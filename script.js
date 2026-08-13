let allTravels = [];

const list = document.getElementById("travel-list");


// ========================================
// 图片路径转换
// 原始路径：images/xxx/xxx.jpg
// 网站路径：images_compressed/xxx/xxx.jpg
// ========================================

function getCompressedImage(path) {

    if (!path) {
        return "";
    }

    // 如果已经是压缩图片，就不重复处理
    if (path.includes("images_compressed/")) {
        return path;
    }

    // 把 images/ 替换成 images_compressed/
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
                "travels.json 读取失败：" + response.status
            );
        }

        return response.json();

    })

    .then(data => {

        allTravels = data;

        showTravels(allTravels);

    })

    .catch(error => {

        console.error(
            "读取 travels.json 失败：",
            error
        );

    });


// ========================================
// 显示旅行卡片
// ========================================

function showTravels(travels) {

    list.innerHTML = "";


    travels.forEach(travel => {

        // 压缩后的封面图片
        const compressedImage =
            getCompressedImage(travel.image);


        list.innerHTML += `

        <a
            href="travel.html?id=${travel.id}"
            class="travel-link"
        >

            <div class="card">

                <!-- 封面 -->

                <img
                    src="${compressedImage}"
                    alt="${travel.title}"
                    loading="lazy"
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

}


// ========================================
// 分类筛选
// ========================================

const buttons =
    document.querySelectorAll(
        ".filters button"
    );


buttons.forEach(button => {

    button.onclick = function () {

        const type =
            this.dataset.type;


        // ==================================
        // 全部
        // ==================================

        if (type === "全部") {

            showTravels(allTravels);

        }


        // ==================================
        // 分类
        // ==================================

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