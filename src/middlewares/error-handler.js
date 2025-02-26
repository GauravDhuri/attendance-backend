module.exports = async (err, req, res, _next) => {
  console.log(err);
  res.status(500).send({
    status: false,
    message: "INVALID_REQUEST",
    data: "Something went wrong"
  });
}