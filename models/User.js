const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true
    },

    password:{
        type: String,
        required: [true, 'Please enter password'],
        minLength: [6, 'Password should be greater than 6 characters']
    }
});


// //fire a function after doc saved to database (not necessary)
// userSchema.post('save', function(doc,next){
//     console.log('new user was created and saved', doc);
//     next();     //if this is not used then the db will become hang and not run
// })

// //fire a function before doc saved to database (not necessary)
// userSchema.pre('save', function(next){
//     console.log('user about to be created and saved', this);
//     next();     //if this is not used then the db will become hang and not run
// })


//hashing password
userSchema.pre('save', async function (next){                   //pre save - before saving a user to the database
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


//static method to login user          //custom login method            //this is a custom method on the User model to handle login logic.
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});
    if (user){
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            return user;
        }
        throw Error('incorrect password');
    }throw Error('incorrect email')
    
}

const User = mongoose.model('user', userSchema);

module.exports = User;