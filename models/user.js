/*
columns - email - string - required, password - string - required, name - string - required, status - string - required
posts [refrences posts]
*/

exports.addUser = {
    text: `INSERT INTO enduser 
            (email, password, username, status)
            VALUES ($1, $2, $3, 'My name is $3')`
}

exports.checkEmail = {
    text: `SELECT * FROM enduser
            WHERE email = $1`
}

