module.exports = async (req, res, next) => {
  try {
    next();
  } catch (error) {
    return res.status(401).send({
      status: false,
      data: error.message || error
    });
  }
};
