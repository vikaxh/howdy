const asyncHandler = require('express-async-handler')
const generateToken = require('../config/generateToken')
const User = require('../models/userModel')

const registerUser = asyncHandler(async (req, res)=>{

    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.status(400).json(
            {
                'Error':"Please Enter all the feilds"
            }
        );
        throw new Error("Please Enter all the feilds")
    }
    const userExist = await User.findOne({email});

    if(userExist){
        res.status(400).json(
            {
                'Error':" User already exist"
            }
        );
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    })

    if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          pic: user.pic,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json(
            {
                'Error':"Failed to create User"
            }
        );
        throw new Error("Failed to create user");
      }
    })

const authUser = asyncHandler(
    async(req, res)=>{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        try {
            
        if(user && (await user.matchPassword(password))){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id),
              });
        }
        else {
            res.status(401);
            throw new Error("Invalid Email or Password");
          }
        
        } catch (error) {
            res.status(400).json(
               {
                msg : "Invalid Email or Password"
               }
            )
        }
    }
)

const allUsers = asyncHandler(async(req, res)=>{

    
    const keyword = req.query.search ? {
        
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
    }:{};

    
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
    
})

    module.exports = {registerUser, authUser, allUsers}