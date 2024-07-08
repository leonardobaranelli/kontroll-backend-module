const { _getDHLproducts } = require("../controllers/_getDHLproducts");

const getDHLproducts = async (req, res) => {
  const apiKey = req.headers["dhl-api-key"];

  console.log(req.headers);

  // if (!apiKey) {
  //   return res.status(400).json({
  //     error: true,
  //     message: "API key is missing from headers",
  //   });
  // }

  try {
    const allProducts = await _getDHLproducts(apiKey);

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
  getDHLproducts,
};
