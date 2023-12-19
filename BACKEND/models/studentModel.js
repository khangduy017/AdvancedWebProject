import mongoose, { Mongoose } from "mongoose";

const studentSchema = new mongoose.Schema({
  id: String,
  fullname: String,
});

studentSchema.index(
  {
      id: 'text',
      fullname: 'text',
  },
  { default_language: 'none' }
);

const Student = mongoose.model('students', studentSchema);

export default Student;