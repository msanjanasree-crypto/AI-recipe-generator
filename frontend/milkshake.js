const form = document.getElementById("recipeForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const ingredient = document.getElementById("ingredients").value.trim();

    if (ingredient === "") {
        alert("Please enter ingredients.");
        return;
    }

    localStorage.setItem("ingredient", ingredient);
    localStorage.setItem("category", "Milkshake");

    window.location.href = "recipe.html";

});