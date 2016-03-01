/**
 * Created by alemjc on 2/22/16.
 */
var Sequelize = require("sequelize");
var express = require("express");
var expressHandlebars = require("express-handlebars");
var expresssession = require('express-session');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require('connect-flash');
var bcrypt = require("bcryptjs");
var bodyparser = require("body-parser");
var SequelizeStore = require('connect-session-sequelize')(expresssession.Store);
var PORT = process.env.PORT || 9001;

var app = express();

app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");

app.use("/static", express.static("public"));
app.use(bodyparser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function(user, done){
  done(null,{userName:user.userName});
});


passport.deserializeUser(function(user, done){
  done(null, {userName:user.userName});
});

passport.use(new LocalStrategy({
    usernameField:'userName',
    passwordField:'password',
    session:true,
    passReqToCallback: true
  },
  function(req, userName, password, done){
    Users
      .findOne({where: {userName:userName}})
      .then(function(user){
        if(user){
          bcrypt.compare(password, user.dataValues.password, function(err, success){

            if(success){
              req.flash('msg',undefined);
              done(null,{userName:userName});
            }
            else{
              req.flash('msg',"Invalid user name or password.");
              done(null,false, {message: "Invalid user name or password."});
            }

          });
        }
        else{
          req.flash('msg',"Invalid user name or password.");
          done(null,false, {message: "Invalid user name or password."});
        }

      })
      .catch(function(err){
        done(err);
      });
  }));


if(process.env.NODE_ENV === 'production') {
  // FOR HEROKU DEPLOY

} 
else {
  // FOR TESTING LOCALLY
  require("dotenv").config({path:"./DBCreds.env"});
}

var sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

app.use(expresssession({secret:process.env.SECRET, resave:true, saveUninitialized:true,
  store: new SequelizeStore({
    db: sequelize
  })
}));

var Places = sequelize.define("place", {
  name: {
  type:Sequelize.STRING,
   allowNull:false
  },
  address:{
   type:Sequelize.STRING,
   allowNull:false
  },
  pictures:{
   type:Sequelize.STRING
  },
  name: {
  type:Sequelize.STRING,
   allowNull:false
  },
  address:{
   type:Sequelize.STRING,
   allowNull:false
  },
  pictures:{
   type:Sequelize.STRING
  },
  hours:{
   type:Sequelize.STRING
  },
  category:{
   type:Sequelize.STRING,
   allowNull:false
  }
});

var Users = sequelize.define("user",{
  firstName:{
   type:Sequelize.STRING,
   allowNull:false
  },
  lastName:{
   type:Sequelize.STRING,
   allowNull:false
  },
  userName:{
   type:Sequelize.STRING,
   allowNull:false,
   validate:{
     len:[5,20]
    }
  },
 password: {
   type: Sequelize.STRING,
   allowNull: false,
   validate: {
     len: [5, 2000]
   }
 },
 birthday: {
 type: Sequelize.STRING
  }
},
  {
  hooks:{
    beforeCreate: function(input){
      input.password = bcrypt.hashSync(input.password,10);
      }
    }
  }
);

var Ratings = sequelize.define("rating",{
  stars: {
    type:Sequelize.INTEGER,
    validate: {
      max: 5
    }
  },
  comment:{
    type:Sequelize.STRING
  }
});

Users.belongsToMany(Places,{through:Ratings});
Places.belongsToMany(Users,{through:Ratings});

//routes
app.get("/", function (req, res) {
  Places.findAll().then(function(place) {
    res.render('home', {
      place: place
    })
  });
});

app.get("/food", function (req, res) {
  Places.findAll({where: 
    {category: "food"}
  }).then(function(place) {
    res.render('food', {
      place: place
    })
  });
});

app.get("/entertainment", function (req, res) {
  Places.findAll({where: 
    {category: "entertainment"}
  }).then(function(place) {
    res.render('entertainment', {
      place: place
    })
  });
});

app.get("/shopping", function (req, res) {
  Places.findAll({where: 
    {category: "shopping"}
  }).then(function(place) {
    res.render('shopping', {
      place: place
    })
  });
});
//end routes

app.get("/register", function(req, res) {
  res.render("register", req.query);
});

app.get("/login", function(req, res) {
  console.log("***********************");

  res.render("login",{msg:req.flash("msg")});
});

app.post("/login", passport.authenticate('local',{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true
  }
));

app.post("/register", function(req, res){
  console.log(req.body);

  if(req.body.userName.length < 5 || req.body.password.length < 5){
    res.redirect("/register?msg=User name password must be longer than 5 characters.");
    return;
  }

  if(req.body.first_name.length === 0 || req.body.last_name.length === 0 || req.body.birthday.length === 0){
    res.redirect("/register?msg=Please fill out all fields.");
    return;
  }

  Users
    .create({userName:req.body.userName, firstName:req.body.first_name, lastName:req.body.last_name,
    password: req.body.password, birthday:req.body.birthday})
    .then(function(){
      res.redirect("/login");
    })
    .catch(function(err){
      console.log("error is: ");
      console.log(err);
      if(err){
        console.log(err);
        res.redirect("/register?msg=Please fill out all fields.");
      }
    });
});



sequelize.sync().then(function(){
  app.listen(PORT, function() {
   console.log("LISTENING ON %s", PORT);
  });
}).catch(function(err){
  console.log("could not sync to db because of following error");
  console.log(err);
});