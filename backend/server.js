const exp = require('express')
const app = exp()
const cors = require('cors'); 
require('dotenv').config()
const mongoClient = require('mongodb').MongoClient;

// Enable CORS for all incoming requests
app.use(cors());

// Serve static files from uploads folder
app.use('/uploads', exp.static('uploads'));

// Import API routes
const userApp = require('./API/userApi')
const authorApp = require('./API/authorApi')
const adminApp = require('./API/adminApi')

// Use built-in middleware (body parser)
app.use(exp.json())

// Connect to db
mongoClient.connect(process.env.DB_URL)
.then(client => {
    // Get db object 
    const blogdb = client.db('blogdb')

    // Get collection objects
    const usersCollection = blogdb.collection('usersCollection')
    const articlesCollection = blogdb.collection('articlesCollection')
    const authorsCollection = blogdb.collection('authorsCollection')
    const adminCollection = blogdb.collection('adminCollection')

    // Share collection objects using express app
    app.set('usersCollection', usersCollection)
    app.set('articlesCollection', articlesCollection)
    app.set('authorsCollection', authorsCollection)
    app.set('adminCollection', adminCollection)

    console.log('Database connection successful')

    // Mount API routes (Do this only after DB is connected)
    app.use('/user-api', userApp)
    app.use('/author-api', authorApp)
    app.use('/admin-api', adminApp)

    // Error catching middleware
    app.use((err, req, res, next) => {
        res.send({ error: err.message })
    })

    // Start the server ONLY after DB connection is successful
    const port = process.env.PORT || 9989
    app.listen(port, () => console.log(`HTTP Server running on port ${port} .....`))
})
.catch(err => {
    console.log("Error in DB connection:", err)
})
