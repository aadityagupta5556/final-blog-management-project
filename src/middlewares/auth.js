const jwt = require("jsonwebtoken");
const blogsmodel = require("../models/blogsModel");
const mongoose = require("mongoose");

const authentication = async function (req, res, next) {
  try {

    let token = req.headers["x-api-key"];

    if (!token) return res.status(400).send({ status: false, msg: "Enter token in header" });

    jwt.verify(token,"project1-AADI",function(error){

      if(error)return res.status(401).send({ status: false, msg: "Invalid Token" });

      else 

      next()
   });   
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const authorization = async function (req, res, next) {
  try {

    let token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token,"project1-AADI");

    req.authorId = decodedToken.authorId; // assigning decoded token authorId value to authorId key in request

    let blogId = req.params.blogId;
    
    if(blogId){

    if (!mongoose.isValidObjectId(blogId))return res.status(400).send({ status: false, msg: "Please enter blogID as a valid ObjectId"});

      let findBlog = await blogsmodel.findById(blogId);
      if (findBlog) {
        if (decodedToken.authorId != findBlog.authorId)return res.status(403).send({ status: false, msg:"Author is not authorized to access this data"});
        req.blogId = blogId;
      }
    }

    next();  

  } catch (error) {
    
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { authentication, authorization};
