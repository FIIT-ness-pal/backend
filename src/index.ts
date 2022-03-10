import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import * as express from "express";

var app = express();
var port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

/*
createConnection().then(async connection => {

    console.log("Ahoj");

}).catch(error => console.log(error));*/
