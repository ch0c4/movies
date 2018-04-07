"use strict"

var express = require('express');
var router = express.Router();

var movies = require('./../controllers/movieController');

router.get('/', (req, res) => {
    movies.fetchAll().then((data) => {
        res.status(200).json(data);
    }, (err) => {
        res.status(500).json({message: 'ko'});
    });
});

router.get('/:id(\\d+)', (req, res) => {
    movies.fetchById(req.params.id).then((data) => {
        res.status(200).json(data);
    }, (err) => {
        res.status(500).json({message: 'ko'});
    });
});

router.post('/', (req, res) => {
    movies.createMovie(req.body).then((data) => {
        res.status(200).json(data);
    }, (err) => {
        res.status(500).json({message: 'ko'});
    });
});

router.put('/:id(\\d+)', (req, res) => {
    movies.updateMovie(req.params.id, req.body).then((data) => {
        res.status(200).json(data);
    }, (err) => {
        res.status(500).json({message: 'ko'});
    });
});

router.delete('/:id(\\d+)', (req, res) => {
    movies.deleteMovie(req.params.id).then((data) => {
        res.status(200).json(data);
    }, (err) => {
        res.status(500).json({message: 'ko'});
    });
});

module.exports = router;