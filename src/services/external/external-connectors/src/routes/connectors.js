const connectorsRouter = require("express").Router();
const { getDHLproducts, getMSCproducts } = require("../handlers");

connectorsRouter.get("/dhl", getDHLproducts);
connectorsRouter.get("/msc", getMSCproducts);

module.exports = connectorsRouter;
