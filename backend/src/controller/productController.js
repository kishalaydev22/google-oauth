const Product = require("../model/Product");
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    const product = await Product.create({
      user: req.user._doc._doc_id,
      title,
      description,
      price,
      image,
    });
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          description,
          price,
          image,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
