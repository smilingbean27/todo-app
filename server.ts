import * as express from 'express';
import * as mongoose from 'mongoose';
import * as ejs from 'ejs';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import DATABASEURL from './env';

const app = express();
const port = 5000;

// Setting view Engine
app.set('view engine', 'ejs');
app.use(express.static('./partials'))

// Body Parser intial settings 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

// Method Override config
app.use(methodOverride('_method'));

// Connecting mongoose 
mongoose.connect( DATABASEURL,
 { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected')
});

// Mongoose Schema
const TodoSchema = new mongoose.Schema({
    item: String
})

// Creating Model out of Schema 
const Todo: mongoose.Model<mongoose.Document> = mongoose.model('Todo', TodoSchema)

const item = new Todo({item: 'Do laundry'});

// item.save((err, item)=> {
//     if (err) return console.log('Can not add this to Mongo shell collection')

//     console.log('Added to mongo shell')
// })
console.log(item);
app.get('/todo', (req, res)=> {
    Todo.find((err, todos)=> {
        if (err) console.log(err)
        else res.render('todos', {todos: todos })
    })
    
})

app.post('/todo/add', (req, res)=> {
    Todo.create(req.body, (err, todo)=> {
        if (err) console.log('Couldnot create')
        else {
            console.log(todo);
            res.redirect('/todo')
        }
    })
})

app.delete('/todo/remove/:id', (req, res)=>{
    const id = req.params.id;
    Todo.findByIdAndRemove(id, null, (err: any, deletedItem: {}): void =>{
        if (err){
            console.error(err)
        }else{
            console.log('deleted the item', deletedItem);
            res.redirect('/todo');
        }
    } )
})

app.get('/', (req, res)=> {
    res.redirect('/todo');
})


// Listening for client requests 
app.listen(port, ()=> {
    console.log(`Server listening at port:${port}`);
})