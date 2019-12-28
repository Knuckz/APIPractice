const { validationResult } = require('express-validator/check')

//GET - returns 200 (SUCCESS) status and returns the resulting javascript object
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/duck.jpg',
        creator: {
          name: 'Austin'
        },
        createdAt: new Date()
      }
    ]
  });
};


//POST - this post would get the title and content sent from the front end and throw them where they need to go in the database
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: 'Validation failed, entered data is incorrect.', 
        errors: errors.array()
      })
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db with title and content
  // Sends the javascript object back to front-end user
  res.status(201).json({
    message: 'Post created successfully!',
    post: { 
      id: new Date().toISOString(), 
      title: title, 
      content: content,
      creator: { name: 'Maximilian' },
      createdAt: new Date()
    }
  });
};
