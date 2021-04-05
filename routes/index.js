const express  = require('express');
//to get request url
const router = express.Router();
// Auth middlewares
const {ensureAuth, ensureGuest} = require('../middleware/auth');
// Story model 
const Story = require('../models/Story');
router.get('/', ensureGuest, (req,res)=>{
     res.render('login',{
         layout: 'login'
     });
});
router.get('/dashboard',ensureAuth, async (req,res)=>{
    let stories;
    try {
        stories = await Story.find({ user: req.user.id }).lean();
    } catch (error) {
        res.render('error/500');
    }
    res.render('dashboard',{
        name: req.user.firstName,
        stories
    });
});
module.exports = router;