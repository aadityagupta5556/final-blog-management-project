const authormodel = require("../models/authorModel");
const jwt =require('jsonwebtoken')

// ### Author API /authors

const createauthor = async function (req, res) {                   
  try {
    let data= req.body

    // Creating the author document in DB

    let save = await authormodel.create(data);  

    res.status(201).send({ status: true, data: save });  

  } catch (error) {
    console.log(error)
    res.status(500).send({ status: false, msg: error.message });
  }
};

const loginAuthor= async function(req,res){
  try{
    let data = req.body

    // Checks whether body is empty or not
    if (Object.keys(data).length == 0)return res.status(400).send({ status: false, msg: "Body cannot be empty"});

    // Checks whether email is entered or not
    if (!data.email) return res.status(400).send({ status: false, msg: "Please enter E-mail"});
    let userEmail= data.email

     // Checks whether password is entered or not
    if (!data.password) return res.status(400).send({ status: false, msg: "Please enter Password" }); 
    let userPassword= data.password

    //Checks if the email or password is correct
    let checkCred= await authormodel.findOne({email: userEmail,password:userPassword})
    if(!checkCred) return res.status(400).send({status:false, msg:"Email or password is incorrect"})

    //Creating token if e-mail and password is correct
    let token= jwt.sign({
      authorId: checkCred._id.toString(),
      batch:"Radon"
    }, "project1-AADI");
    
    //Setting token in response header
    res.setHeader("x-api-key",token)
    res.status(201).send({status:true,data: token})
  }catch (error) {
  res.status(500).send({ status: false, msg: error.message});
  }
}

module.exports = { createauthor,loginAuthor };
