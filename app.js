const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRouters');
const cookieParser = require('cookie-parser');
const res = require('express/lib/response');
const { requireAuth, checkUser, userID } = require('./middleware/authMiddleware');
const User = require('./models/Users');
const Task = require('./models/Tasks');
const { findById } = require('./models/Users');

//TASK
const date = require(__dirname + "/helper_functions/date.js");
const bodyParser = require("body-parser");
const Work = require('./models/Tasks');


const app = express();
const port = process.env.PORT || 8000;
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURL = 'mongodb+srv://admin:admin@cluster0.3diu6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true})
   .then((result) => app.listen(port))
   .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('index'));
app.get('/signin', (req, res) => res.render('signin'));
app.get('/signup', (req,res) => res.render('signup'));
app.get('/course', requireAuth, (req,res) => res.render('course'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/dashboardC', (req, res) => res.render('dashboardC'));
app.get('/task',(req, res) => res.render('list'));
app.use(authRoutes);

app.get('/github', (req, res) => res.redirect('https://github.com/krishpatel023/Einstein_Inc'));

//Tasks

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const today = date.getDate();

app.route("/list")
  .get((req, res) => {
    res.redirect("/work");
  });

app.route("/:itemCategory")
  .get((req, res) => {
    const category = req.params.itemCategory;

    if ( category === "work") {
      const etc = Work.find((err, foundItems) => {
        res.render("list", {
          itemsList: foundItems,
          day: today,
          category: category
        });
      })
    }
    
  })

  .post((req, res) => {
    const category = req.params.itemCategory;

    if (category === "work") {
      const newItem = new Work({
        name: req.body.newItem,
        checklist: false
      })

      newItem.save((err, item) => {
        if (!err) { console.log("Successfully posted " + item.name + "!");}
          else { console.error(err);}
      })

      res.redirect("/work");
    } 
    
  });

app.route("/delete/:itemCategory")

  .post((req, res) => {
    const checkedItemID = req.body.checkbox;
    const itemCategory = req.params.itemCategory;

    if (itemCategory === "work") {
      Work.findByIdAndDelete(checkedItemID, (err, item) => {
        if (!err) { console.log("Successfully deleted \"" + item.name + "\"!");}
      })
    } 
   

    res.redirect("/" + itemCategory);

  });
