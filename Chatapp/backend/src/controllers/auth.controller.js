import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {upsertStreamUser} from "../lib/stream.js";
import { compareSync } from "bcryptjs";

export async function signup(req, res){
    const {email, fullName, password } = req.body;
    try{
        //Some basic checks
        if( !email || !password || !fullName ){
            return res.status(400).json({message:"All fields are required"});
        }

        if( password.length < 6 ){
            return res.status(400).json({message:"Password must be atleast 6 characters long"});
        } 

        //Check for existing users
        const existingUser = await User.findOne({email});
        if( existingUser ){
            return res.status(400).json({message:"Please use a different email id"});
        }

        //Creating new user
        const idx = (Math.random()*100)+1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        const newUser = await User.create({
            email, 
            fullName, 
            password, 
            profilePic:randomAvatar
        })

        //Create new user in stream
        try{
            await upsertStreamUser({
                id:newUser._id.toString(),
                name:newUser.fullName,
                image:newUser.profilePic || ""
            })
            console.log(`Stream user ${newUser.fullName} created successfully\n`);
        }
        catch(error){
            console.log("Error upserting stream user", error);
        }

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn:"1d"});
        res.cookie("jwt", token, {
            maxAge:1*24*60*60*1000,
            httpOnly:true,
            sameSite:"Strict",
            secure:process.env.NODE_ENV==="production"
        });
        res.status(201).json({sucess:true, user:newUser});
    }
    catch(error){
        console.log("Error in signup controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function login(req, res){
    try{
        const {email, password} = req.body;
        if( !email || !password ){
            res.send(400).json({message:"All field are mandatory"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.send(401).json({message:"Invalid email or password"});
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid email or password"});
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn:"1d"});
        res.cookie("jwt", token, {
            maxAge:1*24*60*60*1000,
            httpOnly:true,
            sameSite:"Strict",
            secure:process.env.NODE_ENV==="production"
        });
        console.log("Login Successful\n");
        res.status(200).json({success:true, user});

    }
    catch(error){
        console.log("Error in login controller\n", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export function logout(req, res){
    res.clearCookie("jwt");
    console.log("Logout successful\n");
    res.status(200).json({success:true, message:"Logout sucessful"});
}

export async function onboard(req, res){
    try{
        const userId = req.user._id;
        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

        //Check and return which-ever data is unfilled
        if( !fullName || !bio || !nativeLanguage || !learningLanguage || !location ){
            return res.status(400).json({
                message:"All fields are required",
                missingFields:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ]
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true
        },{new:true});
        
        if(!updatedUser){
            return res.status(400).json({message:"User not found"});
        }

        //Update the info in Stream
        try{
            await upsertStreamUser({
                id:updatedUser._id.toString(),
                name:updatedUser.fullName,
                image:updatedUser.profilePic || "",
            })
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
        }
        catch(streamError){
            console.log("Error updating stream user during onboarding",streamError.message);
        }

        res.status(200).json({success:true, user:updatedUser});
    }
    catch(error){
        console.error("Onboarding Error", error);
        res.status(500).json({message:"Internal Server Error"});
    }
}
