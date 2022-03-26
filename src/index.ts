require('dotenv').config()

import {Brackets, createConnection, createQueryBuilder} from "typeorm";
import * as bcrypt from "bcrypt";
import * as express from "express";
import * as jwt from "jsonwebtoken"
import { User } from "./entities/User";
import { Food } from "./entities/Food";
import { Meal } from "./entities/Meal";

import { authenticateJWT, testUUID } from "./functions";

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
    res.send('Hello World!');
});

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
    .get(async (req, res) => {
        // treba kontrolovat aj isPublic?
        console.log('got GET on /food', req.query);
        res.setHeader('Content-Type', 'application/json');

        let foodId = req.query.id;

        if (!foodId) {
            res.status(422).send({status: "422", message: "Missing food id parameter"});
        } else {
            // validate food id format
            let validateUUID = testUUID(foodId);
            if (!validateUUID) {
                res.status(422).send({status: "422", message: "Invalid food id format"});
                return;
            }
            
            let food = await createQueryBuilder()
            .select("food")
            .from(Food, "food")
            .where("food.id = :id", {id: foodId})
            .getOne();

            res.status(200).send({status: "200", message: "OK", food: food});
        }
    })
    .post((req, res) => {

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
            res.status(403).send({status: 403, message: "Access denied"});
        }
    })

app.route('/log')
    .get((req, res) => {

    })
    .post((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {
        
    })

app.get('/meals', async (req, res) => {
    console.log("got GET on /meals", req.query)
    res.setHeader("Content-Type", "application/json")
    // TODO get userId from JWT
    const userId = "44de85bb-7ddc-436a-a653-f139a45f1009"
    const name = req.query.name
    // There is no name parameter
    if(name === undefined) {
        res.status(422)
        res.send({"status": 422, "message": "Missing name in the query parameters"})
    }
    else {
        const meals = await createQueryBuilder()
        .select("meals")
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
        res.status(200)
        res.send({"status": 200, "message": "OK", "meals": meals})
    }
})

app.get('/foods', async (req, res) => {
    console.log("got GET on /foods", req.query)
    res.setHeader("Content-Type", "application/json")
    // TODO get userId from JWT
    const userId = "44de85bb-7ddc-436a-a653-f139a45f1009"
    const name = req.query.name
    // There is no name parameter
    if(name === undefined) {
        res.status(422)
        res.send({"status": 422, "message": "Missing name in the query parameters"})
    }
    else {
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
        res.status(200)
        res.send({"status": 200, "message": "OK", "foods": foods})
    }
})

app.post('/login', async (req, res) => {
    console.log("POST on /login", req.body)
    res.setHeader("Content-Type", "application/json")
    // Check if all fields are present
    if(!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("password")) {
        res.status(422)
        res.send({"status": 422, "message": "Email or password is missing"})
    }
    else {
        // Find the email
        const user = await createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.email = :email", { email: req.body.email})
        .getOne()
        // Email was not found
        if(user === undefined) {
            res.status(404)
            res.send({"status": 404, "message": "User does not exist"})
        }
        else {
            // Compare the passwords
            bcrypt.compare(req.body.password, user.passwordHash, (err, result) => {
                if(err) {
                    res.status(500)
                    res.send({"status": 500, "message": "Error authenticating, please try again later"})
                }
                else {
                    if(result) {
                        // Create JWT token
                        const token = jwt.sign({"id": user.id}, process.env.ACCESS_TOKEN_SECRET)
                        res.status(201)
                        res.send({"status": 201, "message": "Authenticated", "accessToken": token})
                    }
                    else {
                        res.status(401)
                        res.send({"status": 401, "message": "Incorrect password"})
                    }
                }
            })
        }
    }
})

app.post('/register', async (req, res) => {
    console.log("got POST on /register", req.body)
    res.setHeader("Content-Type", "application/json")
    // Check if all fields are present
    const properties = ["firstName", "lastName", "password", "passwordConfirm", "email", "weight", "height", "birthDate", "caloriesGoal"]
    let error = ""
    properties.every(p => {
        if(!req.body.hasOwnProperty(p) || p.length < 2) {
            error = "Request missing " + p + " field" 
            return false
        }
        return true
    })
    // One or more fields missing
    if(error != "") {
        res.status(422)
        res.send(JSON.stringify({"status": 422, "message": error}))
    }
    else {
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
            res.status(422)
            res.send(JSON.stringify({"status": 422, "message": error}))
        }
        else {
            // Email regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            // Allows any year and 31 days in each month
            const birthDateRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]{1}|[12][0-9]{1}|3[01]{1})$/
            // Check if email is valid
            if(req.body.email.match(emailRegex) === null) {
                error = "Email is not valid"
            }
            // Compare passwords
            if(req.body.password !== req.body.passwordConfirm && error === "") {
                error = "Passwords don't match"
            }
            // Check date format
            if(req.body.birthDate.match(birthDateRegex) === null && error === "") {
                error = "Field birthDate should be in YYYY-MM-DD format"
            }
            if(error !== "") {
                res.status(422)
                res.send(JSON.stringify({"status": 422, "message": error}))
            }
            else {
                // Check if email is already taken
                const user = await createQueryBuilder()
                .select("user")
                .from(User, "user")
                .where("user.email = :email", { email: `%${req.body.email}%`})
                .getOne()
                if(user === undefined) {
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
                    res.status(201)
                    res.send(JSON.stringify({"status": 201, "message": "Created"}))
                }
                // Email is taken
                else {
                    res.status(422)
                    res.send(JSON.stringify({"status": 422, "message": "Email is already taken"}))
                }
            }
        }
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

