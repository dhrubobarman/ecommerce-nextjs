import clientPromise from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handleCrateProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await mongooseConnect();

  if (method === "POST") {
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
      res.status(403).json({
        error: "Please fill all the values",
      });
      return;
    }
    const productDoc = await Product.create({
      title,
      description,
      price: Number(price),
    });
    if (!productDoc) {
      res.status(424).json({
        error: "Please fill all the values",
      });
      return;
    }
    res
      .status(200)
      .json({ data: productDoc, message: "Product Created Successfully" });
  }
}
