const express = require('express');

const router = express.Router();

const db = require('./postDb.js');

router.get('/', (req, res) => {
    db.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(500).json({ error: error, message: 'There was a server error while attempting to retrieve users' });
        });
});

router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
    db.remove(req.post.id)
        .then(post => {
            res.status(200).json(req.post);
        })
        .catch(error => {
            res.status(404).json({ error: error, message: 'post could not be deleted' });
        });
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
    const newPost = req.body;

    db.update(req.post.id, newPost)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json({ error: error, message: 'There was a server error while attempting to edit user' });
        });
});

// custom middleware

function validatePostId(req, res, next) {
    const id = req.params.id;

    db.getById(id)
        .then(post => {
            if (post) {
                req.post = post;
                next();
            } else {
                res.status(404).json({ message: 'The post ID is invalid' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error, message: 'There was a server error while attempting to retrieve post' });
        });
}

function validatePost(req, res, next) {
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        res.status(400).json({ message: 'missing user data' });
    }

    if (req.body.text) {
        next();
    } else {
        res.status(400).json({ message: 'missing required name field' });
    }
}

module.exports = router;
