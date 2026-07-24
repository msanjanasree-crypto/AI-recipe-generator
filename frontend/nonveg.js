const form = document.getElementById("recipeForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const ingredient = document.getElementById("ingredientInput").value.trim();

    if (ingredient === "") {
        alert("Please enter ingredients.");
        return;
    }

    localStorage.setItem("ingredient", ingredient);
    localStorage.setItem("category", "Non-Veg");

    window.location.href = "recipe.html";

});
