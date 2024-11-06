from flask import Flask,request
from recipes import RecipesDB


app = Flask(__name__)

@app.route("/recipes/<int:recipe_id>", methods=["OPTIONS"])
def handle_cors_options(recipe_id):
    return "", 204,{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":"PUT, DELETE",
        "Access-Control-Allow-Headers":"Content-Type"
    }

@app.route("/recipes", methods=["GET"])
def retrieve_recipes():
    db  = RecipesDB("recipes_db.db")
    recipes = db.getRecipes()
    return recipes, 200, {"Access-Control-Allow-Origin" : "*"}

@app.route("/recipes/<int:recipe_id>", methods=["GET"])
def retrieve_recipe(recipe_id):
    db  = RecipesDB("recipes_db.db")
    recipe = db.getRecipe(recipe_id)
    if recipe:  
        return recipe, 200, {"Access-Control-Allow-Origin" : "*"}
    else:
        return f"Recipe with {recipe_id} not found", 404, {"Acess-Control-Allow-Origin": "*"}

@app.route("/recipes",methods=["POST"])
def create_recipe():
    name = request.form['name']
    comment = request.form['comment']
    ingredients = request.form['ingredients']
    calories = request.form['calories']
    size = request.form['size']
    time = request.form['time']
    db = RecipesDB("recipes_db.db")
    print("The request data is: ", request.form)
    db.createRecipe(name, ingredients, comment, calories, size, time)
    return "Created", 201, {"Access-Control-Allow-Origin" : "*"}

@app.route("/recipes/<int:recipe_id>", methods=["PUT"])
def update_recipe(recipe_id):
    db = RecipesDB("recipes_db.db")
    recipe = db.getRecipe(recipe_id)
    if recipe:    
        name = request.form['name']
        comment = request.form['comment']
        ingredients = request.form['ingredients']
        calories = request.form['calories']
        size = request.form['size']
        time = request.form['time']
        db.updateRecipe(recipe_id,name, ingredients, comment, calories, size, time)
        return "updated",200, {"Access-Control-Allow-Origin" : "*"}
    else:
        return f"Recipe with {recipe_id} not found", 404, {"Access-Control-Allow-Origin" : "*"}
    
@app.route("/recipes/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    db = RecipesDB("recipes_db.db")
    recipe = db.getRecipe(recipe_id)
    if recipe:
        db.deleteRecipe(recipe_id)
        return "Deleted", 200, {"Access-Control-Allow-Origin": "*"}
    else:
        return f"Recip with ID {recipe_id} not found", 404, {"Access-Control-Allow-Origin": "*"}
    

@app.route("/users", methods = ["POST"])
def create_user():
    first_name = request.form["first_name"]
    last_name = request.form["last_name"]
    email =  request.form["email"]
    password = request.form["password"]
    db = RecipesDB("recipes_db.db")
    db.createUser(first_name, last_name, email, password)
    return "Created", 201, {"Access-Control-Allow-Origin" : "*"}

def main():
    app.run(port = 8080, host='0.0.0.0')
    
if __name__ == "__main__":
    main()