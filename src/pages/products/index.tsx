import React, { FC, useEffect, useState } from "react";

import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import {
  axiosInstance,
  asyncPromise,
  customToastContext,
  CustomModal,
} from "@/lib";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

interface productsProps {}

export interface ProductInterface {
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  __v?: number;
}

const Products: FC<productsProps> = ({}) => {
  const [_, setToastConfig] = customToastContext();
  const [product, setProduct] = useState<ProductInterface[] | null>(null);
  const [modalData, setModalData] = useState<{
    open: boolean;
    _id: string | undefined | null;
  }>({ open: false, _id: null });

  const getProduct = async () => {
    const [response, error] = await asyncPromise(
      axiosInstance().get("/api/products")
    );
    if (response) {
      setProduct(response.data);
    }
    if (error) {
      setToastConfig(error);
    }
  };

  const deleteProduct = async (id: string | undefined | null) => {
    if (!id) return;
    const [response, error] = await asyncPromise(
      axiosInstance().delete(`/api/products?id=${id}`)
    );
    if (response) {
      setProduct(response.data);
      setToastConfig({
        open: true,
        type: "success",
        message: "Product has been deleted",
      });
    }
    if (error) {
      setToastConfig(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div>
      <Link href={"/products/new"} className="text-red">
        <Button variant="contained" color="inherit" startIcon={<AddIcon />}>
          Add Product
        </Button>
      </Link>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product?.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell>
                  <Link href={`/products/edit/${row._id}`}>
                    <Tooltip title={"Edit"} placement="top" arrow>
                      <IconButton color="warning" size="small">
                        <EditNoteOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Link>

                  <Tooltip title={"Delete"} placement="top" arrow>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => setModalData({ open: true, _id: row._id })}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomModal
        open={modalData.open}
        handleClose={() => setModalData({ open: false, _id: null })}
        title={"Confirm"}
        content={"Are you sure you want to delete this product"}
        onConfirm={(e) => deleteProduct(modalData._id)}
      />
    </div>
  );
};

export default Products;
