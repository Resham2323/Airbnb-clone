const User = require("../models/user.js");

module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try{
  let {username, email, password} = req.body;
    const newUser = new User({username, email });
    const registerUser = await User.register(newUser, password);
      req.login(registerUser, (err) => {
        if(err) {
            return next();
        }
           req.flash("success", "Welcome to Rentozo");  
           res.redirect("/listings");
      });
    }catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async(req, res) => {
    try{
    req.flash("success", "Welcome back in Rentozo");
    res.redirect("/listings");
    }catch(err) {
        req.flash("error", err.message);
        let redirectUrl = res.session.redirectUrl || "/listings"
        res.redirect(redirectUrl);
    }
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next();
        }
        req.flash("success", "you logged out successfully");
        res.redirect("/listings");
    })
}