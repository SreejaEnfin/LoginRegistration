const User = require("../models/user.model");
const express = require('express');
const cors = require('cors');
const urouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const yup = require('yup');
const objectId = require('mongoose').Types.ObjectId;

const app = express();

app.use(express.json());
app.use(cors());

// yup validation

const createUserSchema = yup.object().shape({
  uname: yup.string().trim().required(),
  uemail: yup.string().trim().required(),
  upassword: yup.string().trim().required(),
});


// signup
urouter.post('/signup', async(req, res)=>{
    try{
        const parsedData = await createUserSchema.validate(req.body);
let pass = parsedData.upassword;
let hash = bcrypt.hashSync(pass,10);
let user = new User({
    uname:req.body.uname,
    uemail:parsedData.uemail,
    upassword:hash,
});
var result = await user.save();
res.status(200).json({
    "success":true,
    "data":result
});
    }
    catch(err){
res.status(400).json({
    "success":false,
    "data":err
});
    }
});

// login
// urouter.post('/login', async(req, res)=>{
//     let userData = req.body;
//     User.findOne({uemail:userData.uemail},(err, user)=>{
//         if(err){
//             res.json({
//                 "success":false,
//                 "data":err
//             })
//         }
//         else{
//             if(!user){
//                 res.status(401).json({
//                     "success":false,
//                     "message":"Invalid Email",
//                 })
//             }else if(!bcrypt.compareSync(userData.upassword, user.upassword)){
//                 res.status(401).json({
//                     "success":false,
//                     "message":"Invalid Password",
//                 })
//             }else{
//                 let payload = {
//                     id:user.ObjectId,
//                     name:user.uname,
//                     email:user.uemail
//                 }
//                 let token = jwt.sign(payload, "secretkey");
//                 res.status(200).json({
//                     "success":true,
//                     "message":"Login Successfull",
//                     "data":token
//                 });
//             }
//         }
//     });
// });

urouter.post('/login', async(req, res)=>{
    try{
        let userData = req.body;
        let result = await User.findOne({uemail: userData.uemail});
        try{
            if(result){
                try{
                    if(bcrypt.compareSync(userData.upassword, result.upassword)){
                        let payload = {
                            id:result.ObjectId,
                            name:result.uname,
                            email:result.uemail
                        }
                        let token = jwt.sign(payload, "secretkey");
                        res.status(200).json({
                            "success":true,
                            "message":"Login Successfull",
                            data:token
                        });
                    }
                }
                catch(err){
                    res.json({
                        "success":false,
                        "message":"Invalid Password",
                    });
                }
            }
        }
        catch(err){
            res.json({
                "success":false,
                "message":"Invalid Email",
            })
        }
    }
    catch(e){
        res.status(400).json({
            "success":false,
            "data":e
        })
    }
});

// get all users
urouter.get('/', async(req, res)=>{
    try{
    let result = await User.find();
    res.status(200).json({
        "success":true,
        "data":result
    });
}catch(err)
{
    res.status(400).json({
        "success":false,
        "data":err
    })
}
})

module.exports = urouter;