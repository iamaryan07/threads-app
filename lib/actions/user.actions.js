"use server";

import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
// import { Select } from "radix-ui";

export async function updateUser({ userId, username, name, bio, image, path }) {
  await connectToDB();

  try {
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

export async function fetchUser(userId) {
  try {
    await connectToDB();

    return await User.findOne({ id: userId });
    //   .populate({
    //   path: "communities",
    //   model: "Community",
    // });
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId) {
  try {
    await connectToDB();

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return threads;
  } catch (error) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString,
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
        {
          username: { $regex: regex },
        },
        {
          name: { $regex: regex },
        },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await userQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId) {
  try {
    await connectToDB();

    const userThreads = await Thread.find({ author: userId });

    const childThreads = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreads },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    throw new Error(`Failed to fetch activity: ${error.message}`);
  }
}
