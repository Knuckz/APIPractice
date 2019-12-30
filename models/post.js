exports.getPosts = {
    text: `SELECT * FROM post OFFSET $1 LIMIT $2`,
}

exports.addPost = {
    text: `INSERT INTO post 
            (title, image, content, creator, date_generated)
            VALUES ($1, $2, $3, $4, $5)`
}

exports.selectPost = {
    text: `SELECT * FROM post
            WHERE _id = $1`
}

exports.updatePost = {
    text: 'UPDATE post SET title = $2, image = $3, content = $4, creator = $5, date_generated = $6 WHERE _id = $1'
}

exports.deletePost = {
    text: `DELETE FROM post WHERE _id = $1`
}

exports.countPosts = {
    text: `SELECT COUNT(*) from post`
}

