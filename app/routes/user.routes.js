module.exports = app => {
    const users = require("../controllers/user.controller")

    let router = require("express").Router()

    //create new post
    router.post("/signup", users.signup)
    router.post("/signin", users.signin)
    //Pencarian per Id dari tabel
    router.get("/cari/:id", users.getId );
    //Cari user Id n Delete
    router.delete("/hapus/:id", users.deleteUser);
    //pagiation
    router.get("/all/:limit/:pagination", users.getAll)

    app.use("/api/v1/user",router)
}