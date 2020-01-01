const { validationResult } = require('express-validator')
const db = require('../db');
const queries = require('../models/post');

//GET - returns 200 (SUCCESS) status and returns the resulting javascript object
//gets posts from database course and table post via using the query method in db
//the method takes the text from modeles, no args, and in the call back function sets the result to the posts that are returned from the database
exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  //Gets the posts from post with offset $1 and LIMIT $2
  db.query(queries.getPosts.text, [(currentPage - 1) * perPage, perPage], (err, result) => {
    if (!!err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
    //success!
    if (!!result) {
      //Gets total rows in post table
      db.query(queries.countPosts.text, [], (err, countResult) => {
        if (!!err) {
          next(err);
        }
        if (countResult) {
          res.status(200).json({
            message: "All posts delivered",
            posts: [...result.rows],                //This is all of the posts being sent to the front end
            totalItems: countResult.rows[0].count   //This is the total amount of rows being sent to front end
          });
        }
      });
    }
  });
}


//POST - this post would get the title and content sent from the front end and throw them where they need to go in the database
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  //this block of code just checks for validation and if there are erros throws an error
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');  
    error.statusCode = 422;
    throw error;             
  }

  if (!req.file) {
    const error = new Error('No image proviced.');
    error.statusCode = 422;
    throw error;
  }
  //if no errors in server side validation we continue
  //Get title and content from front end request
  const image = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;
  //Do the addPost query which adds a new post to our database using
  //our query function and addPost query from models
  console.log(new Date())
  db.query(queries.addPost.text, [title, image, content, 'Austin', req.userId, new Date()], (err, result) => {
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
  });
};

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
  });
  //find post with this id in database, you will need to drop tables and readd with unique ids
  //handle errors
}

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  //this block of code just checks for validation and if there are erros throws an error
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');  
    error.statusCode = 422;
    throw error;             
  }

  //gets post id from url
  const postId = req.params.postId;
  //gets info from front end form
  const title = req.body.title;
  const content = req.body.content;
  let image = req.body.image;

  if (req.file) {
    image = req.file.path.replace("\\", "/");
  }
  if (!image) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }

  //The tutorial also gets the data here because of mongoose and is able to aquire the data for the 
  //post we are deleteing. I'm not going to worry about getting the data as well here, and would leave
  /*
  if (!image) {
    clearImage(image);
  }
  */

  console.log('here');
  db.query(queries.updatePost.text, [postId, title, image, content, 'Austin', new Date()], (err, result) => {
    if (!!err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
    //success!
    console.log(result.rows);
    res.status(200).json({
      message: "All posts delivered",
      posts: [...result.rows]
    });
  });
}

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  db.query(queries.deletePost.text, [postId], (err, result) => {
    if (!result) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (!!err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
    console.log(result);
    res.status(200).json({
      message: "DELETED post"
    });
  });
}

//This is just an example from the tutorial using mongodb and mongo.ose
  /*
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      //cheack logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Deleted post.'
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
    */
//This isn't needed with my implementation
const fs = require('fs');

const path = require('path');

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
}
