import mongoose, { Mongoose } from "mongoose";

const gradeSchema = new mongoose.Schema({
  structure: {
    type: [],
    default: [],
  },
  grades: {
    type: [],
    default: [],
  }
});


const Grade = mongoose.model('grades', gradeSchema);

export default Grade;