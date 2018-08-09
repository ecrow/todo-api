require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const port = process.env.PORT;

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

app.delete('/todos/:id',(req,res)=>{
    const id = req.params.id;
    if (!ObjectID.isValid(id)){
        return res.status(404).send({message:'Not a valid id'});
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send({ message: 'Item not found' });
        }
        res.status(200).send(todo);
    },(err)=>{
        return res.status(500).send(err);
    })
    .catch((e)=>{
        res.status(500).send();
    });
});

app.patch('/todos/:id',(req, res)=>{
    const id = req.params.id;
    const body = _.pick(req.body, ['text','completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({ message: 'Not a valid id' });
    }
    if (_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }
    else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo)=>{
        if (!todo) {
            return res.status(404).send({ message: 'Item not found' });
        }
        res.status(200).send(todo);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
});


app.post('/users', (req, res)=>{
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    })
    .then((token)=>{
        res.header('x-auth', token).send(user)
    })
    .catch((err)=>{
        res.status(500).send(err);
    })
});

app.listen(port, ()=>{
    console.log(`API started on port ${port}`);
});

