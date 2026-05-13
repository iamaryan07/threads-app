import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  media: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await currentUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      return {
        userId: user.id,
      };
    })

    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("File URL:", file.url);

      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),
};

export default ourFileRouter;
