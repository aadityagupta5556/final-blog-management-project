const authormodel = require("../models/authorModel");
const mongoose = require("mongoose");

const blogValidations = async function (req, res, next) {
  try {
    let data = req.body;
    //Checks whether Body is empty or not
    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Body cannot be empty" });

    // Checks if title is empty or entered as a string or contains valid Title
    if (!data.title)
      return res.status(400).send({ status: false, msg: "Please Enter Title" });
    if (typeof data.title !== "string")
      return res
        .status(400)
        .send({ status: false, msg: " Please enter title as a String" });
    data.title = data.title.trim();
    let validTitle = /^\d*[a-zA-Z][a-zA-Z\d\s]*$/;
    if (!validTitle.test(data.title))
      return res
        .status(400)
        .send({
          status: false,
          msg: "The Title may contain letters and numbers, not only numbers",
        });

    // Checks if Body is empty or entered as a string
    if (!data.body)
      return res.status(400).send({ status: false, msg: "Please Enter Body" });
    if (typeof data.body !== "string")
      return res
        .status(400)
        .send({ status: false, msg: " Please enter body as a String " });
    data.body = data.body.trim();
    if (data.body.length <= 10)
      return res
        .status(400)
        .send({
          status: false,
          msg: "The body should contain at least 10 characters",
        });

    // Checks if category is empty or entered as a string or contains valid Category
    if (!data.category)
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter Category" });
    if (typeof data.category !== "string")
      return res
        .status(400)
        .send({ status: false, msg: "Please enter Category as a String" });
    data.category = data.category.trim();
    let validCategory = /^\w[a-zA-Z]*$/;
    if (!validCategory.test(data.category))
      return res
        .status(400)
        .send({ status: false, msg: "The Category may contain only letters" });

    // Checks if authorId is empty or contains valid authorId
    let authorId = req.body.authorId;
    if (!authorId)
      return res.status(400).send({ status: false, msg: "Enter Author Id" });
    if (!mongoose.isValidObjectId(authorId))
      return res.status(400).send({
        status: false,
        msg: "Please Enter authorId as a valid objectId",
      });

    // Checks whether authorId is present in author collection or not
    let checkAuthorId = await authormodel.findById(authorId);
    if (!checkAuthorId)
      return res
        .status(404)
        .send({ status: false, msg: "Entered author not found" });

    //If isPublished is true then adding timestamp
    if (data.isPublished) {
      if (typeof data.isPublished !== "boolean")
        return res.status(400).send({
          status: false,
          msg: "Please mention isPublished as True or False",
        });
      if (data.isPublished == true) {
        let date = Date.now();
        data.publishedAt = date;
      }
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

const updateValidations = async function (req, res, next) {
  try {
    let blogId=req.params.blogId
    if (!blogId)
      return res.status(400).send({ status: false, msg: "Enter BlogId" });
    let data = req.body;
    //Checks whether Body is empty or not
    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Body cannot be empty" });

    // Checks if title is empty or entered as a string or contains valid Title
    if (data.title) {
      if (typeof data.title !== "string")
        return res
          .status(400)
          .send({ status: false, msg: " Please enter title as a String" });
      data.title = data.title.trim();
      let validTitle = /^\d*[a-zA-Z][a-zA-Z\d\s]*$/;
      if (!validTitle.test(data.title))
        return res
          .status(400)
          .send({
            status: false,
            msg: "The Title may contain only letters and numbers",
          });
    }

    // Checks if Body is empty or entered as a String
    if (data.body) {
      if (typeof data.body !== "string")
        return res
          .status(400)
          .send({ status: false, msg: " Please enter body as a String" });
      data.body = data.body.trim();
      if (data.body.length <= 10)
        return res
          .status(400)
          .send({
            status: false,
            msg: "The body should contain at least 10 characters",
          });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};
module.exports = { blogValidations, updateValidations };
