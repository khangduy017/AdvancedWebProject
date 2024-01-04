import fs from 'fs'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Class from '../../models/classModel.js'
import Comment from '../../models/commentModel.js'
import Grade from '../../models/gradeModel.js'
import Notification from '../../models/notificationModel.js'
import Post from '../../models/postModel.js'
import ReviewComment from '../../models/reviewCommentModel.js'
import Review from '../../models/reviewModel.js'
import Student from '../../models/studentModel.js'
import User from '../../models/userModel.js';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('Connected to DB successfully');
    console.log('Loading...');
  });

// READ JSON FILE
const classes = JSON.parse(fs.readFileSync(`${__dirname}/classes.json`, 'utf-8'));
const comments = JSON.parse(fs.readFileSync(`${__dirname}/comments.json`, 'utf-8'));
const grades = JSON.parse(fs.readFileSync(`${__dirname}/grades.json`, 'utf-8'));
const notifications = JSON.parse(fs.readFileSync(`${__dirname}/notifications.json`, 'utf-8'));
const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, 'utf-8'));
const reviewComments = JSON.parse(fs.readFileSync(`${__dirname}/review-comments.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const students = JSON.parse(fs.readFileSync(`${__dirname}/students.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Class.create(classes, { validateBeforeSave: false });
    await Comment.create(comments, { validateBeforeSave: false });
    await Grade.create(grades, { validateBeforeSave: false });
    await Notification.create(notifications, { validateBeforeSave: false });
    await Post.create(posts, { validateBeforeSave: false });
    await ReviewComment.create(reviewComments, { validateBeforeSave: false });
    await Review.create(reviews, { validateBeforeSave: false });
    await Student.create(students, { validateBeforeSave: false });
    // await User.create(users, { validateBeforeSave: false });
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Class.deleteMany();
    await Comment.deleteMany();
    await Grade.deleteMany();
    await Notification.deleteMany();
    await Post.deleteMany();
    await ReviewComment.deleteMany();
    await Review.deleteMany();
    await Student.deleteMany();
    // await User.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
