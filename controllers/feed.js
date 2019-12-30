const { validationResult } = require('express-validator')
const db = require('../db');
const queries = require('../models/post');

//GET - returns 200 (SUCCESS) status and returns the resulting javascript object
//gets posts from database course and table post via using the query method in db
//the method takes the text from modeles, no args, and in the call back function sets the result to the posts that are returned from the database
exports.getPosts = (req, res, next) => {
  db.query(queries.getPosts.text, [], (err, result) => {
    if (!!err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
    //success!
    res.status(200).json({
      message: "All posts delivered",
      posts: [...result.rows]
    })
  });
};


//POST - this post would get the title and content sent from the front end and throw them where they need to go in the database
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  //this block of code just checks for validation and if there are erros throws an error
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');  
    error.statusCode = 422;
    throw error;             
  }
  //if no errors in server side validation we continue
  //Get title and content from front end request
  const title = req.body.title;
  const content = req.body.content;
  //Do the addPost query which adds a new post to our database using
  //our query function and addPost query from models
  db.query(queries.addPost.text, [title, './images/duck.jpg', content, 'Austin', new Date()], (err, result) => {
    if (!!err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      //Since we are using callbacks I think we could just throw() here, but this will work as well, and is designed for async code
      next(err);
    }
    if (!!result) {
      res.status(201).json({
        message: 'Post created successfully!',
        post: { 
          id: new Date().toISOString(), //no implemented in database the id that is
          title: title, 
          content: content,
          creator: { name: 'Austin' },
          createdAt: new Date()
        }
      });
    }
  })
};

exports.testing = (req, res, next) => {
   db.query('SELECT NOW()', [], (err, exp) => {
     let result = exp.rows[0].now;
     res.status(200).json({
      message: result
    })
    })

}

//get a specific post - TODO
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  db.query(queries.selectPost.text, [postId], (err, result) => {
    if (!!result) {
      post = result.rows[0];
      res.status(200).json({
        message: "got the post",
        post
      });
    }

    if (!!err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  })
  //find post with this id in database, you will need to drop tables and readd with unique ids
  //handle errors
}
