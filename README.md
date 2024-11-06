# Resource: 
Recipe

## Attributes
The "Recipe" resource will have the following attributes:

1. **name** (String): The name of the recipe.
2. **ingredients** (String): A comma-separated list of ingredients required for the recipe.
3. **comment** (String): Additional comments or notes about the recipe.
4. **calories** (Number): The number of calories per serving.
5. **size** (String): The size or number of servings the recipe yields.
6. **time** (String): The time required to prepare and cook the recipe.

## Schema

```sql
CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    comment TEXT NOT NULL,
    calories INTEGER,
    size TEXT,
    time TEXT
);
```
# REST Endpoints

| **Name**                    | **Method** | **Path**            |
|-----------------------------|------------|---------------------|
| Retrieve recipe collection  | GET        | `/recipes`          |
| Retrieve recipe member      | GET        | `/recipes/<id>`     |
| Create recipe member        | POST       | `/recipes`          |
| Update recipe member        | PUT        | `/recipes/<id>`     |
| Delete recipe member        | DELETE     | `/recipes/<id>`     |