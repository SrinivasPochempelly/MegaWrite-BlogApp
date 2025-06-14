//create user api app
const exp = require('express')
const userApp = exp.Router()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const expressAsyncHandler = require('express-async-handler')
const verifyToken = require('../Middlewares/verifyToken')

require('dotenv').config()

let usersCollection
let articlesCollection
userApp.use((req,res,next)=>{
    usersCollection = req.app.get('usersCollection')
    articlesCollection = req.app.get('articlesCollection')
    next()
})

//user registration route
userApp.post('/user',expressAsyncHandler( async (req,res)=>{
    const newUser = req.body;
    //check if user exits 
    const dbres = await usersCollection.findOne({username : newUser.username})
    if(dbres !== null)
        res.send({message : 'Userame already taken'})
    else{
        //hash password
        const hashedPass = await bcryptjs.hash(newUser.password,6)
        //change password with hashed password
        newUser.password = hashedPass
        //insert user
        await usersCollection.insertOne(newUser)

        res.send({message : "User registration Successfull"})
    }
}))

//user login route
userApp.post('/login', expressAsyncHandler(async(req,res)=>{
    //get the userdata
    const userlogin = req.body;
    // console.log(userlogin)
    //check if username is matched
    const dbres = await usersCollection.findOne({username : userlogin.username})
    if(dbres === null)
        res.send({message :'Invalid username'})
    else{
        //check password is mathced
        if(dbres.isActive === false){
            res.send({message : 'Your account is blocked !'})
            return
        }
        const status = await bcryptjs.compare(userlogin.password,dbres.password)
        if(status === false)
            res.send({message : 'Invalid password'})
        else{
            //create jsonwebtoken
            const signedtoken = jwt.sign({username : userlogin.username}, process.env.PRIVATE_KEY,{expiresIn:'1d'}) 
            res.send({message : 'login successfull', token : signedtoken, userData : dbres})

        }
    }
}))
 
//get articles route
userApp.get('/articles', expressAsyncHandler(async(req,res)=>{
    //get articles from db
    const articlesList = await articlesCollection.find().toArray()
    //send res
    res.send({message : 'articles fetched', articles : articlesList})
}))

//write comments route
userApp.put('/comment/:id',verifyToken, expressAsyncHandler(async(req,res)=>{
    //get comment obj
    const commentObj = req.body
    //get article id
    const articleIdUrl = req.params.id
    //update the comment in the db
    const dbres = await articlesCollection.updateOne({articleId : articleIdUrl}, {$addToSet :{comments : commentObj}})
    res.send({message : 'comment posted'})
    console.log(dbres)
}))

userApp.get('/test-user', (req,res)=>{
    res.send({message:"This response from user API"})
})

//export the userApp
module.exports = userApp