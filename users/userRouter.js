const express = require('express');

const router = express.Router();

const db = require('./userDb.js');

router.post('/', validateUser, (req, res) => {
    const newUser = req.body;

    db.insert(newUser)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json({ error: error, message: 'There was a server error while attempting to add user' });
        });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const newPost = req.body;

    db.insert(newPost)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            res.status(500).json({ error: error, message: 'There was a server error while attempting to add post' });
        });
});

router.get('/', (req, res) => {
    db.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(500).json({ error: error, message: 'There was a server error while attempting to retrieve users' });
        });
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
    db.getUserPosts(req.user.id)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({ error: error, message: 'There was a server error while attempting to retrieve users' });
        });
});

router.delete('/:id', validateUserId, (req, res) => {
    db.remove(req.user.id)
        .then(user => {
            res.status(200).json(req.user);
        })
        .catch(error => {
            res.status(404).json({ error: error, message: 'User could not be deleted' });
        });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    const newUser = req.body;

    db.update(req.user.id, newUser)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json({ error: error, message: 'There was a server error while attempting to edit user' });
        });
});

//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id;

    db.getById(id)
        .then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).json({ message: 'The user ID is invalid' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error, message: 'There was a server error while attempting to retrieve users' });
        });
}

function validateUser(req, res, next) {
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        res.status(400).json({ message: 'missing user data' });
    }

    if (req.body.name) {
        next();
    } else {
        res.status(400).json({ message: 'missing required name field' });
    }
}

function validatePost(req, res, next) {
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        res.status(400).json({ message: 'missing post data' });
    }

    if (req.body.text) {
        next();
    } else {
        res.status(400).json({ message: 'missing required text field' });
    }
}

module.exports = router;
