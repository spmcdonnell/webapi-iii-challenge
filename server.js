const express = require('express');

const server = express();

const usersRouter = require('./users/userRouter');
const postsRouter = require('./posts/postRouter');

//custom middleware
server.use(express.json());
server.use('/users', usersRouter);
server.use('/posts', postsRouter);

function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}`);

    next();
}

function validateUserId() {}

function validateUser() {}

function validatePost() {}

//requests

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
