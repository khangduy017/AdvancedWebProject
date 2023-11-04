// export default catchAsync = fn => (req, res, next) => {
//   fn(req, res, next).catch(next)
// }

const catchAsync = function (fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export default catchAsync