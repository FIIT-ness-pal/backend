require('dotenv').config()

import {Brackets, createConnection, createQueryBuilder, QueryBuilder} from "typeorm";
import * as bcrypt from "bcrypt";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as multer from "multer";

import { User } from "./entities/User";
import { Food } from "./entities/Food";
import { Meal } from "./entities/Meal";
import { Log } from "./entities/Log";

import { authenticateJWT, checkFields, checkFieldTypes, testUUID } from "./functions";

var app = express();
var port = 3000;

// Multer for image storage setup
var imageStorage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'src/images');
    },
    filename: function (req, _file, cb) {
        cb(null, req.user.id + '.png');
    }
});
var upload = multer({storage: imageStorage});


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

app.route('/userPhoto')
    .get(authenticateJWT, async (req, res) => {
        console.log("got GET on /userPhoto", req.query);
        //res.setHeader("Content-Type", "image/png");

        // Check if ID is missing in query parameters
        const id = req.query.userId;
        if(id === undefined) {
            res.status(422).send({status: 422, message: "Missing userId in the query parameters"});
            return;
        }
        // Check if ID is in valid format
        const validateUUID = testUUID(id);
        if(!validateUUID) {
            res.status(422).send({status: 422, message: "Invalid user id format"});
            return;
        }
        // Check if the user is requesting themselves
        if(!(req.user.id === id)) {
            res.status(401).send({status: "401", message: "Access denied"});
        }

        const user = await createQueryBuilder()
        .select("user.photo")
        .from(User, "user")
        .where("user.id = :id", {id: id})
        .getOne()

        if(user.photo == null) {   
            res.status(200).sendFile('images/avatar.png', {root: "./src"});
        }

        res.status(200).sendFile(user.photo, {root: "./src"});
    })
    .post(authenticateJWT, upload.single('avatar'), async (req, res) => {
        // upload.single('avatar') -> to avatar musi byt ako key v body v postmanovi alebo name vo formulari neskor !
        console.log("got POST on /userPhoto");
        console.log(req.file);
        res.setHeader("Content-Type", "application/json");

        await createQueryBuilder()
        .update(User)
        .set({photo: 'images/' + req.file.filename})
        .where("id = :id", {id: req.user.id})
        .execute()

        res.status(200).send({status: 200, message: "Photo uploaded"});
    });

app.route('/user')
    .put(authenticateJWT, async (req, res) => {
        console.log("got PUT on /user", req.body)
        res.setHeader("Content-Type", "application/json")
        // Check if any fields are missing
        const fields = ["id", "email", "firstName", "lastName", "weight", "height", "birthday", "caloriesGoal"]
        const field = checkFields(req.body, fields)
        if (field != null) {
            res.status(422).send({status: 422, message: "Request is missing " + field + " field"})
            return
        }
        let error = ""
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
            if(req.user.id === req.body.id) {
                await createQueryBuilder()
                .update(User)
                .set({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    weight: req.body.weight,
                    height: req.body.height,
                    birthDate: req.body.birthDate,
                    caloriesGoal:  req.body.caloriesGoal
                })
                .where("id = :id", {id: req.user.id})
                .execute()
                res.status(201).send({status: 201, message: "Created"})
            }
            else {
                res.status(401).send({status: 401, message: "Access denied"})
            }
        }
        // Email is taken
        else {
            res.status(422).send({status: 422, message: "Email is already taken"})
        }
    })
    .delete(authenticateJWT, async (req, res) => {
        console.log('got DELETE on /user', req.query)
        res.setHeader('Content-Type', 'application/json')
        // Check if ID is missing in query parameters
        const id = req.query.id
        if(id === undefined) {
            res.status(422).send({status: 422, message: "Missing id in the query parameters"})
            return
        }
        // Check if ID is in valid format
        const validateUUID = testUUID(id);
        if(!validateUUID) {
            res.status(422).send({status: 422, message: "Invalid user id format"})
            return
        }
        // Check if the user is deleting themselves
        if(req.user.id === id) {
            const userDelete = await createQueryBuilder()
            .delete()
            .from(User)
            .where("id = :id", {id: id})
            .execute()
            if(userDelete.affected == 1)
                res.status(200).send({status: 201, message: "Deleted"})
            else
                res.status(404).send({status: 404, message: "Not found"})
        }
        else {
            res.status(401).send({status: 401, message: "Access denied"})
        }
        
    })
    .get(authenticateJWT, async (req, res) => {
        console.log("got GET on /user", req.query)
        res.setHeader("Content-Type", "application/json")
        
        // Check if ID is missing in query parameters
        const id = req.query.userId
        if(id === undefined) {
            res.status(422).send({status: 422, message: "Missing userId in the query parameters"})
            return
        }
        // Check if ID is in valid format
        const validateUUID = testUUID(id);
        if(!validateUUID) {
            res.status(422).send({status: 422, message: "Invalid user id format"})
            return
        }

        // Check if the user is requesting themselves
        if(!(req.user.id === id)) {
            res.status(401).send({status: "401", message: "Access denied"});
        }


        const user = await createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.id = :id", {id: id})
        .getOne()

        if(user !== undefined) {
            delete user.photo;
            res.status(200).send({status: 200, message: user})
        } else {
            res.status(404).send({status: 404, message: "Not found"})
        }
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

        const properties = ['name', 'description', 'brand', 'calories', 'carbs', 'protein', 'fat', 'isPublic'];
        let error = "";
        
        let missingColumn = checkFields(req.body, properties);

        // Missing field
        if(missingColumn != null) {
            res.status(422).send({status: "422", message: "Missing field: " + missingColumn});
            return;
        } else {
            // Check field types and sizes
            for (const key in req.body){
                // String fields
                if(key === 'name' || key === 'description' || key === 'brand') {
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
                res.status(422).send({status: 422, message: error})
                return;
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
            user: req.user.id
        }])
        .execute()

        res.status(201).send({status: "201", message: "Food created"});
    })
    .put(authenticateJWT, async (req, res) => {
        console.log('got PUT on /food', req.query);
        res.setHeader("Content-Type", "application/json");

        const properties = ['id', 'name', 'description', 'brand', 'calories', 'carbs', 'protein', 'fat', 'isPublic'];
        let error = '';

        let missingColumn = checkFields(req.body, properties);

        // Missing field
        if(missingColumn != null) {
            res.status(422).send({status: "422", message: "Missing field: " + missingColumn});
            return;
        } else {
            let validateUUID = testUUID(req.body['id']);
            if (!validateUUID) {
                res.status(422).send({status: "422", message: "Invalid food id format"});
                return;
            }
            
            // Check field types and sizes
            for (const key in req.body){
                // String fields
                if(key === 'name' || key === 'description' || key === 'brand' || key === 'id') {
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
                res.status(422).send({status: 422, message: error})
            }
        }
        
        let food = await createQueryBuilder()
        .select("food")
        .from(Food, "food")
        .where("food.id = :id", {id: req.body['id']})
        .leftJoinAndSelect("food.user", "user.id")
        .getOne();

        // Food has no owner -> nobody can delete it
        if(food.user === null) {
            res.status(401).send({status: "401", message: "Access denied"});
            return;
        }

        // Check if the user created this food
        if(food.user.id === food.user.id) {
            await createQueryBuilder()
            .update(Food)
            .set({
                name: req.body.name,
                brand: req.body.brand,
                description: req.body.description,
                calories: req.body.calories,
                carbs: req.body.carbs,
                fat: req.body.fat,
                protein: req.body.protein,
                isPublic: req.body.isPublic,
            })
            .where("id = :id", {id: req.body['id']})
            .execute();

            res.status(200).send({status: "200", message: "Food updated"});
        } else {
            res.status(401).send({status: "401", message: "Access denied"});
        }
    })
    .delete(authenticateJWT, async (req, res) => {
        console.log('got DELETE on /food', req.query);
        res.setHeader('Content-Type', 'application/json');

        let foodId = req.query.id;

        if(!foodId) {
            res.status(422).send({status: "422", message: "Missing food id parameter"});
            return;
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

        // Food has no owner -> nobody can delete it
        if(food.user === null) {
            res.status(401).send({status: "401", message: "Access denied"});
            return;
        }

        // Check if the user created this food
        if(food.user.id === food.user.id) {
            await createQueryBuilder()
            .delete()
            .from(Food, "food")
            .where("food.id = :id", {id: foodId})
            .execute();

        res.status(200).send({status: "200", message: "OK"});
        } 
        else {
            res.status(401).send({status: "401", message: "Access denied"});
        }
    })

app.route('/log')
    .get(authenticateJWT, async (req, res) => {
        console.log("got GET on /log", req.query)
        res.setHeader("Content-Type", "application/json")
        // Check if query contains date parameter
        const date = req.query.date
        if(date === undefined) {
            res.status(422).send({status: 422, message: "Missing date in the query parameters"})
            return
        }
        // Check the date format
        const dateRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]{1}|[12][0-9]{1}|3[01]{1})$/
        if(date.match(dateRegex) === null) {
            res.status(422).send({status: 422, message: "Date should be in YYYY-MM-DD format"})
            return
        }
        // Get the logs from database
        const logs = await createQueryBuilder()
            .select("log")
            .where("log.date = :date", {date: `%${date}%`})
            .andWhere("log.userId = :id", {id: req.user.id})
            .from(Log, "log")
            .getMany()
        res.status(200).send({status: 200, message: "OK", logs: logs})
    })
    .post(authenticateJWT, async (req, res) => {
        console.log("got POST on /log", req.body)
        res.setHeader("Content-Type", "application/json")
        // Check if any fields are missing
        const fields = ["name", "amount", "calories", "carbs", "fat", "protein", "date", "time"]
        const field = checkFields(req.body, fields)
        if (field != null) {
            res.status(422).send({status: 422, message: "Request is missing " + field + " field"})
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
        // Check field types and sizes
        const result = checkFieldTypes(req.body, ["name", "date", "time"], ["amount", "calories", "carbs", "fat", "protein"])
        if(result != null) {
            res.status(422).send(result)
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
                user: req.user.id    
            }])
            .execute()
        res.status(201).send({status: 201, message: "Created"})
    })
    .put(authenticateJWT, async (req, res) => {
        console.log("got PUT on /log", req.body)
        res.setHeader("Content-Type", "application/json")
        // Check if any fields are missing
        const fields = ["id", "name", "amount", "calories", "carbs", "fat", "protein", "date", "time"]
        const column = checkFields(req.body, fields)
        if (column != null) {
            res.status(422).send({status: 422, message: "Request is missing " + column + " field"})
            return
        }
        const result = checkFieldTypes(req.body, ["id", "name", "date", "time"], ["amount", "calories", "carbs", "fat", "protein"])
        if(result != null) {
            res.status(422).send(result)
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
        // Validate UUID format
        const validateUUID = testUUID(req.body.id);
        if(!validateUUID) {
            res.status(422).send({status: 422, message: "Invalid log id format"})
            return
        }
        console.log(req.user.id)
        // Update the log
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
                user: req.user.id   
            })
            .where("id = :id", {id: req.body.id})
            .andWhere("user = :userId", {userId: req.user.id})
            .execute()
        // SUccesfully updated
        if(logUpdate.affected == 1)
            res.status(201).send({status: 201, message: "Updated"})
        // No log with that id
        else
            res.status(404).send({status: 404, message: "Not found"})
    })
    .delete(async (req, res) => {
        console.log("got DELETe on /log", req.query)
        res.setHeader("Content-Type", "application/json")
        // Check if any fields are missing
        const id = req.query.id
        if(id === undefined) {
            res.status(422).send({status: 422, message: "Missing id in the query parameters"})
            return
        }
        // Validate UUID format
        const validateUUID = testUUID(id);
        if(!validateUUID) {
            res.status(422).send({status: 422, message: "Invalid log id format"})
            return
        }
        // Delete the log
        const logDelete = await createQueryBuilder()
            .delete()
            .from(Log)
            .where("id = :id", {id: id})
            .andWhere("user = :userId", {userId: req.user.id})
            .execute()
        // Succesfully deleted
        if(logDelete.affected == 1)
            res.status(200).send({status: 201, message: "Deleted"})
        // No log with that id
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
                photo: "images/avatar.png"
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

