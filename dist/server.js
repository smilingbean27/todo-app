"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const env_1 = require("./env");
const app = express();
const port = 5000;
// Setting view Engine
app.set('view engine', 'ejs');
app.use(express.static('./partials'));
// Body Parser intial settings 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Method Override config
app.use(methodOverride('_method'));
// Connecting mongoose 
mongoose.connect(env_1.default, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Mongoose is connected');
});
// Mongoose Schema
const TodoSchema = new mongoose.Schema({
    item: String
});
// Creating Model out of Schema 
const Todo = mongoose.model('Todo', TodoSchema);
const item = new Todo({ item: 'Do laundry' });
// item.save((err, item)=> {
//     if (err) return console.log('Can not add this to Mongo shell collection')
//     console.log('Added to mongo shell')
// })
console.log(item);
app.get('/todo', (req, res) => {
    Todo.find((err, todos) => {
        if (err)
            console.log(err);
        else
            res.render('todos', { todos: todos });
    });
});
app.post('/todo/add', (req, res) => {
    Todo.create(req.body, (err, todo) => {
        if (err)
            console.log('Couldnot create');
        else {
            console.log(todo);
            res.redirect('/todo');
        }
    });
});
app.delete('/todo/remove/:id', (req, res) => {
    const id = req.params.id;
    Todo.findByIdAndRemove(id, null, (err, deletedItem) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('deleted the item', deletedItem);
            res.redirect('/todo');
        }
    });
});
app.get('/', (req, res) => {
    res.redirect('/todo');
});
// Listening for client requests 
app.listen(port, () => {
    console.log(`Server listening at port:${port}`);
});
//# sourceMappingURL=server.js.map