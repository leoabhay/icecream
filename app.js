const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { checkUser } = require('./middleware/authMiddleware');
const dbConnect = require('./config/db');

require('dotenv').config();

const app = express();

// database connection
dbConnect();

// middleware
app.use(express.static('public'));

// middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));                // parses form data "For HTML data"
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

app.use(authRoutes);  //use authRoutes from routes folder for routing

// middleware and routes
app.get('*', checkUser);        //checkUser = checks if a user is logged in and sets user info for the frontend.
app.get('/', (req, res) => res.render('home'));
app.get('/icecreams', (req, res) => 
    res.render('icecreams')
);

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});