import sqlite3


def dict_factory(cursor,row):
    fields = []
    # Extract column names from cursor description
    for column in cursor.description:
        fields.append(column[0])

    # Create a dictionary where keys are column names and values are row values
    result_dict = {}
    for i in range(len(fields)):
        result_dict[fields[i]] = row[i]

    return result_dict

class RecipesDB():
    
    def __init__(self,filename ):
        self.connection = sqlite3.connect(filename)
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()
        return
    
    def getRecipes(self):
        self.cursor.execute("SELECT * FROM recipes")
        recipes = self.cursor.fetchall()
        return recipes
    
    def getRecipe(self, recipe_id):
        data = [recipe_id]
        self.cursor.execute("SELECT * FROM recipes WHERE id = ?",data)
        recipe = self.cursor.fetchone()
        return recipe
    
    def createRecipe(self, name, ingredients, comment, calories, size, time):
        data = [name, ingredients, comment, calories, size, time]
        self.cursor.execute("INSERT INTO recipes(name,ingredients,comment,calories,size,time)VALUES(?,?,?,?,?,?)",data)
        self.connection.commit()
        return
    
    def updateRecipe(self, recipe_id, name, ingredients, comment, calories, size, time):
        data = [name, ingredients, comment, calories, size, time, recipe_id]
        self.cursor.execute("UPDATE recipes SET name = ?, ingredients = ?, comment = ?, calories = ?, size = ?, time = ? WHERE id = ?",data)
        self.connection.commit()
        return
    
    def deleteRecipe(self, recipe_id):
        self.cursor.execute("DELETE FROM recipes WHERE id = ?", (recipe_id,))
        self.connection.commit()
        return
    
    def createUser(self, first_name, last_name, email, password):
        data = [first_name,last_name,email,password]
        self.cursor.execute("INSERT INTO users(first_name, last_name, email, password)VALUES(?,?,?,?)", data)
        self.connection.commit()
        return
    
    
        