const mongoose = require('mongoose');
const User = mongoose.model("user",{
    uname:{
        type:String,
    },
    uemail:{
        type:String,
        unique:true,
    },
    upassword:{
        type:String
    }
});

module.exports = User;