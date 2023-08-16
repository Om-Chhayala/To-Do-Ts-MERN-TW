"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var index_1 = require("../middleware/index");
var db_1 = require("../db");
var router = express_1.default.Router();
router.post('/todos', index_1.authenticateJwt, function (req, res) {
    var _a = req.body, title = _a.title, description = _a.description;
    var done = false;
    var userId = req.headers["userId"];
    var newTodo = new db_1.Todo({ title: title, description: description, done: done, userId: userId });
    newTodo.save()
        .then(function (savedTodo) {
        res.status(201).json(savedTodo);
    })
        .catch(function (err) {
        res.status(500).json({ error: 'Failed to create a new todo' });
    });
});
router.get('/todos', index_1.authenticateJwt, function (req, res) {
    var userId = req.headers["userId"];
    db_1.Todo.find({ userId: userId })
        .then(function (todos) {
        res.json(todos);
    })
        .catch(function (err) {
        res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});
router.patch('/todos/:todoId/done', index_1.authenticateJwt, function (req, res) {
    var todoId = req.params.todoId;
    var userId = req.headers["userId"];
    db_1.Todo.findOneAndUpdate({ _id: todoId, userId: userId }, { done: true }, { new: true })
        .then(function (updatedTodo) {
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(updatedTodo);
    })
        .catch(function (err) {
        res.status(500).json({ error: 'Failed to update todo' });
    });
});
exports.default = router;
