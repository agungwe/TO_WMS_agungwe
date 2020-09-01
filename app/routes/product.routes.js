module.exports = app => {
    const auth  = require('../middleware/auth');
    const products = require("../controllers/product.controller");
    //const cron_order = require("../cron/cron_slack_order");

    let router = 
    require("express").Router();

    //create a new order
    router.post("/", products.create);
    //cari per id
    router.get("/:id", products.getProductById)
    //Pencarian semua data dari tabel
    router.get("/all/:limit/:pagination", products.getProductAll)
    //Update Data
    router.put("/:id", products.updateProduct)
    //Hapus Data
    router.delete("/:id", products.delete)

    app.use("/api/v1/product", auth.isAuth,router);
}