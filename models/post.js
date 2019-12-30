exports.getPosts = {
    text: `SELECT * FROM post`,
}

exports.addPost = {
    text: `INSERT INTO post 
            (title, image, content, creator, timestamp)
            VALUES ($1, $2, $3, $4, $5)`
}

exports.selectPost = {
    text: `SELECT * FROM post
            WHERE _id = $1`
}

