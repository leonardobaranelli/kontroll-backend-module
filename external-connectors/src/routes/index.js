const router = require("express").Router();
const connectorsRouter = require("./connectors");

router.use("/connectors", connectorsRouter);

module.exports = router;
