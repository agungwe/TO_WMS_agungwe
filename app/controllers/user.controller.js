var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

const db = require('../models/index');
const { random } = require('lodash');
const { token } = require('morgan');
const User = db.users

//register
exports.signup = function (req,res) {
    //Validate Request
    if (!req.body.email || !req.body.password) {
        res.status(400).send(
            {
                message: "Content cannot be empty"
            }
        )
        return
    }

    //Create User
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(req.body.password,salt)
    
    const user = {
        full_name   : req.body.full_name,
        username    : req.body.username,
        email       : req.body.email,
        password    : hash,
        phone_number: req.body.email
    }

    User.create(user)
        .then((data) =>{
            res.send(data)
        }).catch((err)=>{
            res.status(500).send({
                message : err.message || "some error occured"
            })
        })
};

//Login
exports.signin = function (req, res) {
    var username   = req.body.username;
    var pass       = req.body.password;

    User.findOne({ where: { username: username} })
        .then((data) => {
            var hasil = bcrypt.compareSync(pass, data.password);
            console.log(hasil);

            if (hasil == true){

                var secret = "TEXT SECRET LETAK KAN DI ENV";
                var expiresIn = "30 days";

                jwt.sign({ id: data.id}, secret, { algorithm: 'HS256', expiresIn: expiresIn},
                    function (err, token) {

                    if (err) {
                        res.json({
                            "results":
                            {
                                "status": false,
                                "msg": 'Error occured while generating token'
                            }
                        });
                    } else {
                        if (token != false) {
                            res.header();
                            res.json({
                                "results":
                                {
                                    "status": true,
                                    "token": token,
                                    "user":{
                                            id: data.id
                                         }
                                    }
                                });
                                    res.end();   
                                }
                                else {
                                    res.json({
                                        "results": 
                                        {
                                            "status": false,
                                            "msg": 'Could not create token'}    
                                    });
                                    res.end();
                                }
                            }
                        });
                } else {
                    res.send({
                        message: "Email atau Password Anda Salah!!"
                    });
                }
            
        }).catch((err) => {
            res.status(500).send({
                message: "Error retrieving post with id =" + id
            });
        });
};

//Retrieve One
exports.getId = function (req, res) {
    User.findByPk(req.params.id) 
        .then((data) => {
            res.send({message:"Succes get data",
                      status: "Success",
                      data:data
                    });
        //response.ok(data,res)
        })
        .catch((err) => {
            res.send({error:err});
    });
};

//Hapus User per ID
exports.deleteUser = async function(req,res){

    const user_id = req.params.id

    User.destroy({where:{id:user_id_delete}})
              .then( (data)=>{
                  res.send({
                      status:"Success",
                      message:`success delete user with primary key : ${user_id}`
                  })
              })

}

//Ambil semua data
exports.getAll = function (req, res) {
    
    const pagination = parseInt(req.params.pagination)
    const limit      = parseInt(req.params.limit)
    const offset     =  limit-(limit/pagination)

    User.findAll({offset:offset,limit:limit}) 
        .then((data) => {
            res.send({message:"Succes get data",
                      status: "Success",
                      data:{data:data},
                      totalItems:data.length,
                      totalpages:parseInt(data.length/offset)?  parseInt(data.length/offset) : 1,
                      currentpage:pagination
                    });
        })
        .catch((err) => {
            res.send({error:err});
    });
};




