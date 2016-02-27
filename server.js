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
var SequelizeStore = require('connect-session-sequelize')(expresssession.Store);
var PORT = process.env.PORT || 9001;

var app = express();

app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");

app.use("/static", express.static("public"));
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
    session:false
  },
  function(userName, password, done){
    Users
      .findOne({where: {userName:userName}})
      .then(function(user){
        if(user){
          bcrypt.compare(password, user.dataValues.password, function(err, success){

            if(success){
              done(null,{userName:userName});
            }
            else{
              done(null,false, {message: "Invalid user name or password."});
            }

          });
        }
        else{
          done(null,false, {message: "Invalid user name or password."});
        }

      })
      .catch(function(err){
        done(err);
      });
  }));


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
  })}));

var Places = sequelize.define("place", {
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

   password:{
     type:Sequelize.STRING,
     allowNull:false,
     validate:{
       len:[5,2000]
     }
   },

   birthday:{
     type:Sequelize.STRING
   }
 });

 var Ratings = sequelize.define("rating",{
   comment:{
     type:Sequelize.STRING
   }

 });

 Users.belongsToMany(Places,{through:Ratings});
 Places.belongsToMany(Users,{through:Ratings});

  //routes
  app.get("/", function(req, res) {
    res.render("home");
  });

  app.get("/register", function(req, res) {
    res.render("register");
  });

  app.get("/login", function(req, res) {
    var errors = req.flash();

    console.log(errors);
    res.render("login");
  });

  app.post("/login", passport.authenticate('local',{
      successRedirect:"/home",
      failureRedirect:"/",
      failureFlash:true
    }
  ));


 sequelize.sync().then(function(){
   app.listen(PORT, function() {
     console.log("LISTENING ON %s", PORT);
   });

 }).catch(function(err){
    console.log("could not sync to db because of following error");
    console.log(err);

 });