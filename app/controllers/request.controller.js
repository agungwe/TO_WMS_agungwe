var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
const db = require('../models/index')
const Product = db.products
const Request = db.requests
const User = db.users
exports.createProduct = async function (req,res){
    let date_ob = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2)
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
    // current year
    let year = date_ob.getFullYear()
    // current hours
    let hours = date_ob.getHours()
    // current minutes
    let minutes = date_ob.getMinutes()
    // current seconds
    let seconds = date_ob.getSeconds()
    // date & time in YYYY-MM-DD HH:MM:SS format
    let full_date = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

    const dataIn = {
        productId:req.body.product_id,
        date:full_date,
        total:req.body.total
    }

    await Request.create(dataIn)
             .then(async (data)=>{
                Product.findByPk(req.body.product_id,{attributes:['stock']})
                       .then(async (products)=>{
                        let prod = JSON.parse(JSON.stringify(products, null, 4))
                        let stock = prod.stock
                        let total_stock = stock+req.body.total

                   Product.update({stock:total_stock},{where:{id:req.body.product_id}})
                          .then(async (data)=>{
                            let update_prod = JSON.parse(JSON.stringify(data, null, 4))
                            console.log(update_prod)
                            res.send({
                                product_id:req.body.product_id,
                                date:full_date,
                                total_in:req.body.total,
                                total_stock:total_stock
                            })
                          })
                })           
             })
}

exports.getProductById = async function (req,res){
    await Request.findByPk(req.params.req_id,{
                        attributes:['id','date','total'],
                        include:[{
                            model:Product,
                            as:'product',
                            attributes:['name','stock','price'],
                            include:[{
                                model:User,
                                as:'suplier',
                                attributes:['id','full_name','username','email','phone_number']
                            }]
                        }]
                    })
           .then(async (requests)=>{
            let request_in = JSON.parse(JSON.stringify(requests, null, 4))
            const prod ={
                name: prod.product.name,
                stock: prod.product.stock,
                price: prod.product.price,
                suplier:prod.product.suplier
            }
            const data = {
                id: prod.id,
                date: Date(prod.date),
                total: prod.total,
                product:products
            }
               res.send({
                message:"succes get data",
                status: "success",
                data:data
               })
            
           })
}

exports.getProductAll = async function (req,res){

    const pagination = parseInt(req.params.pagination)
    const limit      = parseInt(req.params.limit)
    const offset     =  limit-(limit/pagination)

   await Request.findAll({attributes:['id','date','total'],
                        include:[{
                            model:Product,
                            as:'product',
                            attributes:['name','stock','price'],
                            include:[{
                                model:User,
                                as:'suplier',
                                attributes:['id','full_name','username','email','phone_number']
                            }]
                        }],
                    offset:offset,limit:limit})
            .then(async (products)=>{

                let data = []
                for (const key in products) {
                    if (products.hasOwnProperty(key)) {
                        const prod = products[key];
                        const product_detail ={
                            name: prod.product.name,
                            stock: prod.product.stock,
                            price: prod.product.price,
                            suplier:prod.product.suplier
                        }
                       let detail = {
                                id: prod.id,
                                date: Date(prod.date),
                                total: prod.total,
                                product:product_detail
                        }
                        data.push(detail)
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
