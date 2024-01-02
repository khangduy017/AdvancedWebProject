import mongoose from 'mongoose';
import Class from '../models/classModel.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';
import catchAsync from '../utils/catchAsync.js';
import sendMail from '../utils/mailer.js';

const createPost = catchAsync(async (req, res, next) => {
    const newPost = await Post.create({
        creator: req.body.username,
        title: req.body.title,
        content: req.body.content,
        classId: req.body.classId,
    });

    let posts = await Post.find({ classId: req.body.classId });

    let allPosts = [];

    for (let i = 0; i < posts.length; i++) {
        allPosts.push(posts[i].toObject());
        const cmt = await Comment.find({ postId: allPosts[i]._id.toString() });
        if (cmt.length !== 0) {
            allPosts[i].comment = cmt;
        }
    }

    res.status(200).json({
        status: 'success',
        value: allPosts.reverse(),
    });
});

const getAllPosts = catchAsync(async (req, res, next) => {
    let posts = await Post.find({ classId: req.params.id });

    let allPosts = [];

    for (let i = 0; i < posts.length; i++) {
        allPosts.push(posts[i].toObject());
        const cmt = await Comment.find({ postId: allPosts[i]._id.toString() });
        if (cmt.length !== 0) {
            allPosts[i].comment = cmt;
        }
    }

    res.status(200).json({
        status: 'success',
        value: allPosts.reverse(),
    });
});

const createComment = catchAsync(async (req, res, next) => {
    const newCmt = await Comment.create({
        creator: req.body.creator,
        postId: req.body.postId,
        content: req.body.content,
    });

    let posts = await Post.find({ classId: req.body.classId });

    let allPosts = [];

    for (let i = 0; i < posts.length; i++) {
        allPosts.push(posts[i].toObject());
        const cmt = await Comment.find({ postId: allPosts[i]._id.toString() });
        if (cmt.length !== 0) {
            allPosts[i].comment = cmt;
        }
    }

    res.status(200).json({
        status: 'success',
        value: allPosts.reverse(),
    });
});

export default { createPost, getAllPosts, createComment };
