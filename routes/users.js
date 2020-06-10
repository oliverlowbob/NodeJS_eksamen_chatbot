const router = require('express').Router();
const parseurl = require('parseurl')

const User = require('../models/User.js');


router.get('/users', async (req, res) => {
    var pathname = parseurl(req)
    req.session.myValue = pathname.path
    if(req.session.isLoggedIn === true){
        const users = await User.query().select();
        return res.send(users);
    }
    else{
        return res.redirect("/login")
    }
    
});


router.get('/user/:id', async (req, res) => {
    var pathname = parseurl(req)
    req.session.myValue = pathname.path
    if(req.session.isLoggedIn === true){
        const user = await User.query().select().where("id", req.params.id);
        return res.send(user);
    }
    else{
        return res.redirect("/login")
    }
    
});

// router.get("/setsessionvalue", (req, res, next)=>{
//     var pathname = parseurl(req).pathname
//     req.session.myValue = pathname
//     console.log(req.session)
//     return res.send({response: "OK"});
// })

// router.get("/getsessionvalue", (req, res, next)=>{
//     return res.send({response: req.session.myValue});
// })

module.exports = router;