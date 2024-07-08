const { _getMSCproducts } = require("../controllers/_getMSCproducts");

const getMSCproducts = async (req, res) => {
  const apiKey = req.headers["msc-api-key"];

  // if (!apiKey) {
  //   return res.status(400).json({
  //     error: true,
  //     message: "API key is missing from headers",
  //   });
  // }

  try {
    const allProducts = await _getMSCproducts();

    res.status(201).json({
      message: "The Products were obtained successfully",
      products: allProducts,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message || "Unknown error",
    });
  }
};

module.exports = {
  getMSCproducts,
};
