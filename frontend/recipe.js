/* ============================================
   HOME CHEF BUDDY AI
   recipe.js
============================================ */

const API_URL = "http://127.0.0.1:8000/recipe/generate";

const chatBox = document.getElementById("chatBox");

let category = "Veg";

if(window.location.pathname.includes("nonveg")){
    category = "Non-Veg";
}
else if(window.location.pathname.includes("milkshake")){
    category = "Milkshake";
}
else if(window.location.pathname.includes("dessert")){
    category = "Dessert";
}
/* ---------------- Scroll ---------------- */

function scrollChatToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ---------------- User Message ---------------- */

function addUserMessage(text) {

    const message = document.createElement("div");

    message.className = "message user";

    message.innerHTML = `
        <div class="avatar">
            <img src="images.jpeg" alt="You">
        </div>

        <div class="bubble">
            <div class="ai-name">You</div>
            <div>${text}</div>
        </div>
    `;

    chatBox.appendChild(message);

    scrollChatToBottom();
}

/* ---------------- Typing Animation ---------------- */

function addTypingMessage() {

    const typing = document.createElement("div");

    typing.className = "message ai";

    typing.id = "typingMessage";

    typing.innerHTML = `
        <div class="avatar">
            <img src="logo.jpeg" alt="Chef AI">
        </div>

        <div class="bubble">
            <div class="ai-name">Home Chef Buddy AI</div>

            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>
    `;

    chatBox.appendChild(typing);

    scrollChatToBottom();
}

function removeTypingMessage() {

    const typing = document.getElementById("typingMessage");

    if (typing) {
        typing.remove();
    }

}

/* ---------------- Recipe Card ---------------- */

function buildRecipeCard(recipe) {

    const ingredientsHTML = recipe.ingredients.map(item =>

        `<div class="ingredient">${item}</div>`

    ).join("");

    const stepsHTML = recipe.steps.map((step,index)=>`

        <div class="step">

            <div class="step-number">${index+1}</div>

            <div class="step-text">${step}</div>

        </div>

    `).join("");

    return `

<div class="recipe-result">

<div class="recipe-card">
<div class="recipe-image">

<img src="${recipe.image}" alt="${recipe.name}">

<span class="recipe-badge">✨ AI Generated</span>

</div>


<div class="recipe-content">

<h2 class="recipe-title">${recipe.name}</h2>

<p class="recipe-description">

${recipe.description}

</p>

<div class="recipe-info">

<div class="info-box">

<i>⏱</i>

<h4>${recipe.time}</h4>

<p>Cooking Time</p>

</div>

<div class="info-box">

<i>🔥</i>

<h4>${recipe.calories}</h4>

<p>Calories</p>

</div>

<div class="info-box">

<i>⭐</i>

<h4>${recipe.difficulty}</h4>

<p>Difficulty</p>

</div>

<div class="info-box">

<i>👥</i>

<h4>${recipe.servings}</h4>

<p>Servings</p>

</div>

</div>

<h3>🧺 Ingredients</h3>

<div class="ingredients">

${ingredientsHTML}

</div>

<h3>📋 Instructions</h3>

<div class="steps">

${stepsHTML}

</div>

<div class="chef-tip">

<h3>💡 Chef Tip</h3>

<p>${recipe.tip}</p>

</div>

<h3>📊 Nutrition</h3>

<div class="nutrition-grid">

<div class="nutrition-card">

<h3>${recipe.nutrition.calories}</h3>

<p>Calories</p>

</div>

<div class="nutrition-card">

<h3>${recipe.nutrition.protein}</h3>

<p>Protein</p>

</div>

<div class="nutrition-card">

<h3>${recipe.nutrition.carbs}</h3>

<p>Carbs</p>

</div>

<div class="nutrition-card">

<h3>${recipe.nutrition.fat}</h3>

<p>Fat</p>

</div>

</div>

<div class="action-buttons">

<button class="generate-btn" onclick="regenerate()">

✨ Generate Another

</button>

<button class="copy-btn" onclick="copyRecipe(this)">

📋 Copy

</button>

<button class="save-btn" onclick="saveRecipe(this)">

💾 Save

</button>

<button class="print-btn" onclick="window.print()">

🖨 Print

</button>

</div>

</div>

</div>

</div>

`;

}

function addRecipeMessage(recipe){

const message=document.createElement("div");

message.className="message ai";

message.innerHTML=`

<div class="avatar">

<img src="logo.jpeg">

</div>

<div class="bubble" style="max-width:820px;">

<div class="ai-name">

Home Chef Buddy AI

</div>

<div>

Here's your AI generated recipe 🍽️

</div>

${buildRecipeCard(recipe)}

</div>

`;

chatBox.appendChild(message);

scrollChatToBottom();

}
/* ============================================
   AI Backend Connection
============================================ */

async function runConversation(ingredientText) {

    addUserMessage(ingredientText);

    addTypingMessage();

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

    ingredients: ingredientText,

    category: category,

    meal_type: "Lunch"

})

        });

        if (!response.ok) {

            throw new Error("Backend Error");

        }

        const recipe = await response.json();

        removeTypingMessage();

        /* Dynamic Recipe Image */
        const imageUrl = recipe.image;



        addRecipeMessage({

            name: recipe.recipe_name,

            image: imageUrl,

            description: recipe.description,

            time: recipe.cooking_time,

            calories: recipe.nutrition.calories,

            difficulty: recipe.difficulty,

            servings: recipe.servings,

            ingredients: recipe.ingredients,

            steps: recipe.steps,

            tip: recipe.chef_tip,

            nutrition: recipe.nutrition

        });

    }

    catch (error) {

        removeTypingMessage();

        console.error(error);

        alert("❌ Failed to connect to AI Backend");

    }

}


/* ============================================
   Generate Again
============================================ */

function regenerate() {

    chatBox.innerHTML = "";

    const ingredient =
        localStorage.getItem("ingredient") || "";

    if (ingredient !== "") {

        runConversation(ingredient);

    }

}


/* ============================================
   Copy Recipe
============================================ */

function copyRecipe(btn) {

    const card = btn.closest(".recipe-content");

    const title =
        card.querySelector(".recipe-title").innerText;

    const description =
        card.querySelector(".recipe-description").innerText;

    const ingredients =
        [...card.querySelectorAll(".ingredient")]

        .map(item => item.innerText)

        .join("\n");

    const steps =
        [...card.querySelectorAll(".step-text")]

        .map((step, index) =>

            `${index + 1}. ${step.innerText}`

        )

        .join("\n");

    const text =

`${title}

${description}

Ingredients

${ingredients}

Instructions

${steps}`;

    navigator.clipboard.writeText(text);

    btn.innerHTML = "✅ Copied";

    setTimeout(() => {

        btn.innerHTML = "📋 Copy";

    },1500);

}


/* ============================================
   Save Recipe
============================================ */

function saveRecipe(btn){

    btn.innerHTML="✅ Saved";

    setTimeout(()=>{

        btn.innerHTML="💾 Save";

    },1500);

}
/* ============================================
   Initialize Page
============================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* First Recipe */

    const ingredient = localStorage.getItem("ingredient");

    if (ingredient) {

        runConversation(ingredient);

    }

    /* Input Box */

    const input = document.getElementById("ingredientInput");

    const sendBtn = document.getElementById("sendBtn");

    if (sendBtn) {

        sendBtn.addEventListener("click", sendRecipe);

    }

    if (input) {

        input.addEventListener("keydown", function(e){

            if(e.key==="Enter"){

                e.preventDefault();

                sendRecipe();

            }

        });

    }

    /* New Chat */

    const newChatBtn = document.getElementById("newChatBtn");

    if(newChatBtn){

        newChatBtn.addEventListener("click",function(){

            chatBox.innerHTML="";

            input.value="";

            input.focus();

        });

    }

    /* Scroll To Top */

    const scrollTop=document.getElementById("scrollTop");

    if(scrollTop){

        scrollTop.addEventListener("click",function(){

            chatBox.scrollTo({

                top:0,

                behavior:"smooth"

            });

        });

    }

});


/* ============================================
   Send New Recipe Request
============================================ */

function sendRecipe(){

    const input=document.getElementById("ingredientInput");

    const ingredient=input.value.trim();

    if(ingredient===""){

        alert("Please enter ingredients.");

        return;

    }

    localStorage.setItem("ingredient",ingredient);

    input.value="";

    runConversation(ingredient);

}


/* ============================================
   Optional Loader
============================================ */

window.addEventListener("load",()=>{

    const loader=document.getElementById("pageLoader");

    if(loader){

        setTimeout(()=>{

            loader.classList.add("hidden");

        },500);

    }

});


/* ============================================
   Theme Toggle (Optional)
============================================ */

const themeBtn=document.getElementById("themeToggle");

if(themeBtn){

    themeBtn.addEventListener("click",()=>{

        document.body.classList.toggle("dark");

    });

}


/* ============================================
   End of recipe.js
============================================ */






