fetch("travels.json")

.then(response=>response.json())

.then(travels=>{


const params =
new URLSearchParams(
window.location.search
);


const id=params.get("id");


const travel =
travels.find(item=>item.id===id);



document.getElementById("title").innerHTML =
travel.title;


document.getElementById("location").innerHTML =
travel.location;
document.getElementById("type").innerHTML =
"🥾 " + travel.type;


document.getElementById("date").innerHTML =
"📅 " + travel.date;


if(travel.distance){

document.getElementById("distance").innerHTML =
"📏 " + travel.distance;

}
else{

document.getElementById("distance").style.display="none";

}



document.getElementById("route").innerHTML =
"🗺 " + travel.route;



if(travel.difficulty){

document.getElementById("difficulty").innerHTML =
"⭐ 难度：" + travel.difficulty;

}
else{

document.getElementById("difficulty").style.display="none";

}


document.getElementById("cover").src =
travel.image;
const cover =
document.getElementById("cover");


cover.onclick = function(){


    document.querySelector(".lightbox")
    .style.display="flex";


    document.getElementById("lightbox-img")
    .src=this.src;


};


document.getElementById("description").innerHTML =
travel.description;



const gallery =
document.querySelector(".gallery");



travel.photos.forEach(photo => {


const img = document.createElement("img");


img.src = photo;


img.className = "gallery-img";


// 点击放大
img.onclick = function(){

    document.querySelector(".lightbox")
    .style.display = "flex";


    document.getElementById("lightbox-img")
    .src = this.src;

};


gallery.appendChild(img);


});


document.querySelector(".close")
.onclick = function(){

    document.querySelector(".lightbox")
    .style.display = "none";

};


});