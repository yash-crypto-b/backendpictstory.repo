const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required:[true,'Username is required'],
        unique: true,
        trim: true,
        minlength:[3,'username should be of atleast 3 characters']
    },
    email : {
        type : String ,
        required : [true,'Email is requied'],
        unique: true ,
        lowercase : true,
        trim: true 
    },
    password : {
        type : String,
        required : [true,'Password is required'],
        minlength:[6,'Password should be of atleast 6 characters']
    },
    profilePicture:{
        type: String,
        default:'https://via.placeholder.com/150'
    },
    bio:{
        type: Date,
        default : Date.now
    }
});
userSchema.pre('save',async function(next){
    if(!this.Modified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();

});
userSchema.methods.comaparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};
module.exports = mongoose.model('User',userSchema);
