import mongoose from "mongoose";
import Class from "../models/classModel.js";
import User from "../models/userModel.js"
import Grade from "../models/GradeModel.js";
import catchAsync from '../utils/catchAsync.js'

const getGrade = catchAsync(async (req, res, next) => {
  const grade = await Grade.findById(req.body.id)
  const _class = await Class.findOne({ grade: req.body.id })

  const studentList = []
  for (let i of grade.grades) {
    const student = await User.findOne({ id: i.studentId })
    student && student.class.includes(_class._id.toString()) ? studentList.push({ ...i, _id: student._id }) : studentList.push({ ...i, _id: '' })
  }

  grade.grades = studentList
  grade.save()

  res.status(200).json({
    status: 'success',
    value: grade
  });
});

const getGradeByStudentId = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.body.id)
  const grade = await Grade.findById(req.body.grade_id)


  const gradeStructure = []
  for(let i of grade.structure){
    if(i._public) gradeStructure.push(i)
  }

  let _grade={}
  for(let i of grade.grades){
    if(i.studentId === user.id){
      _grade = i   
    }
  }

  res.status(200).json({
    status: 'success',
    gradeStructure,
    grade: _grade
  });
});

const addStructure = catchAsync(async (req, res, next) => {
  const grade = await Grade.findById(req.body.id)
  let scaleSum = Number(req.body.value.scale)
  for (let i of grade.structure) {
    if (i.name === req.body.value.name) {
      return res.status(200).json({
        status: 'failed',
        value: "The name already exists"
      });
    }
    scaleSum += Number(i.scale)
    if (scaleSum > 100) {
      return res.status(200).json({
        status: 'failed',
        value: "The total scale value exceeds 100%"
      });
    }
  }

  const newGrade = []
  for (let item of grade.grades) {
    newGrade.push({ ...item, grade: { ...item.grade, [req.body.value.name]: '0' } })
  }

  grade.structure.push(req.body.value)
  grade.grades = newGrade
  grade.save()

  res.status(200).json({
    status: 'success',
    value: grade
  });
});

const editStructure = catchAsync(async (req, res, next) => {
  let grade = await Grade.findById(req.body.id)

  const nameSet = new Set();
  let scaleTotal = 0;

  for (const item of req.body.value) {
    if (nameSet.has(item.name)) {
      return res.status(200).json({
        status: 'failed',
        value: 'There are two identical values for the name'
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
      value: 'The total scale value exceeds 100%'
    });
  }

  // let newGrade = []
  // let nameList = Array.from(nameSet)
  // for (let item of grade.grades) {
  //   let gradeObject = {}
  //   for (let n of nameList) {
  //     gradeObject[n] = item.grade[n] || '0'
  //   }
  //   newGrade.push({ ...item, grade: gradeObject })
  // }

  let newGrade = grade.grades.map(item => ({
    ...item,
    grade: Array.from(nameSet).reduce((acc, n) => ({ ...acc, [n]: item.grade[n] || '0' }), {})
  }));

  grade.structure = req.body.value
  grade.grades = newGrade
  grade.save()

  res.status(200).json({
    status: 'success',
    value: grade
  });
});

const updateStudentList = catchAsync(async (req, res, next) => {
  const _class = await Class.findOne({ grade: req.body.id })
  const grade = await Grade.findById(req.body.id)
  const listId = req.body.value.map(value => value.studentId)
  const listName = req.body.value.map(value => value.fullname)

  const studentList = []
  for (let i of grade.grades) {
    if (listId.includes(i.studentId)) {
      const student = await User.findOne({ id: i.studentId })
      student && student.class.includes(_class._id.toString()) ? studentList.push({ ...i, _id: student._id, fullname: listName[listId.indexOf(i.studentId)] }) : studentList.push({ ...i, fullname: listName[listId.indexOf(i.studentId)] })
      listName.splice(listId.indexOf(i.studentId), 1)
      listId.splice(listId.indexOf(i.studentId), 1)
    }
  }

  let _grade = {}
  for (let i of grade.structure) {
    _grade = { ..._grade, [i.name]: "0" }
  }

  for (let i of req.body.value) {
    if (listId.includes(i.studentId)) {
      const student = await User.findOne({ id: i.studentId })
      student && student.class.includes(_class._id.toString()) ? studentList.push({ ...i, _id: student._id, grade: _grade }) : studentList.push({ ...i, grade: _grade })
      listId.splice(listId.indexOf(i.studentId), 1)
    }
  }

  grade.grades = studentList
  grade.save()

  res.status(200).json({
    status: 'success',
    value: grade.grades
  });
});

const editGrades = catchAsync(async (req, res, next) => {
  let grade = await Grade.findById(req.body.id)

  function isFloatingPointInRange(value) {
    const regex = /^(\d+(\.\d{1,2})?)$/;

    return regex.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 10;
  }

  function isGradeInRange(grade) {
    for (let key in grade) {
      const value = grade[key].replace(',', '.');
      if (!isFloatingPointInRange(value)) {
        return false;
      }
    }
    return true;
  }

  const result = req.body.value.every(item => isGradeInRange(item.grade));
  if (!result) {
    return res.status(200).json({
      status: 'failed',
      value: "It contains invalid data"
    });
  }

  grade.grades = req.body.value
  grade.save()

  res.status(200).json({
    status: 'success',
    value: grade.grades
  });
});



export default { getGrade, addStructure, editGrades, editStructure, updateStudentList,getGradeByStudentId }