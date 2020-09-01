module.exports = (sequelize, Sequelize)=>{
    const Request = sequelize.define("request", {

        date:{
            type: Sequelize.INTEGER
        },
        total:{
            type: Sequelize.FLOAT

        }
    });
    
    return Request;
}