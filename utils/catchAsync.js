// eslint-disable-next-line arrow-body-style
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
