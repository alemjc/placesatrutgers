/**
 * Created by alemjc on 2/22/16.
 */
var Sequelize = require("sequelize");
var express = require("express");
var expressHandlebars = require("express-handlebars");
var PORT = process.env.NODE_ENV || 9001;

var app = express();

app.get("/", function(req, res) {
  res.render("home");
});

app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");

app.use("/static", express.static("public"));

var sequelize = new Sequelize(process.env.DATABASE_URL);

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


 sequelize.sync().then(function(){


 }).catch(function(err){

 });


app.listen(PORT, function() {
  console.log("LISTENING ON %s", PORT);
});


