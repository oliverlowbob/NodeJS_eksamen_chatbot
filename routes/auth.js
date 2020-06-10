const route = require('express').Router();

const User = require('../models/User.js');
const Role = require('../models/Role.js');

const bcrypt = require('bcrypt');
const saltRounds = 12;
const pug = require('pug');


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'authtesttesttest@gmail.com',
      pass: 'hejtykke123' // naturally, replace both with your real credentials or an application-specific password
    }
  });

route.post("/login", async (req, res, next) => {

    const {username, password} = req.body
    if (username && password){
        try {
            if(await User.query().select("username").where({ 'username': username })){
                hashedPW = await User.query().select("password").where({ 'username': username }).limit(1)
                userId = await User.query().select("id").where({ 'username': username }).limit(1)
                bcrypt.compare(password, hashedPW[0].password).then((result) => {
                    if(result == true){
                        req.session.isLoggedIn = true
                        req.session.userName = username
                        req.session.userId = userId[0].id
                        res.redirect(req.session.myValue)
                    }
                    else{
                        res.status(400).send({response: "password is not correct", pw : hashedPW})
                    }
                    
                });
            }
            else{
                res.status(400).send({response: "username is not correct"})
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send({ response: "Something went wrong with the database", error: error });
        }
    }
    else{
        return res.status(400).send({response: "username or password is missing"})
    }

    // 1. retrieve the login details and validate
    // 2. check for a user match in the database
    // 3. bcrypt compare
    // 4. sessions
});




route.post("/signup", async (req, res) => {
    
    // what fields do we need to sign up?
    // username, password, repeat password
    const { username, password, passwordRepeat, email } = req.body;
    
    const isPasswordTheSame = password === passwordRepeat;
    
    if (username && password && isPasswordTheSame && email) {
        // password requirements
        if (password.length < 6) {
            return res.status(400).send({ response: "Password does not fulfill the requirements" });
        } else {
            try {
                
            const userFound = await User.query().select().where({ 'username': username }).limit(1);
            if (userFound.length > 0) {
                return res.status(400).send({ response: "username already exists" });
            } else {
               
                const defaultUserRoles = await Role.query().select().where({ role: 'USER' });

                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const createdUser = await User.query().insert({
                    username,
                    password: hashedPassword,
                    roleId: defaultUserRoles[0].id,
                    email
                });

                
                const mailOptions = {
                    from: 'authtest@gmail.com',
                    to: email,
                    subject: 'Succesfully signed up to the website',
                    text: 'You sucesfully signed up to authapp. Ur username is '+username+" and you password is "+password
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                });
                req.session.signedUp = true;
                return res.redirect("/");
            }
            
            } catch (error) {
                return res.status(500).send({ response: "Something went wrong with the database", error: error });
            }
        }
    } else if (password && passwordRepeat && !isPasswordTheSame) {
        return res.status(400).send({ response: "Passwords do not match. Fields: password and passwordRepeat" });
    } else {
        return res.status(404).send({ response: "Missing fields: username, password, passwordRepeat or email" });
    }
    
});

route.get("/logout", (req, res) => {
    req.session.destroy((err) =>{
        if(err){
            console.log(err)
        }
        else{
            return res.redirect("/");
        }
      })    
});

module.exports = route;
