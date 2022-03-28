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
            res.status(403).send({status: 403, message: 'Access denied. Invalid token.'});
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
