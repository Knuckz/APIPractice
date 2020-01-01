const express = require('express');
const { body } = require('express-validator');    //This is used for validation. /post for an example

const feedController = require('../controllers/feed');  //requires the feed controller where route logic is performed

const router = express.Router();                        //requires the express router which is used to get routes below
const isAuth = require('../middleware/is-auth');

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// POST /feed/post
router.post(
    '/post',                        //route /post
    [
        body('title')               //This body looks at the incoming data from the post request of key value title
            .trim()                 //trims the white space off front and back
            .isLength({min: 5}),    //gives a minimum length of 5 chars.
        body('content')
            .trim()
            .isLength({min: 5})
    ],
    isAuth,
    feedController.createPost
);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put(
    '/post/:postId',                        //route /put
    [
        body('title')               //This body looks at the incoming data from the post request of key value title
            .trim()                 //trims the white space off front and back
            .isLength({min: 5}),    //gives a minimum length of 5 chars.
        body('content')
            .trim()
            .isLength({min: 5})
    ],
    isAuth,
    feedController.updatePost
);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;                                //exporting the router for use in other files. Mostly app.js.