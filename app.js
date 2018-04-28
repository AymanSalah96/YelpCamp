var express        = require("express"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    app            = express();

// requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

const PORT = 3000;

// connecting to the DB
mongoose.connect("mongodb://localhost/yelp_camp");

//require moment
app.locals.moment = require('moment');

// body-parser config
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Mohamed Salah is the best player in the world!!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//pass in path to view
app.use(function(req, res, next) {
  res.locals.current_path = req.path;
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, function() {
  console.log("YelpCamp server is listening to port " + PORT);
});
