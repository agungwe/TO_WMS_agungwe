module.exports = app => {
    const requests = require("../controllers/request.controller");
    const auth = require("../middleware/auth")
    let router = require("express").Router()

    //Simpan Baru
    router.post("/", requests.createProduct)
    //Cari Per Id
    router.get("/:req_id", requests.getProductById)
    //Cari Semua Data per Page
    router.get("/all/:limit/:pagination", requests.getProductAll)

    app.use("/api/v1/request/",auth.isAuth,router)
}