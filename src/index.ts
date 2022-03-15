import {createConnection} from "typeorm";
import * as express from "express";

var app = express();
var port = 3000;

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

app.post('/register', (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

