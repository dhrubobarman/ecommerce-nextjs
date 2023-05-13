import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { axiosInstance, asyncPromise, customToastContext } from "@/lib";
import { ProductForm, productFromValueInterface } from "@/components";

interface productInterface extends productFromValueInterface {
  _id: string;
}

const EditProductPage = () => {
  const [_, setToastConfig] = customToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [productInfo, setProductInfo] = useState<productInterface | null>(null);
  const router = useRouter();
  const { id } = router.query;

  const getProductDetails = async (id: any) => {
    if (!id) return;
    const [response, error] = await asyncPromise(
      axiosInstance().get(`/api/products?id=${id}`)
    );
    if (response) {
      setProductInfo(response.data);
    }
    if (error) {
      setToastConfig(error);
    }
  };

  const updateProduct = async (
    e: React.FormEvent<HTMLFormElement> | null,
    data: any = null
  ) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    const [response, error] = await asyncPromise(
      axiosInstance().put(
        `/api/products?id=${productInfo?._id}`,
        data ? data : productInfo
      )
    );
    if (response) {
      setToastConfig({
        open: true,
        message: `Product updated`,
        type: "success",
      });
      if (!data) router.push("/products");
    }
    if (error) {
      setToastConfig(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getProductDetails(id);
  }, [id]);

  return (
    <div>
      {productInfo ? (
        <ProductForm
          values={productInfo}
          setValues={setProductInfo}
          onFormSubmit={updateProduct}
          loading={isLoading}
          head="Edit Product"
          uploadPhotosDirectly={true}
        />
      ) : null}
    </div>
  );
};

export default EditProductPage;
