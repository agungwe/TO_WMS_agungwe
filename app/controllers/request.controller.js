const db = require("../models/index");

const Request = db.requests;

exports.createRequest = function (req, res) {

    //Validate request
    if(!req.body.date || !req.body.total) {
        res.status(400).send(
            {
                message: "can not be empty"
            }
        );
        return;
    }

    const request = {
        productId: req.body.productId,
        date: req.body.date,
        total: req.body.total,
        userId: req.body.userId,
    }

    Request.create(request) // Insert into users
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message ||
                    "Some error occured while creating the Request"
            })
        });
    
};



//Query cari data requestId
exports.findProductByRequestId = function (req, res) {
    console.log(req.params.requestId);
    
    Product.findByPk(
        
        req.params.requestId, 
        { 
            attributes: ['id', 'date','total'],
            include: [{
                model: Product,
                attributes: ['name','stock','price'],
                include: [{
                    model: User,
                    attributes: ['id','full_name','username','email','phone_number']
                }]
            }]
        }
    ).then((data) => {  
            res.send(data);
        //response.ok(data,res)
        })
        .catch((err) => {
            console.log(">> Error while finding tutorial: ", err);
    });
};