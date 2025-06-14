const exp = require('express');
const authorApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../Middlewares/verifyToken');
const upload = require('../Middlewares/multerConfig');

require('dotenv').config();

let authorsCollection;
let articlesCollection;
authorApp.use((req, res, next) => {
  authorsCollection = req.app.get('authorsCollection');
  articlesCollection = req.app.get('articlesCollection');
  next();
});

// Author registration route
authorApp.post('/author', expressAsyncHandler(async (req, res) => {
  const newAuthor = req.body;
  const dbres = await authorsCollection.findOne({ username: newAuthor.username });
  if (dbres !== null) {
    res.send({ message: 'Username already taken' });
  } else {
    const hashedPass = await bcryptjs.hash(newAuthor.password, 6);
    newAuthor.password = hashedPass;
    await authorsCollection.insertOne(newAuthor);
    res.send({ message: 'User registration Successful' });
  }
}));

// Author login route
authorApp.post('/login', expressAsyncHandler(async (req, res) => {
  const authorLogin = req.body;
  const dbres = await authorsCollection.findOne({ username: authorLogin.username });
  if (dbres === null) {
    res.send({ message: 'Invalid username' });
  } else {
    if (dbres.isActive === false) {
      res.send({ message: 'Your Account is blocked!' });
      return;
    }
    const status = await bcryptjs.compare(authorLogin.password, dbres.password);
    if (status === false) {
      res.send({ message: 'Invalid password' });
    } else {
      const signedtoken = jwt.sign({ username: authorLogin.username }, process.env.PRIVATE_KEY, { expiresIn: '1d' });
      res.send({ message: 'login successful', token: signedtoken, userData: dbres });
    }
  }
}));

// Create article route
authorApp.post('/article', verifyToken, upload.array('images', 5), expressAsyncHandler(async (req, res) => {
  let newArticle;
  try {
    newArticle = JSON.parse(req.body.articleData);
  } catch (err) {
    return res.status(400).send({ message: 'Invalid article data format' });
  }
  const images = req.files.map(file => ({
    url: `http://localhost:9898/uploads/article-images/${file.filename}`,
    caption: req.body[`caption_${file.originalname}`] || '',
    uploadedAt: new Date().toISOString(),
  }));
  newArticle.images = images;
  newArticle.dateOfCreation = new Date().toISOString();
  newArticle.dateOfModification = newArticle.dateOfCreation;
  newArticle.comments = [];
  newArticle.status = true;
  await articlesCollection.insertOne(newArticle);
  res.send({ message: 'Article created!', article: newArticle });
}));

// Update article route
authorApp.put('/article', verifyToken, upload.array('images', 5), expressAsyncHandler(async (req, res) => {
    let modifiedArticle;
    try {
        modifiedArticle = JSON.parse(req.body.articleData);
    } catch (err) {
        return res.status(400).send({ message: 'Invalid article data format' });
    }

    // Process new images, if any
    if (req.files.length > 0) {
        const newImages = req.files.map(file => ({
            url: `http://localhost:9898/uploads/article-images/${file.filename}`,
            caption: req.body[`caption_${file.originalname}`] || '',
            uploadedAt: new Date().toISOString()
        }));
        // Use existingImages from articleData, or empty array, and append new images
        modifiedArticle.images = [...(modifiedArticle.existingImages || []), ...newImages];
        delete modifiedArticle.existingImages; // Clean up
    } else {
        // No new images, use existingImages as images
        modifiedArticle.images = modifiedArticle.existingImages || [];
        delete modifiedArticle.existingImages;
    }

    // Update modification date
    modifiedArticle.dateOfModification = new Date().toISOString();

    // Update in db
    const dbres = await articlesCollection.updateOne(
        { articleId: modifiedArticle.articleId },
        { $set: modifiedArticle }
    );
    if (dbres.modifiedCount === 1) {
        res.send({ message: 'Article Modified!', article: modifiedArticle });
    } else {
        res.status(404).send({ message: 'Article not found or deleted' });
    }
}));
// Soft delete article
authorApp.put('/article/soft-delete/:id',verifyToken, expressAsyncHandler(async (req,res) =>{
    //get id from url param
    const urlParamId = req.params.id
    //get whole article
    const articleDelete = req.body
    
    const dbres = await articlesCollection.updateOne({articleId : urlParamId},{$set : {...articleDelete, status : false, dateOfModification : new Date().toISOString()}})
    if(dbres.modifiedCount == 1)
        res.send({message : 'Article removed !'})
    else
        res.send({message : 'Unable to remove article'})
}))

// Restore deleted article
authorApp.put('/article/restore/:id',verifyToken, expressAsyncHandler(async (req,res) =>{
    //get id from url param
    const urlParamId = req.params.id
    //get whole article
    const articleDelete = req.body
    
    const dbres = await articlesCollection.updateOne({articleId : urlParamId},{$set : {...articleDelete, status : true, dateOfModification : new Date().toISOString()}})
    if(dbres.modifiedCount == 1)
        res.send({message : 'Article restored !'})
    else
        res.send({message : 'Unable to restore article'})
}))

// Get articles of author
authorApp.get('/articles/:username', verifyToken, expressAsyncHandler(async (req, res) => {
  const urlusername = req.params.username;
  const { status } = req.query;
  const query = { username: urlusername };
  if (status === 'false') {
    query.status = false;
  } else {
    query.status = true;
  }
  console.log('Query:', query);
  const articlesList = await articlesCollection
    .find(query)
    .sort({ dateOfModification: -1 }) // Sorting added here
    .toArray();
  console.log('Fetched articles:', articlesList);
  res.send({ message: 'Articles fetched', Articles: articlesList });
}));


authorApp.get('/test-author', (req, res) => {
  res.send({ message: 'This response from Author API' });
});

module.exports = authorApp;