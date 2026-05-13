"use server";

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

export async function createThread({ text, author, communityId, path }) {
  await connectToDB();

  console.log(author);

  const user = await User.findById(author);

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const createdThread = await Thread.create({
      text,
      author,
      communityId: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Failed to thread: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const postQuery = Thread.find({ parentId: null })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      // .populate({
      //   path: "community",
      //   model: Community,
      // })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id id name parentId image",
        },
      });

    const totalPostCount = await Thread.countDocuments({
      parentId: null,
    });

    const posts = await postQuery.exec();

    const isNext = totalPostCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
}

export async function fetchThreadById(id) {
  try {
    await connectToDB();

    // POPULATE COMMUNITY
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error) {
    throw new Error(`Error fetching thread: ${error.message}`);
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}) {
  try {
    await connectToDB();

    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not Found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
}
