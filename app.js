const express = require("express");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync.js");
const path = require("path");
const { campgroundSchema,reviewSchema } = require("./schemas.js");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");
const Joi = require("joi");
const { title } = require("process");
const Review = require('./models/review');

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); //verify that weather database is connected successfully or not
db.once("open", () => {
  console.log("DataBase Connected");
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
  // console.log(result);
};

const validateReview=(req,res,next)=> {
  console.log(req.body);
 const {error}=reviewSchema.validate(req.body);
   if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
app.get("/", (req, res) => {
  res.render("home");
});


app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError("In valid Campground Data",400);
    const campgrounds = await Campground.find({});
    // console.log(campgrounds);
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res) => {
    // const campground = new Campground.
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    // console.log(campgrounds);
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);


app.post(
 "/campgrounds/:id/reviews",
validateReview,catchAsync(async (req, res) => {
 const campground = await Campground.findById(req.params.id);
 const review = new Review(req.body.review);
 campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);  })
);


app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
  })
);

// app.get('/makecampground', async(req,res) =>{
//    const camp =new Campground({title:'My Backyard', description:'cheap camping'});
//    await camp.save();
//    res.send(camp);
// })
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "something went wrong!!!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("serving on port 3000");
});
