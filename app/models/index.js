const dbConfig = require("../config/db.config")
const Sequelize= require("sequelize")

const sequelize =
new  Sequelize(
        dbConfig.DB,
        dbConfig.USER,
        dbConfig.PASSWORD,{
            host: dbConfig.HOST,
            dialect: dbConfig.dialect,
            operatorAliases: false,
            pool : {
                max: dbConfig.pool.max,
                min: dbConfig.pool.min,
                acquire: dbConfig.pool.min,
                idle:dbConfig.pool.min
            }
        }
    )

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

// create table
db.products = require("./product.model")(sequelize,Sequelize)
db.users = require("./user.model")(sequelize,Sequelize)
db.requests = require("./request.model")(sequelize,Sequelize)

//relation tabel User - Request
db.users.hasMany(db.requests);

db.requests.belongsTo(db.users, { 
    foreignKey: "userId"
});

db.products.hasMany(db.requests);

db.requests.belongsTo(db.products, { 
    foreignKey: "productId"
});


module.exports = db