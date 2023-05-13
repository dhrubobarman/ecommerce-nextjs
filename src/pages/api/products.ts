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

  // Create new product
  if (method === "POST") {
    const { title, description, price, photos } = req.body;
    if (!title || !description || !price) {
      res.status(400).json({
        error: "Please fill all the values",
      });
      return;
    }
    const productDoc = await Product.create({
      title,
      description,
      price: Number(price),
      photos,
    });
    if (!productDoc) {
      res.status(400).json({
        error: "Please fill all the values",
      });
      return;
    }
    res
      .status(200)
      .json({ data: productDoc, message: "Product Created Successfully" });
  }

  // Get Single Product or all the products
  if (method === "GET") {
    if (req.query?.id) {
      const product = await Product.findOne({ _id: req.query.id });
      if (!product) {
        res.status(400).json({
          error: `Product not found with id: ${req.query.id}`,
        });
        return;
      }
      const newProduct = {
        title: product.title,
        description: product.description,
        price: product.price,
        photos: product.photos,
        _id: product._id,
      };

      res.status(200).json({ ...newProduct });
    } else {
      res.json(await Product.find());
    }
  }

  // update Product
  if (method === "PUT") {
    const { title, description, price, _id, photos } = req.body;
    const product = await Product.findOne({ _id });
    if (!product) {
      res.status(404).json({
        error: `Product not found with id: ${_id}`,
      });
      return;
    }
    product.title = title;
    product.description = description;
    product.price = price;
    product.photos = photos;
    await product.save();
    res.status(200).json(product);
  }

  // delete product
  if (method === "DELETE") {
    const id = req.query.id;
    if (!id) {
      res.status(404).json({
        error: `Please provide a valid id`,
      });
      return;
    }
    await Product.findByIdAndDelete(id);
    const products = await Product.find();
    res.status(200).json([...products]);
  }
}
