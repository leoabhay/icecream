const User = require("../models/User");
const jwt = require('jsonwebtoken');

// handle errors                                        //this can be skipped. written because it looks good on postman.
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  //incorrect email
  if (err.message === 'incorrect email'){
    errors.email = 'that email is not registered';
  }

//incorrect password
if (err.message === 'incorrect password'){
  errors.email = 'your password is incorrect';
}

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}


//for jsonwebtoken
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
  return jwt.sign({id}, 'Abhay secret',{                             //jatibela user create garinxa tyo wala id ho.
    expiresIn: maxAge
  });
}

// controller actions
module.exports.signup_get = (req, res) => {
  const user = req.user || null;
  res.render('signup', { user });
}

module.exports.login_get = (req, res) => {
  const user = req.user || null;                    // assuming 'req.user' contains the logged-in user's info
  res.render('login', { user });
};


module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });     //we need jsonwebtoken here         //id = user
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge * 1000});
    res.status(201).json({user: {
     id: user._id,
     email: user.email}
    });
  }
  catch(err) {
    const errors = handleErrors(err);               //console.log(err);
    res.status(400).json({ errors });               //res.status(400).send('error, user not created');
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try{
    const user = await User.login(email,password);
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge * 1000});
    res.status(200).json({user: {
      id: user._id,
      email: user.email }
    });
  }
  catch(err){
    const errors = handleErrors(err);
    res.status(400).json({});
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', {maxAge: 1});
  res.redirect('/');
}