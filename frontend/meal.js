const week = [

"Monday",

"Tuesday",

"Wednesday",

"Thursday",

"Friday",

"Saturday",

"Sunday"

];

const breakfast=[

"Oats",

"Idli",

"Dosa",

"Poha",

"Smoothie"

];

const lunch=[

"Rice & Dal",

"Paneer Curry",

"Veg Biryani",

"Chicken Rice",

"Salad"

];

const dinner=[

"Soup",

"Chapati & Curry",

"Grilled Chicken",

"Pasta",

"Vegetable Stir Fry"

];

function random(arr){

return arr[Math.floor(Math.random()*arr.length)];

}

function generatePlan(){

let output="";

week.forEach(day=>{

output+=`

<div class="day">

<h3>${day}</h3>

<div class="meal">

<b>🍳 Breakfast</b>

<p>${random(breakfast)}</p>

</div>

<div class="meal">

<b>🍛 Lunch</b>

<p>${random(lunch)}</p>

</div>

<div class="meal">

<b>🌙 Dinner</b>

<p>${random(dinner)}</p>

</div>

</div>

`;

});

document.getElementById("mealPlan").innerHTML=output;

}

generatePlan();