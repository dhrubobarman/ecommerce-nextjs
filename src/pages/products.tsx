import { Button } from "@mui/material";
import Link from "next/link";
import React, { FC } from "react";
import AddIcon from "@mui/icons-material/Add";

interface productsProps {}

const Products: FC<productsProps> = ({}) => {
  return (
    <div>
      <Link href={"/products/new"} className="text-red">
        <Button variant="contained" color="inherit" startIcon={<AddIcon />}>
          Add Product
        </Button>
      </Link>
    </div>
  );
};

export default Products;
