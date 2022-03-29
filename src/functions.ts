import * as jwt from "jsonwebtoken"
require('dotenv').config()

// Validate UUID string
export function testUUID (uuid: string): boolean {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(uuid);
}

// Authenticate JWT
export function authenticateJWT(req, res, next): any {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send({status: 401, message: 'Access denied. No token provided.'});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedUser) => {
        if (error) {
            res.status(401).send({status: 401, message: 'Access denied. Invalid token.'});
            return;
        } else {
            req.user = decodedUser;
            next();
            return;
        }
    })
}

export function checkFields(body, fields): string {
    let missingColumn = null
    fields.forEach(f => {
        if(!body.hasOwnProperty(f)) {
            missingColumn = f 
            return false
        }
        return true
    })
    return missingColumn
}

export function checkFieldTypes(body, stringFields, numberFields): object {
    // Check field types and sizes
    for (const key in body){
        // String fields
        if(stringFields.includes(key)) {
            if(typeof body[key] !== "string") {
                return {status: 422, message: `Field ${key} must be a string`}
            }
            else if((body[key].length < 1) && (key != 'description') && (key != 'brand')) {
                return {status: 422, message: `Field ${key} must be at least 1 character long`}
            }
        }
        // Number fields
        if(numberFields.includes(key)) {
            if(typeof body[key] !== "number") {
                return {status: 422, message: `Field ${key} must be a number`}
            }
            else if(body[key] < 0) {
                return {status: 422, message: `Field ${key} must be positive`}
            }
        }
    }
    return null
}