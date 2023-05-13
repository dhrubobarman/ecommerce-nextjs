import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";
import { asyncPromise } from "@/lib";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getFileName = (fileName: string) =>
  new URL(fileName).pathname.split("/").pop()?.split(".").shift();

const deleteFile = (files: string[]): Promise<{ result: any }> => {
  return new Promise((resolve, reject) =>
    cloudinary.v2.api.delete_resources(files, function (error, result) {
      if (error) reject(error);
      resolve({ result });
    })
  );
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  if (method === "PUT") {
    const { files } = req.body;

    if (!files || files?.length === 0) {
      res.status(400).json({
        error: "No file received",
      });
      return;
    }

    const filesToDelete = files.map(
      (file: string) => `next-ecommerce/${getFileName(file)}`
    );

    try {
      const response = await deleteFile(filesToDelete);

      res.status(200).json(response);
      return;
    } catch (error) {
      res.status(400).json(error);
      return;
    }
  }
}
