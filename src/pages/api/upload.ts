import { NextApiRequest, NextApiResponse } from "next";
import multiParty from "multiparty";
import cloudinary from "cloudinary";
import { v4 as uuidv4 } from "uuid";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const readFile = (
  req: NextApiRequest
): Promise<{ fields: any; files: any }> => {
  const form = new multiParty.Form();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  if (method === "POST") {
    const { files, fields } = await readFile(req);

    if (!files || files.file?.length === 0) {
      res.status(400).json({
        error: "No file uploaded",
      });
      return;
    }

    const fileUrls: string[] = [];
    for (const file of files.file) {
      const filePath = file.path;
      const fileName = uuidv4();
      const result = await cloudinary.v2.uploader.upload(filePath, {
        folder: "next-ecommerce",
        public_id: fileName,
        resource_type: "auto",
      });
      fileUrls.push(result.secure_url);
    }

    res.json([...fileUrls]);
    return;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
