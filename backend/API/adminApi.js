//create admin api app
const exp = require('express')
const adminApp = exp.Router()
const expressAsyncHandler = require('express-async-handler')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

let adminCollection
let articlesCollection
let usersCollection
let authorsCollection
adminApp.use((req,re,next)=>{
    adminCollection = req.app.get('adminCollection')
    articlesCollection = req.app.get('articlesCollection')
    usersCollection = req.app.get('usersCollection')
    authorsCollection = req.app.get('authorsCollection')
    next()
})

require('dotenv').config()
//admin login
adminApp.post('/login' , expressAsyncHandler(async (req,res)=>{
    //get credentials
    const adminLogin = req.body
    //check if username matches
    const dbres = await adminCollection.findOne({username : adminLogin.username})
    if(dbres === null)
            res.send({message : 'Username Invalid'})
    else{
        //const status =await bcryptjs.compare(adminLogin.password,dbres.username)
        const status = (adminLogin.password == dbres.password)
        if(status === false)
            res.send({message : 'Password Invalid'})
        else{
            const signedtoken = jwt.sign({username : adminLogin.username}, process.env.PRIVATE_KEY,{expiresIn:20}) 
            res.send({message : 'login successfull', token : signedtoken, userData : dbres})
        }
    }
}))

//read articles
adminApp.get('/articles', expressAsyncHandler(async(req,res)=>{
    //get articles from db
    const articlesList = await articlesCollection.find().toArray()
    //send res
    res.send({message : 'articles fetched', articles : articlesList})
}))

//get users
adminApp.get('/users', expressAsyncHandler(async(req,res)=>{
    //get all usernames
    const usersList = await usersCollection.find({},{username : 1}).toArray()
    //send res
    res.send({message : 'users fetched', users : usersList})
}))

//deactivate user
adminApp.put('/deactivate/user/:username' ,expressAsyncHandler(async(req,res) =>{
    //get username from url
    const usernameUrl = req.params.username
    const dbres = usersCollection.updateOne({username : usernameUrl}, {$set : {isActive : false}})
    res.send({message : 'User Deactivated !'})
}) )

//activate user
adminApp.put('/activate/user/:username', expressAsyncHandler(async(req,res)=>{
    //get username from url
    const usernameUrl = req.params.username

    const dbres = usersCollection.updateOne({username : usernameUrl}, {$set : {isActive : true}})
    res.send({message : 'user is activated !'})
}))

//deactivate author
adminApp.put('/deactivate/author/:username' ,expressAsyncHandler(async(req,res) =>{
    //get username from url
    const usernameUrl = req.params.username
    const dbres = authorsCollection.updateOne({username : usernameUrl}, {$set : {isActive : false}})
    res.send({message : 'Author Deactivated !'})
}) )

//activate user
adminApp.put('/activate/author/:username', expressAsyncHandler(async(req,res)=>{
    //get username from url
    const usernameUrl = req.params.username

    const dbres = authorsCollection.updateOne({username : usernameUrl}, {$set : {isActive : true}})
    res.send({message : 'Author is activated !'})
}))

adminApp.get('/test-admin', (req,res)=>{
    res.send({message:"This response from Admin API"})
})

//export the adminApp
module.exports = adminApp