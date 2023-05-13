import React, { FC, useState } from "react";
import { axiosInstance, asyncPromise, customToastContext } from "@/lib";
import { useRouter } from "next/router";
import { ProductForm } from "@/components";

interface newProps {}

const initialFormValue = {
  title: "",
  description: "",
  price: "",
  photos: [],
};

const NewProduct: FC<newProps> = ({}) => {
  const [_, setToastConfig] = customToastContext();
  const [values, setValues] = useState(initialFormValue);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const [data, error] = await asyncPromise(
      axiosInstance().post("/api/products", values)
    );
    if (data) {
      setToastConfig({
        open: true,
        message: "Product Created",
        type: "success",
      });
      setValues(initialFormValue);
      router.push("/products");
    }
    if (error) {
      setToastConfig(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <ProductForm
        values={values}
        setValues={setValues}
        onFormSubmit={createProduct}
        loading={loading}
        head="New Product"
      />
    </div>
  );
};

export default NewProduct;
