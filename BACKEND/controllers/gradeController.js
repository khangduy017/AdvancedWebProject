import mongoose from "mongoose";
import Class from "../models/classModel.js";
import User from "../models/userModel.js"
import Grade from "../models/GradeModel.js";
import catchAsync from '../utils/catchAsync.js'

const getGrade = catchAsync(async (req, res, next) => {
  const grade = await Grade.findById(req.body.id)

  res.status(200).json({
    status: 'success',
    value: grade
  });
});

const addStructure = catchAsync(async (req, res, next) => {
  const grade = await Grade.findById(req.body.id)
  let scaleSum = Number(req.body.value.scale)
  for (let i of grade.structure) {
    if (i.name === req.body.value.name) {
      return res.status(200).json({
        status: 'failed',
        value: "The name already exists."
      });
    }
    scaleSum += Number(i.scale)
    if (scaleSum > 100) {
      console.log('vao day')
      return res.status(200).json({
        status: 'failed',
        value: "The total scale value of the columns exceeds 100%."
      });
    }
  }

  grade.structure.push(req.body.value)
  grade.save()

  res.status(200).json({
    status: 'success',
    value: req.body.value
  });
});

const editStructure = catchAsync(async (req, res, next) => {
  const grade = await Grade.findById(req.body.id)

  const nameSet = new Set();
  let scaleTotal = 0;

  for (const item of req.body.value) {
    if (nameSet.has(item.name)) {
      return res.status(200).json({
        status: 'failed',
        value: 'There are two identical values for the name.'
      });
    }
    nameSet.add(item.name);

    const scaleValue = parseInt(item.scale, 10);
    if (!isNaN(scaleValue)) {
      scaleTotal += scaleValue;
    }
  }

  if (scaleTotal > 100) {
    return res.status(200).json({
      status: 'failed',
      value: 'The total scale value of the columns exceeds 100%.'
    });
  }

  grade.structure = req.body.value
  grade.save()

  res.status(200).json({
    status: 'success',
    value: req.body.value
  });
});



export default { getGrade, addStructure, editStructure }