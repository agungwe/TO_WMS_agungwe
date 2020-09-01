const db = require("../models/index");
const jwt = require('jsonwebtoken');
const slack = require("../slack/it.slack");
const { sequelize } = require("../models/index");
const User = db.users;
const Product = db.products;
const Op = db.Sequelize.Op;
var nodemailer = require('nodemailer');
require("dotenv").config()

//post
exports.create = (req, res) => {

    var user = (jwt.verify(req.headers.token, process.env.SECRET_JWT));
    console.log("user "+user.id);
    
    //Validate request
    if (!req.body.name) {
        res.status(400).send(
            {
                message: "Content can not be empty"
            }
        );
        return;
    }
    //Create order
    const product = {
        name: req.body.name,
        stock: req.body.stock,
        price: req.body.price
    }
    Product.create(product)
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 
                "some error occured while creating the product"
            })
        });
    
    
    //slack.sendMessage("agungw","tik","Nama : "+order.nama +" | Harga (Rp) : "+order.harga);
};


//PUT Data Order
exports.updateProduct = async (req, res) => {
    const id = req.params.id;

    try {
        if (!req.params) {
            res.send({
                status: false,
                message: 'No Id selected'
            });
        } else {
            //get data that have been submitted
            var name      = req.param('name');
            var stock     = req.param('stock'); 
            var price     = req.param('price'); 

            Product.update({
                name: name,
                stock: stock,
                price: price
            }, {
                where: { id: id }
            }).then((result) => {
                if (result == 1) {
                    res.send({
                        status: true,
                        message: 
                        'Sukses!! Data Product berhasil di Update.'
                    });
                } else {
                    res.send({
                        message: 
                        `Cannot update Product with id = ${id}`
                    })
                }
            }).catch((err) => {
                res.status(500).send({
                    message: `Error updating Order id = ${id}`
                })
            })

        }
    } catch (err) {
        res.status(500).send(err);
    }
};


//Query cari data productId
exports.getProductById = function (req,res){
    Product.findByPk(req.params.id,{
                        attributes:['name','stock','price'],
                        include:[{
                            model:User,
                            as:'suplier',
                            attributes:['id','full_name','username','email','phone_number']
                        }]
                    })
           .then((products)=>{
            let prod = JSON.parse(JSON.stringify(products, null, 4))
            const data = {
                name: prod.name,
                stock: prod.stock,
                price: prod.price,
                suplier:prod.suplier
            }
               res.send({
                message:"succes get data",
                status: "success",
                data:data
               })
            
           })
}

exports.getProductAll = function (req,res){
    const pagination = parseInt(req.params.pagination)
    const limit      = parseInt(req.params.limit)
    const offset     =  limit-(limit/pagination)

    Product.findAll({attributes:['name','stock','price'],
                    include:[{
                        model:User,
                        as:'suplier',
                        attributes:['id','full_name','username','email','phone_number']
                    }],
                    offset:offset,limit:limit})
            .then((products)=>{
                let data = []
                for (const key in products) {
                    if (products.hasOwnProperty(key)) {
                        const prod = products[key];
                       let isi = {
                            name: prod.name,
                            stock: prod.stock,
                            price: prod.price,
                            suplier:prod.suplier
                        }
                        data.push(isi)
                    }
                }
                res.send({
                    message:"succes get data",
                    status: "success",
                    data:data,
                    totalItems:data.length,
                    totalpages:parseInt(data.length/offset)?  parseInt(data.length/offset) : 1,
                    currentpage:pagination
                   })
            })
}

exports.delete = async function(req,res){
    const productId = req.params.id
     Product.destroy({where:{id:productId}})
              .then( (data)=>{
                  res.send({
                      status:"success",
                      message:`success delete product with primary key : ${productId}`
                  })
              })

}