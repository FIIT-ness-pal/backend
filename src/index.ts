import {createConnection, createQueryBuilder} from "typeorm";
import * as bcrypt from "bcrypt"
import * as express from "express";
import { User } from "./entities/User";
import { request } from "http";

var app = express();
var port = 3000;

app.use(express.json())

const dbConnect = async () => {
    try {
        await createConnection();
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
    .get((req, res) => {

    })
    .post((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {
        
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

app.get('/meals', (req, res) => {

})

app.get('/foods', (req, res) => {
    
})

app.post('/login', (req, res) => {

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
                const user = await createQueryBuilder(
                    "user"
                )
                .select("user")
                .from(User, "user")
                .where("user.email = :email", { email: req.body.email})
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

