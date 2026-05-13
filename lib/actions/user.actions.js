"use server";

import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

export async function fetchUser(userId) {
  try {
    await connectToDB();

    const user = await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });

    return user || null;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function updateUser({ userId, bio, name, path, username, image }) {
  try {
    await connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true },
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId) {
  try {
    await connectToDB();

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      ],
    });

    if (!threads) {
      return null;
    }

    threads.threads = threads.threads.filter((thread) => thread.author);

    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);

    throw error;
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const validUsers = users.filter((user) => user);

    const isNext = totalUsersCount > skipAmount + validUsers.length;

    return { users: validUsers, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);

    throw error;
  }
}

export async function getActivity(userId) {
  try {
    await connectToDB();

    const userThreads = await Thread.find({
      author: userId,
    });

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies.filter((reply) => reply.author);
  } catch (error) {
    console.error("Error fetching replies: ", error);

    throw error;
  }
}
