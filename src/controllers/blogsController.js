const blogsmodel = require("../models/blogsModel");
const mongoose = require("mongoose");

// ### POST /blogs

const createBlogs = async function (req, res) {
  try {
    let data = req.body;
    let save = await blogsmodel.create(data);
    res.status(201).send({ status: true, data: save });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

// ## GET /blogs

const getBlogs = async function (req, res) {
  try {
    let conditions = req.query; 
    //Checks if category is entered as a string or not  
    if (conditions.category){
      if(typeof conditions.category !== 'string') return res.status(400).send({ status: false, msg: "Please enter Category as a String" });}

    // Checks whether author id isa valid ObjectId
      if(conditions.authorId) {
        if (!mongoose.isValidObjectId(conditions.authorId))return res.status(400).send({ status: false, msg: "Please Enter authorID as a valid ObjectId" })}

    // Fetching the blogs
    let blogs = await blogsmodel.find({$and: [conditions, { isDeleted: false }, { isPublished: true }]});

    if (blogs.length == 0)return res.status(404).send({ status: false, msg: "No Blogs found" });

    res.status(200).send({ status: true, data: blogs });

  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

// ### PUT /blogs/:blogId

const putBlogs = async function (req, res) {
  try {
    let blogId = req.blogId;
    let blogData = req.body;
    //Updating the Blog
    let updatedBlog = await blogsmodel.findOneAndUpdate(
      { _id: blogId, isDeleted: false }, //Checks weather document is deleted or not { _id: blogId },
      {
        title: blogData.title,
        body: blogData.body,
        isPublished: true,
        publishedAt: Date.now(),
        $push: { tags: blogData.tags, subcategory: blogData.subcategory },
      },
      { new: true }
    );

    if(!updatedBlog) return res.status(404).send({status:false,msg:"No blogs found"})

    res.status(200).send({ status: true, data: updatedBlog });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

// ### DELETE /blogs/:blogId

const deleteBlogs = async function (req, res) {
  try {
    let blogId = req.blogId;
        
    //Deleting blog and adding timestamp
    let blog = await blogsmodel.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: Date.now() } }
    );
    if (!blog) {
      return res.status(404).send({ status: false, msg: "Blog Not Found" });
    }
    res.status(200).send({ status: true, msg: "Document is deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

// ### DELETE /blogs?queryParams

const deleteBlogsByQuery = async function (req, res) {
  try {    
    let conditions = req.query;
    //Checks whether query params is empty or not
    if (Object.keys(conditions).length == 0)  return res.status(400).send({ status: false, msg: "Query Params cannot be empty" });
    let filters = {
      isDeleted:false,
      authorId:req.authorId
    }
      if(conditions.authorId) {
        if(conditions.authorId != req.authorId) return res.status(403).send({ status: false, msg: "Author is not authorized to access this data"})      
      }

      if(conditions.category)filters.category=conditions.category;
      if(conditions.tags) filters.tags={$all:conditions.tags};
      if(conditions.subcategory) filters.subcategory={$all:conditions.subcategory};
      if(conditions.isPublished) filters.isPublished=false;
     
    let deleteBlogs = await blogsmodel.updateMany(filters,{ $set: { isDeleted: true, deletedAt: Date.now()}});   
    //let deleteBlogs= await blogsmodel.updateMany({isDeleted:true},{$set:{isDeleted:false}})
    console.log(deleteBlogs);
    if (deleteBlogs.matchedCount == 0) {
      return res.status(404).send({ status: false, msg: "Blog Not Found" });
    }
    res.status(200).send({ status: true, msg: "Document is deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};
module.exports = {createBlogs, getBlogs, putBlogs, deleteBlogs, deleteBlogsByQuery}