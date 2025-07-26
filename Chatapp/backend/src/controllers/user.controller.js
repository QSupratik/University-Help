import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { response } from "express";

export async function getRecommendedUsers(req, res){
    try{
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const recommendedUsers = await User.find({
            $and:[
                {_id:{$ne:currentUserId}}, //Excluding current user-ID, ne-not equal
                {$id:{$nin:currentUser.friends}},
                {isOnboarded:true}
            ]
        })
        res.status(200).json({recommendedUsers});
    }catch(error){
        console.error("Error in getRecommendedUsers controllet", error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getMyFriends(req, res){
    try{
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    }
    catch(error){
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({message:"Internal Server Error\n"});
    }
}

export async function sendFriendRequest(req, res){
    try{
        const myId = req.user.id;
        const {id:recipientId} = req.params; //Renaming id as recipientid

        //Cannot send request to oneself
        if( myId === recipientId ){
            return res.status(400).json({message:"You can't send friend request to yourself\n"});
        }

        //Checking if the recipient id is at all a valid user id
        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(400).json({message:"Recipient Id not found\n"});
        }

        //Checking if it is already a friend
        if( recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends\n"});
        }

        //Checking if request is already sent
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender:myId, recipient:recipient},
                {sender:recipientId, recipient:myId}
            ]
        })

        if(existingRequest){
            return res.status(400).json({message:"A friend request already exists between you and this user"});
        }

        //Finally sending the friend request
        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        });
        res.status(200).json(friendRequest);

    }catch(error){
        console.error("Error in sending Friend Request constroller\n", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

