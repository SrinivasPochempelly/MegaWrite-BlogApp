const exp = require('express')
const app = exp()
const cors = require('cors'); 
require('dotenv').config()
const mongoClient = require('mongodb').MongoClient;

// Enable CORS for all incoming requests
app.use(cors());

// Serve static files from uploads folder
app.use('/uploads', exp.static('uploads'));

//import API routes
const userApp = require('./API/userApi')
const authorApp = require('./API/authorApi')
const adminApp = require('./API/adminApi')

//connect to db
mongoClient.connect(process.env.DB_URL)
.then(client => {
    //get db object 
    const blogdb = client.db('blogdb')
    //get collection obj
    const usersCollection = blogdb.collection('usersCollection')
    const articlesCollection = blogdb.collection('articlesCollection')
    const authorsCollection = blogdb.collection('authorsCollection')
    const adminCollection = blogdb.collection('adminCollection')
    //share collection obj using express app
    app.set('usersCollection',usersCollection)
    app.set('articlesCollection', articlesCollection)
    app.set('authorsCollection', authorsCollection)
    app.set('adminCollection', adminCollection)

    console.log('db connection successfull')
})
.catch(err=> {
    console.log("Error in db connection : ", err)
})

//use built in middleware (body parser)
app.use(exp.json())

//if path starts with user-api, send req to userApp
app.use('/user-api', userApp)
//if path starts with author-api, send req to authorApp
app.use('/author-api', authorApp)
//if path starts with admin-api, send req to adminApp
app.use('/admin-api', adminApp)

//error catching middleware
app.use((err, req, res, next) => {
    res.send({ error: err.message })
})

//assigning port number
const port = process.env.PORT || 9989
app.listen(port, () => console.log(`http Server running on port ${port} .....`))