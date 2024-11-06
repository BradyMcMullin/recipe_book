console.log("connected")

let recipeWrapper = document.querySelector("#recipe-container");
let inputRecipeName = document.querySelector("#edit-recipe-name");
let inputRecipeIngredients = document.querySelector("#edit-recipe-ingredients");
let inputRecipeComment = document.querySelector("#edit-recipe-comment");
let inputRecipeCalories = document.querySelector("#edit-recipe-calories");
let inputRecipeSize = document.querySelector("#edit-recipe-size");
let inputRecipeTime = document.querySelector("#edit-recipe-time");
let saveRecipeButton = document.querySelector("#save-recipe-button");
let cancelEditRecipeButton = document.querySelector("#cancel-edit-recipe");
let cancelRecipeButton = document.querySelector("#cancel-add-recipe-button");

let addUserButton = document.querySelector("#submit-sign-up")
let addEditIngredientButton = document.querySelector("#add-edit-ingredient");
let addNewRecipeButton = document.querySelector("#add-new-recipe-button")
let addIngredientButton = document.querySelector("#add-new-ingredient");

let recipeId = null;


const apiUrl = window.location.protocol === 'file:'
    ? 'http://localhost:8080' // Local api server during development
    : ''; //Production API

function saveRecipeToServer(recipeId = null){
    console.log("save button clicked");
    let data = "";
    let ingredients = "";
    if (recipeId){
        // Editing an existing recipe
        ingredients = Array.from(document.querySelectorAll("#edit-ingredient-container .ingredient-input"))
            .map(input => input.value.trim())
            .filter(ingredient => ingredient !== "") // Exclude empty inputs
            .join(",");
        data += "name=" + encodeURIComponent(inputRecipeName.value);
        data += "&comment=" + encodeURIComponent(inputRecipeComment.value);
        data += "&ingredients=" + encodeURIComponent(ingredients);
        data += "&calories=" + encodeURIComponent(inputRecipeCalories.value);
        data += "&size=" + encodeURIComponent(inputRecipeSize.value);
        data += "&time=" + encodeURIComponent(inputRecipeTime.value);

    } else{
        // Adding a new recipe
        ingredients = Array.from(document.querySelectorAll("#recipe-form .ingredient-input"))
            .map(input => input.value.trim())
            .filter(ingredient => ingredient !== "") // Exclude empty inputs
            .join(",");
        data += "name=" + encodeURIComponent(document.querySelector("#input-recipe-name").value);
        data += "&comment=" + encodeURIComponent(document.querySelector("#comment").value);
        data += "&ingredients=" + encodeURIComponent(ingredients);
        data += "&calories=" + encodeURIComponent(document.querySelector("#input-calories").value);
        data += "&size=" + encodeURIComponent(document.querySelector("#input-size").value);
        data += "&time=" + encodeURIComponent(document.querySelector("#time").value);
    }

    let method = "POST";
    let URL = apiUrl+"/recipes";
    if(recipeId){
        method = "PUT";
        URL = apiUrl+"/recipes/" + recipeId;
    }
    console.log(method);
    console.log(ingredients); 
    //fetch request
    fetch(URL,{
            method: method,
            body: data,
            headers: {
                "Content-Type":"application/x-www-form-urlencoded"
            }
        }).then(function(response){
            console.log("Updated", response);
            if (response.ok) {
                loadRecipesFromServer();
                document.getElementById("edit-recipe-form").style.display = "none";
                document.getElementById("add-recipe-content").style.display = "none";
                document.querySelector(".recipe-box-container").style.display = "block";
            } else{
                console.error("Failed to update: Server responded with an error", response.status);
            }
        });
}

function addRecipeCard(data){
    //create the card
    let recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    //create the name for the card
    let recipeName = document.createElement("h3");
    recipeName.textContent = data.name;

    //create the ingredients
    let ingredientsList = document.createElement("ul");
    ingredientLi = document.createElement("li");
    ingredientLi.innerHTML = "<strong>&nbsp;Ingredients:</strong>";
    ingredientsList.appendChild(ingredientLi);
    formattedIngredients = data.ingredients.split(",");
    if(Array.isArray(formattedIngredients)){
        formattedIngredients.forEach(function(ingredient){
            let li = document.createElement("li");
            li.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ingredient;
            ingredientsList.appendChild(li);
        });
    }else {
        let li = document.createElement("li");
        li.textContent = "No ingredients available";
        ingredientsList.appendChild(li);
    }
    //append calories and time to the ingrediet list for visuals
    calorieTitle = document.createElement("li");
    calorieTitle.innerHTML = "<strong>Calories/"+data.size+":</strong> "+data.calories + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Cooking Time:</strong> " + data.time;
    ingredientsList.appendChild(calorieTitle)

    //create comment
    let recipeComment = document.createElement("p");
    recipeComment.textContent = data.comment;

    //initially set attributes to hidden
    ingredientsList.style.display = "none";
    recipeComment.style.display = "none";

    //create line serperaters
    let line = document.createElement("hr");
    let otherLine = document.createElement("hr");
    line.style.display = "none";
    otherLine.style.display = "none";

    //container for both buttons
    let buttonContainer = document.createElement("span");
    buttonContainer.className = "recipe-button-container";
    //create edit button (hidden)
    let editButton = document.createElement("button");
    editButton.className = "edit-recipe-button";
    editButton.textContent = "Edit";
    editButton.style.display = "none";
    buttonContainer.appendChild(editButton);

    //create remove button(hidden)
    let removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.textContent = "Remove";
    removeButton.style.display = "none";
    buttonContainer.appendChild(removeButton);

    recipeCard.appendChild(recipeName);
    recipeCard.appendChild(line);
    recipeCard.appendChild(ingredientsList);
    recipeCard.appendChild(otherLine);
    recipeCard.appendChild(recipeComment);
    recipeCard.appendChild(buttonContainer);
    recipeWrapper.appendChild(recipeCard);

    toggleRecipe(recipeCard, ingredientsList, recipeComment, editButton, removeButton);

    editButton.onclick = function(){
        editRecipe(data);
    }
    removeButton.onclick = function(){
        const userConfirmed = confirm("Are you sure you want to delete this recipe?");
        if (userConfirmed) {
            removeRecipe(data, recipeCard);
        } else {
            console.log("Recipe deletion canceled by user.");
        }
    }
}

function removeRecipe(data, recipeCard){
    const URL = apiUrl+"/recipes/"+data.id;

    fetch(URL,{
        method: "DELETE",
    }).then(response=>{
        if (response.ok){
            recipeWrapper.removeChild(recipeCard);
            console.log("Recipe removed successfully");
        } else{
            console.log("Failed to remove recipe: Server responded with an error", response.status);
        }
    })
}

//needs to be updated!!!
function editRecipe(data){

    //make edit form visible
    console.log("Recipe id: ", data.id)
    inputRecipeName.value = data.name;
    inputRecipeComment.value = data.comment;
    inputRecipeCalories.value = data.calories;
    inputRecipeSize.value = data.size;
    inputRecipeTime.value = data.time;
    recipeId = data.id;

    const ingredientContainer = document.querySelector("#edit-ingredient-container");
    ingredientContainer.innerHTML = "";
    document.querySelector(".recipe-box-container").style.display= "none";

    formattedIngredients = data.ingredients.split(",");
    console.log(formattedIngredients);
    formattedIngredients.forEach(function (ingredient){
        const ingredientInput = document.createElement("input");
        ingredientInput.type = "text";
        ingredientInput.className = "ingredient-input";
        ingredientInput.value = ingredient;
        ingredientInput.placeholder = "Add Ingredient";
        ingredientContainer.appendChild(ingredientInput);
    })

    document.getElementById("edit-recipe-form").style.display = "block";

    saveRecipeButton.onclick = function(){
        saveRecipeToServer(data.id);
    }
}

function loadRecipesFromServer(){
    recipeWrapper.innerHTML = "";
    fetch("http://localhost:8080/recipes")
        .then(function(response){
            response.json()
                .then(function(data){
                    let recipes = data;
                    console.log(recipes)
                    recipes.forEach(function(recipe){
                        addRecipeCard(recipe);
                    });
                })
        })
}


function addNewRecipe(){
    saveRecipeToServer();
    resetAddRecipe("add");
    recipeId = null;
}

function removeExtraInputs(){
    const inputs = document.querySelectorAll(".ingredient-input");
    if (inputs.length > 1) {
        inputs.forEach((input, index) => {
            if (index > 0) { // Keep the first input, remove the rest
                input.parentNode.removeChild(input);
            }
        });
    }
}

function addNewIngredient(){
    const  newIngredient = document.createElement("input");
    newIngredient.type = 'text';
    newIngredient.className = 'ingredient-input';
    newIngredient.placeholder = 'Add Ingredient';

    const container = document.querySelector('#recipe-form section');
    container.appendChild(newIngredient);
}

function addNewEditIngredient(){
    const  newIngredient = document.createElement("input");
    newIngredient.type = 'text';
    newIngredient.className = 'ingredient-input';
    newIngredient.placeholder = 'Add Ingredient';

    const container = document.querySelector('#edit-recipe-formed section');
    container.appendChild(newIngredient);
}

function toggleRecipe(recipeCard, ingredientsList, recipeComment, editButton,removeButton){
    recipeCard.addEventListener("click", function(){
        const isHidden = ingredientsList.style.display === "none";
        ingredientsList.style.display = isHidden ? "block" : "none";
        recipeComment.style.display = isHidden ? "block" : "none";
        editButton.style.display = isHidden ? "block" : "none";
        removeButton.style.display = isHidden ? "block" : "none";

    });
}

function resetAddRecipe(type){
    console.log("button clicked");
    document.querySelector("#input-recipe-name").value = "";
    document.querySelector("#comment").value= "";
    document.querySelector("#input-calories").value="";
    document.querySelector("#input-size").value="";
    document.querySelector("#time").value="";
    //remove all extra ingredient boxes
    if (type == "add"){
        const ingredientAddButton = document.querySelector("#add-new-ingredient");
        const ingredientContainer = document.querySelector("#add-ingredient-container");
        ingredientContainer.innerHTML = "";
        const initialIngredientInput = document.createElement("input");
        initialIngredientInput.type = 'text';
        initialIngredientInput.className = 'ingredient-input';
        initialIngredientInput.placeholder = 'Add Ingredient';
        ingredientContainer.appendChild(initialIngredientInput);
        ingredientContainer.appendChild(ingredientAddButton);
        document.querySelector("#add-recipe-content").style.display = "none";
        document.querySelector(".recipe-box-container").style.display = "block";
    }else if(type =="edit"){
        const ingredientAddButton = document.querySelector("#add-new-edit-ingredient");
        const ingredientContainer = document.querySelector("#edit-ingredient-container");
        ingredientContainer.innerHTML = "";
        const initialIngredientInput = document.createElement("input");
        initialIngredientInput.type = 'text';
        initialIngredientInput.className = 'ingredient-input';
        initialIngredientInput.placeholder = 'Add Ingredient';
        ingredientContainer.appendChild(initialIngredientInput);
        ingredientContainer.appendChild(ingredientAddButton);
        document.querySelector("#edit-recipe-form").style.display = "none";
        document.querySelector(".recipe-box-container").style.display = "block";
    }
}

function addNewUser(){
    first_name = document.querySelector("#input-first-name").value;
    last_name = document.querySelector("#input-last-name").value;
    email = document.querySelector("#input-email").value;
    password = document.querySelector("#input-password").value;
    if (validateUserSubmition(first_name,last_name,email,password)){
        data = ""
        data+="first_name="+encodeURIComponent(first_name);
        data+="&last_name="+encodeURIComponent(last_name);
        data+="&email="+encodeURIComponent(email);
        data+="&password="+encodeURIComponent(password);
        fetch(apiUrl+"/users",{
            method: "POST",
            body: data,
            headers: {
                "Content-Type":"application/x-www-form-urlencoded"
            }
        }).then(function(response){
            console.log("Created", response);
            if (response.ok) {
                document.querySelector("#input-first-name").value="";
                document.querySelector("#input-last-name").value="";
                document.querySelector("#input-email").value="";
                document.querySelector("#input-password").value="";
                loadRecipesFromServer();
                
            } else{
                console.error("Failed to update: Server responded with an error", response.status);
            }
        });
    }
}

function validateUserSubmition(first_name, last_name, email, password){
    const requiredFields = [first_name,last_name,email,password]
    requiredFields.forEach(function(field){
        if(field.trim() == ""){
            alert('Please fill out all required fields.');
            return false;
        }
    });
    return true;
}

let addRecipeButton = document.querySelector("#add-recipe-button");
addRecipeButton.onclick = function(e){
    e.preventDefault();
    document.querySelector("#add-recipe-content").style.display = "block";
    document.querySelector(".recipe-box-container").style.display = "none";
    saveRecipeToServer();
};

addIngredientButton.onclick = addNewIngredient;

cancelEditRecipeButton.onclick = function(){
    document.getElementById("edit-recipe-form").style.display = "none";
    document.querySelector(".recipe-box-container").style.display = "block";
}
addNewRecipeButton.onclick = function(){
    document.querySelector(".recipe-box-container").style.display = "none";
    document.querySelector("#add-recipe-content").style.display = "block";
}
cancelRecipeButton.onclick = function(){
    resetAddRecipe("add");
}
addEditIngredientButton.onclick = addNewEditIngredient;
document.querySelector("#save-recipe-button").onclick = function(){
    addNewRecipe();
}

addUserButton.onclick = addNewUser;

loadRecipesFromServer();
