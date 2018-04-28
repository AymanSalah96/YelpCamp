var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function(err, campgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: campgrounds});
    }
  });
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
  // Create a new campground and save to the DB
  Campground.create(
    {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
      author: {
        id: req.user._id,
        username: req.user.username
      }
    }, function(err, campground) {
      if(err) {
        console.log(err);
      } else {
        // redirect back to campgrounds page
        res.redirect("/campgrounds");
      }
    }
  );
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
  // find the campground with the provided ID
  // render show template with that campground
  Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
    if(err) {
      console.log(err);
    } else {
      // render show template with that campground
      res.render("campgrounds/show", {campground: campground});
    }
  });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    res.render("campgrounds/edit", {campground: campground});
  });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + campground._id);
    }
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
