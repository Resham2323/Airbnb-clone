if(process.env.NODE_ENV != "production") {
require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const ExpressError =require("./Utils/ExpressError.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user.js");
const multer = require('multer');
const passport = require("passport");
const LocalStrategy = require("passport-local");

const mongoose = require('mongoose');
const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.engine("ejs", ejsMate);app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR IN MONGO STORE:", err);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser = req.user;
    next();
})

// app.get("/", (req, res) => {
//     res.send("Hii i'am root");
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage });


app.all('/{*splat}', (req, res, next) => {
    next(new ExpressError( 404 ,"Page not found "))
});

app.use((err, req, res, next) => {
    let {statusCode=500, message = "something went wrong"} = err;
    res.status(statusCode).render("Express.ejs", {message});
})

app.get('/', (req, res) => {
  res.render('listing/index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});