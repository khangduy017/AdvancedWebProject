import catchAsync from "../utils/catchAsync.js"

const getTest = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
  })
})

export { getTest }