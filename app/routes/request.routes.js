module.exports = app => {
    const requests = require("../controllers/request.controller");

    let router = require("express").Router();

    //create a new Order
    router.post("/", requests.createRequest);

    router.get("/request/:requestId", requests.findProductByRequestId );

    app.use("/api/v1/request", router);
}