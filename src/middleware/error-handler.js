module.exports = () => {
  return function(err, req, res) {
    const { message, stack } = err;
    res.status(500).json({
      message,
      stack
    });
  };
};
