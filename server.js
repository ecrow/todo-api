const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');

const port = process.env.PORT || 3000;

const app = express();

app.use(morgan());
app.use(bodyParser.json());

app.post('/todos',(req, res)=>{
    const todo = new Todo({
        text: req.body.text
    })
    todo.save().then((savedTodo)=>{
        res.status(201).send(savedTodo);
    },(err)=>{
        res.status(500).send(err);
    });
});

app.get('/todos', (req,res)=>{
    Todo.find().then((todos)=>{
        res.status(200).send({ todos });
    },(err)=>{
        res.status(404).send(e);
    })
});

app.get('/todos/:id',(req, res)=>{
    const id = req.params.id;
    Todo.findById(id).then((todo)=>{
        res.status(200).send(todo);
    },(err)=>{
        res.status(404).send(err);
    })
});

app.listen(port, ()=>{
    console.log(`API started on port ${port}`);
});

