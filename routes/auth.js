const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser= require("../middleware/fetchuser")
const JWT_SECRET= 'usmanisagoodb$oy'

// Route 1. Creating the end point /api/auth/createuser
//Using The Express Validator
router.post('/createuser', [
  body('email', 'Email is Invalid').isEmail(),
  body('password', 'Password Must be at least 5 character').isLength({ min: 5 }),
  body('name', 'Name Should be at least 3 character').isLength({ min: 3 })

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //checking wether the user with this email already exist
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({ error: "Sorry User With Email Already Exist" })
    }
    //Add Salt to Our and Create Hash of that password
    const salt = await bcrypt.genSalt(10)
    secPass = await bcrypt.hash(req.body.password, salt)
    /// Creat the New user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    /////Creating Authentication Token
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    // .then(user => res.json(user))
    // .catch(err => {
    //   console.log(err)
    //   res.json({ error: "Please Enter A Unnique Value" })
    // });
    res.json({authToken})
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error")
  }

})
// Creating the end point /api/auth/login
router.post('/login', [
  body('email', 'Email is Invalid').isEmail(),
  body('password', 'Password can not be blank').exists()

], async (req, res) => {
  let success =false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

const { email, password } = req.body;
try {
  let user = await  User.findOne({ email })
  if (!user) {
    return res.status(400).json({ error: "Sorry Email Address Is Not Correct" })
  }
  const passCompare =  await bcrypt.compare(password, user.password)
  if (!passCompare) {
    success =false
    return res.status(400).json({success, error: "Sorry Password  Is Not Correct" })
  }
  const data = {
    user: {
      id: user.id
    }
  }
  const authToken = jwt.sign(data, JWT_SECRET)
  success =true
  res.json({success, authToken})
} catch (error) {
  console.error(error.message)
  res.status(500).send("Internal Server Error")
}
})
// Creating the end point /api/auth/getuser login Required
router.post('/getuser', fetchuser,async (req, res) => {
  try {
    userid=req.user.id; 
    const user =await User.findById(userid).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error")
  }
})
module.exports = router