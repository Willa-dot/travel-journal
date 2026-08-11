let allTravels=[];


const list =
document.getElementById("travel-list");



fetch("travels.json")

.then(response=>response.json())

.then(data=>{


allTravels=data;


showTravels(allTravels);



});



function showTravels(travels){


list.innerHTML="";



travels.forEach(travel=>{


list.innerHTML += `


<a href="travel.html?id=${travel.id}" class="travel-link">


<div class="card">


<img src="${travel.image}">


<div class="card-content">


<h3>${travel.title}</h3>


<p>${travel.location}</p>


<span>${travel.type}</span>


</div>


</div>


</a>


`;


});


}





const buttons =
document.querySelectorAll(".filters button");



buttons.forEach(button=>{


button.onclick=function(){


const type=this.dataset.type;



if(type==="全部"){


showTravels(allTravels);


}

else{


const result =
allTravels.filter(
travel=>travel.type===type
);


showTravels(result);


}


};


});