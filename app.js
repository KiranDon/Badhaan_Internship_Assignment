const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const ejs = require("ejs");
require('dotenv').config()
console.log(process.env.DATABASE)

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(`${process.env.DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection successfull....");
  })
  .catch((err) => {
    console.log(err);
});

app.get("/", (req, res)=>{
    res.sendFile("index.html");
});

app.get("/profile", (req, res)=>{
  if(req.isAuthenticated()){
    let user = req.user;
    res.render("profile", {user});
  }else{
    res.render("notLoggedIn")
  }
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/myProfile", function (req, res) {
  console.log(req.user);
  if(req.isAuthenticated()){
    let currentUser = `${req.user._id}`.split('"')[0];
    console.log(currentUser);

    User.findOne({_id:currentUser}, function(err, user){
        if(err){
          console.log("Something is wrong...");
          console.log(err)
        }else{
            console.log("Current user is : ");
            console.log(user);
          res.render("myProfile", {user});
        
        }
      });

  }else{
      res.redirect("/");
  }
});

//login user
app.post("/login", function (req, res) {

  let mail = req.body.username;

  let present = User.findOne({username: mail});
  console.log(present)

  if(!present){
    //not able to handle :-(
  }else{
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log("Login Failed....");
            console.log(err);
            return res.redirect("/");
        }else{
            passport.authenticate("local")(req, res, function(){
                if(!req.user){
                  res.send("Lollllllll")
                }
                console.log("Login Success...");
                res.redirect("/profile");
            });
        }
    })
  }
});

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  mobile: String,
  location: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.post("/register", function(req, res) {
    console.log(req.body);
    const user = new User({
      username: req.body.username,
      fullName: req.body.fullName,
      mobile: req.body.mobile,
      location: req.body.place,
    });

    User.register(user, req.body.password, function(err, user){
      if(err){
          console.log(err);
          res.redirect("/errorWhileRegistering");
      }else{
          passport.authenticate("local")(req, res, function(){
              res.redirect("/profile");
          });
      }
  })
}
);


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.post("/edit", (req, res)=>{
  console.log("Inside edit route");
  console.log(req.body);
  let currentUser = `${req.user._id}`.split('"')[0];
  console.log(currentUser);

  try{
    User.updateOne({_id: currentUser}, {$set:{fullName: req.body.fullName, mobile: req.body.mobile, location: req.body.location}}, function(err){
      if(!err){
        console.log('Profile updated...');
        res.redirect("/myProfile")
      }else{
        console.log('Failed to update profile...');
      }
    });
  }catch(e){
    console.log(e);
  }
});

app.get("/forgot", (req, res)=>{
  res.render("forgotPassword");
})

app.post('/changepassword', async function(req, res) {

  let currentUser = req.body.email;
  let newPassword = req.body.password;

  const sanitizedUser = await User.findByUsername(currentUser);

  try {
    await sanitizedUser.setPassword(newPassword);
    await sanitizedUser.save();
    res.status(200).json({ message: 'Successful!' });
  } 
  catch (err) {
    res.status(422).send(err);
  }
});

app.listen(process.env.PORT || 4444, ()=>{
    console.log("Server started at http://localhost:4444");
});