require('dotenv').config()

import {Brackets, createConnection, createQueryBuilder, QueryBuilder} from "typeorm";
import * as bcrypt from "bcrypt";
import * as express from "express";
import * as jwt from "jsonwebtoken"
import { User } from "./entities/User";
import { Food } from "./entities/Food";
import { Meal } from "./entities/Meal";
import { Log } from "./entities/Log";

import { authenticateJWT, checkFields, testUUID } from "./functions";

var app = express();
var port = 3000;

app.use(express.json())
const dbConnect = async () => {
    try {
        await createConnection().then(async conn => {
            await conn.runMigrations()
        })
        console.log("Connected to database")
    }
    catch(error) {
        console.error("Connection to database failed", error)
    }
}

dbConnect()

app.get('/', (_req, res) => {
    res.status(200).send('Hello World!');
});

app.route('/user')
    .put((req, res) => {

    })
    .delete((req, res) => {

    })

app.route('/meal')
    .get((req, res) => {

    })
    .post((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    })

app.route('/food')
    .get(authenticateJWT, async (req, res) => {
        console.log('got GET on /food', req.query);
        res.setHeader('Content-Type', 'application/json');

        let foodId = req.query.id;

        if (!foodId) {
            res.status(422).send({status: "422", message: "Missing food id parameter"});
        } else {
            // Validate food id format
            let validateUUID = testUUID(foodId);
            if (!validateUUID) {
                res.status(422).send({status: "422", message: "Invalid food id format"});
                return;
            }
            
            // Get the food from DB
            let food = await createQueryBuilder()
            .select("food")
            .from(Food, "food")
            .where("food.id = :id", {id: foodId})
            .leftJoinAndSelect("food.user", "user.id")
            .getOne();
            
            if(food == null) { // Food doesn't exist
                res.status(404).send({status: "404", message: "Food not found"});
            } else if(food.user == null) { // Food has no owner
                delete food.user;
                res.status(200).send({status: "200", food: food});
            } else if((food.user.id === req.user.id) || food.isPublic) { // If the user who requesting the food is the owner or if the food is public
                delete food.user;
                res.status(200).send({status: "200", food: food});
            } else { // The food exists but the user doesn't have access to it
                res.status(401).send({status: "401", message: "Access denied"});
            }
        }
    })
    .post(authenticateJWT, async(req, res) => {
        console.log('got POST on /food', req.query);
        res.setHeader("Content-Type", "application/json");

        const properties = ['name', 'description', 'userId', 'brand', 'calories', 'carbs', 'protein', 'fat', 'isPublic'];
        let error = "";

        console.log(req.body);
        properties.every(property => {
            if(!req.body.hasOwnProperty(property)) {
                error = `Request missing ${property} field`;
                return false;
            }
            return true;
        });

        // Missing field
        if(error != '') {
            res.status(422).send({status: "422", message: error});
        } else {
            // Validate user id format
            let validateUUID = testUUID(req.body['userId']);
            if (!validateUUID) {
                res.status(422).send({status: "422", message: "Invalid food id format"});
                return;
            }
            
            // Check field types and sizes
            for (const key in req.body){
                // String fields
                if(key === 'name' || key === 'description' || key === 'brand' || key === 'userId') {
                    if(typeof req.body[key] !== "string") {
                        error = 'Field ' + key + ' has to be string';
                        break
                    }
                    else if((req.body[key].length) < 1 && (key === 'name')) { // only name field can't be empty
                        error = 'Field ' + key + " can't be an empty string";
                        break
                    }
                }
                // Number fields
                else if(key === "calories" || key === "carbs" || key === 'protein' || key === 'fat') {
                    if (typeof req.body[key] !== 'number') {
                        error = 'Field ' + key + ' has to be integer'
                        break   
                    }
                    else if(req.body[key] < 0) {
                        error = 'Field ' + key + ' has to be positive'
                        break
                    }
                }
                // Boolean fields
                else if(key === 'isPublic') {
                    if(typeof req.body[key] !== 'boolean') {
                        error = 'Field ' + key + ' has to be boolean'
                        break
                    }
                }
            }

            if(error != '') {
                res.status(422)
                res.send({status: 422, message: error})
            }
        }

        await createQueryBuilder()
        .insert()
        .into(Food)
        .values([{
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            calories: req.body.calories,
            carbs: req.body.carbs,
            fat: req.body.fat,
            protein: req.body.protein,
            isPublic: req.body.isPublic,
            user: req.body.userId

        }])
        .execute()

        res.status(201).send({status: "201", message: "Food created"});
    })
    .put((req, res) => {

    })
    .delete(authenticateJWT, async (req, res) => {
        console.log('got DELETE on /food', req.query);
        res.setHeader('Content-Type', 'application/json');

        let foodId = req.query.id;

        if(!foodId) {
            res.status(422).send({status: "422", message: "Missing food id parameter"});
        } else {
            // validate food id format
            let validateUUID = testUUID(foodId);
            if (!validateUUID) {
                res.status(422).send({status: "422", message: "Invalid food id format"});
                return;
            }
        }

        // Get the food from DB
        let food = await createQueryBuilder()
        .select("food.id")
        .from(Food, "food")
        .where("food.id = :id", {id: foodId})
        .leftJoinAndSelect("food.user", "user.id")
        .getOne();

        // Check if the user created this food
        if(food.user.id === req.user.id) {
            await createQueryBuilder()
            .delete()
            .from(Food, "food")
            .where("food.id = :id", {id: foodId})
            .execute();

            res.status(200).send({status: "200", message: "OK"});
        } else {
            res.status(401).send({status: "401", message: "Access denied"});
        }
    })

app.route('/log')
    .get(async (req, res) => {
        console.log("got GET on /log", req.query)
        res.setHeader("Content-Type", "application/json")
        const date = req.query.date
        if(date === undefined) {
            res.status(422).send({status: 422, message: "Missing date in the query parameters"})
            return
        }
        const dateRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]{1}|[12][0-9]{1}|3[01]{1})$/
        if(date.match(dateRegex) === null) {
            res.status(422).send({status: 422, message: "Date should be in YYYY-MM-DD format"})
            return
        }
        const logs = await createQueryBuilder()
            .select("log")
            .where("log.date = :date", {date: `%${date}%`})
            .from(Log, "log")
            .getMany()
        res.status(200).send({status: 200, message: "OK", logs: logs})
    })
    .post(async (req, res) => {
        console.log("got POST on /log", req.body)
        res.setHeader("Content-Type", "application/json")
        // Check if any fields are missing
        const fields = ["name", "amount", "calories", "carbs", "fat", "protein", "date", "time"]
        const column = checkFields(req.body, fields)
        if (column != null) {
            res.status(422).send({status: 422, message: "Request is missing " + column + " field"})
            return
        }
        const dateRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]{1}|[12][0-9]{1}|3[01]{1})$/
        const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
        // Check date format
        if(req.body.date.match(dateRegex) === null) {
            res.status(422).send({status: 422, message: "Date should be in YYYY-MM-DD format"})
            return
        }
        // Check time format
        if(req.body.time.match(timeRegex) == null){
            res.status(422).send({status: 422, message: "Time should be in HH:MM:SS format"})
            return
        }
        await createQueryBuilder()
            .insert()
            .into(Log)
            .values([{
                name: req.body.name,
                amount: req.body.amount,
                calories: req.body.calories,
                carbs: req.body.carbs,
                fat: req.body.fat,
                protein: req.body.protein,
                date: req.body.date,
                time:  req.body.time,
                user: null    
            }])
            .execute()
        res.status(201).send({status: 201, message: "Created"})
    })
    .put(async (req, res) => {
        console.log("got PUT on /log", req.body)
        res.setHeader("Content-Type", "application/json")
        // Check if any fields are missing
        const fields = ["id", "name", "amount", "calories", "carbs", "fat", "protein", "date", "time"]
        const column = checkFields(req.body, fields)
        if (column != null) {
            res.status(422).send({status: 422, message: "Request is missing " + column + " field"})
            return
        }
        const dateRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]{1}|[12][0-9]{1}|3[01]{1})$/
        const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
        // Check date format
        if(req.body.date.match(dateRegex) === null) {
            res.status(422).send({status: 422, message: "Date should be in YYYY-MM-DD format"})
            return
        }
        // Check time format
        if(req.body.time.match(timeRegex) == null){
            res.status(422).send({status: 422, message: "Time should be in HH:MM:SS format"})
            return
        }
        const validateUUID = testUUID(req.body.id);
        if(!validateUUID) {
            res.status(422).send({status: 422, message: "Invalid log id format"})
            return
        }
        const logUpdate = await createQueryBuilder()
            .update(Log)
            .set({
                name: req.body.name,
                amount: req.body.amount,
                calories: req.body.calories,
                carbs: req.body.carbs,
                fat: req.body.fat,
                protein: req.body.protein,
                date: req.body.date,
                time:  req.body.time,
                user: null   
            })
            .where("id = :id", {id: req.body.id})
            .execute()
        if(logUpdate.affected == 1)
            res.status(201).send({status: 201, message: "Updated"})
        else
            res.status(404).send({status: 404, message: "Not found"})
    })
    .delete(async (req, res) => {
        console.log("got DELETe on /log", req.query)
        res.setHeader("Content-Type", "application/json")
        const id = req.query.id
        if(id === undefined) {
            res.status(422).send({status: 422, message: "Missing id in the query parameters"})
            return
        }
        const validateUUID = testUUID(id);
        if(!validateUUID) {
            res.status(422).send({status: 422, message: "Invalid log id format"})
            return
        }
        const logDelete = await createQueryBuilder()
            .delete()
            .from(Log)
            .where("id = :id", {id: id})
            .execute()
        if(logDelete.affected == 1)
            res.status(200).send({status: 201, message: "Deleted"})
        else
            res.status(404).send({status: 404, message: "Not found"})
    })

app.get('/meals', async (req, res) => {
    console.log("got GET on /meals", req.query)
    res.setHeader("Content-Type", "application/json")
    // TODO get userId from JWT
    const userId = "44de85bb-7ddc-436a-a653-f139a45f1009"
    const name = req.query.name
    // There is no name parameter
    if(name === undefined) {
        res.status(422).send({status: 422, message: "Missing name in the query parameters"})
        return
    }
    const meals = await createQueryBuilder()
        .select("meal")
        .from(Meal, "meal")
        .where("meal.name like :name", { name: `%${name}%`})
        .andWhere(
            // Get public or user's meals
            new Brackets((qb) => {
                qb.where("meal.isPublic = true")
                .orWhere("meal.userId = :userId", { userId: userId})
            })
        )
        .getMany()
    res.status(200).send({status: 200, message: "OK", meals: meals})
})

app.get('/foods', async (req, res) => {
    console.log("got GET on /foods", req.query)
    res.setHeader("Content-Type", "application/json")
    // TODO get userId from JWT
    const userId = "44de85bb-7ddc-436a-a653-f139a45f1009"
    const name = req.query.name
    // There is no name parameter
    if(name === undefined) {
        res.status(422).send({status: 422, message: "Missing name in the query parameters"})
        return
    }
    const foods = await createQueryBuilder()
        .select("food")
        .from(Food, "food")
        .where("food.name like :name", { name: `%${name}%`})
        .andWhere(
            new Brackets((qb) => {
                // Get public or user's foods
                qb.where("food.isPublic = true")
                .orWhere("food.userId = :userId", { userId: userId})
            })
        )
        .getMany()
    res.status(200).send({status: 200, message: "OK", foods: foods})
})

app.post('/login', async (req, res) => {
    console.log("POST on /login", req.body)
    res.setHeader("Content-Type", "application/json")
    // Check if all fields are present
    if(!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("password")) {
        res.status(422).send({status: 422, message: "Email or password is missing"})
        return
    }
    // Find the email
    const user = await createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.email = :email", { email: req.body.email})
        .getOne()
    // Email was not found
    if(user === undefined) {
        res.status(404).send({status: 404, message: "User does not exist"})
        return 
    }
    // Compare the passwords
    bcrypt.compare(req.body.password, user.passwordHash, (err, result) => {
        if(err) {
            res.status(500).send({status: 500, message: "Error authenticating, please try again later"})
            return
        }
        if(result) {
            // Create JWT token
            const token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET)
            res.status(201).send({status: 201, message: "Authenticated", accessToken: token})
        } 
        else {
            res.status(401).send({status: 401, message: "Incorrect password"})
        }
    })
})

app.post('/register', async (req, res) => {
    console.log("got POST on /register", req.body)
    res.setHeader("Content-Type", "application/json")
    let error = ""
    // Check if all fields are present
    const fields = ["firstName", "lastName", "password", "passwordConfirm", "email", "weight", "height", "birthDate", "caloriesGoal"]
    const field = checkFields(req.body, fields)
    if(field != null) {
        res.status(422).send({status: 422, message: "Request is missing " + field + " field"})
        return
    }
    
    // Check field types and sizes
    for (const key in req.body){
        // String fields
        if((key === "firstName" || key === "lastName" || key === "password" || key === "passwordConfirm" || key === "birthDate")) {
            if(typeof req.body[key] !== "string") {
                error = "Field " + key + " has to be string"
                break
            }
            else if(req.body[key].length < 1) {
                error = "Field " + key + " can't be an empty string"
                break
            }
        }
        // Number fields
        else if((key === "weight" || key === "height" || key === "caloriesGoal")) {
            if (typeof req.body[key] !== "number") {
                error = "Field " + key + " has to be integer"
                break   
            }
            else if(req.body[key] < 0) {
                error = "Field " + key + " has to be positive"
                break
            }
        }
    }
    if(error !== "") {
        res.status(422).send({status: 422, message: error})
        return
    }
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // Allows any year and 31 days in each month
    const dateRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]{1}|[12][0-9]{1}|3[01]{1})$/
    // Check if email is valid
    if(req.body.email.match(emailRegex) === null) {
        error = "Email is not valid"
    }
    // Compare passwords
    if(req.body.password !== req.body.passwordConfirm && error === "") {
        error = "Passwords don't match"
    }
    // Check date format
    if(req.body.birthDate.match(dateRegex) === null && error === "") {
        error = "Field birthDate should be in YYYY-MM-DD format"
    }
    if(error !== "") {
        res.status(422).send({status: 422, message: error})
        return
    }
    // Check if email is already taken
    const user = await createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.email = :email", { email: req.body.email})
        .getManyAndCount()
    if(user[1] === 0) {
        // Insert user into database
        const passwordHash = bcrypt.hashSync(req.body.password, 10)
        await createQueryBuilder()
            .insert()
            .into(User)
            .values([{
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                passwordHash: passwordHash,
                email: req.body.email,
                weight: req.body.weight,
                height: req.body.height,
                birthDate: req.body.birthDate,
                caloriesGoal:  req.body.caloriesGoal,
                photo: ""
            }])
            .execute()
        res.status(201).send({status: 201, message: "Created"})
    }
    // Email is taken
    else {
        res.status(422).send({status: 422, message: "Email is already taken"})
    }
    
    
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

