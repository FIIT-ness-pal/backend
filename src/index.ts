import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import * as express from "express";

var app = express();
var port = 3000;


createConnection().then(async connection => {

    /*
    let user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.userName = "timber";
    user.passwordHash = "123";
    user.email = "dasda";
    user.weight = 123.1;
    user.height = 123.1;
    user.birthDate = new Date();
    user.calorieGoal = 123;
    user.photoUrl = "dasdas";

    await connection.manager.save(user);
    */

}).catch(error => console.log(error));

app.get('/', (_req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

