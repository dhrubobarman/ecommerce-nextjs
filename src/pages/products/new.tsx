import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { FC, useState } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import axios from "axios";
import { customToastContext } from "@/lib/CustomToastContext";
import { axiosInstance, errorInterface } from "@/lib/axios";

interface newProps {}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$ "
      />
    );
  }
);

const initialFormValue = {
  title: "",
  description: "",
  price: "",
};

const NewProduct: FC<newProps> = ({}) => {
  const [toastConfig, setToastConfig] = customToastContext();
  const [values, setValues] = useState(initialFormValue);
  const [loading, setLoading] = useState(false);

  console.log(toastConfig);

  const onValueChannge = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const createProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance().post("/api/products", values);
      setToastConfig({
        open: true,
        message: "Submitted Successfully",
        type: "success",
      });
      setValues(initialFormValue);
    } catch (error) {
      setToastConfig(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Paper
        sx={{ p: 3 }}
        className="w-full grid gap-5"
        component={"form"}
        onSubmit={createProduct}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          New Product
        </Typography>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Product Name"
          variant="outlined"
          size="small"
          name="title"
          value={values.title}
          onChange={onValueChannge}
        />
        <TextField
          fullWidth
          id="outlined-basic"
          label="Description"
          variant="outlined"
          size="small"
          multiline
          rows={4}
          name="description"
          value={values.description}
          onChange={onValueChannge}
        />
        <TextField
          fullWidth
          id="outlined-basic"
          label="Price in (USD)"
          variant="outlined"
          size="small"
          name="price"
          value={values.price}
          onChange={onValueChannge}
          InputProps={{
            inputComponent: NumericFormatCustom as any,
          }}
        />
        <Box>
          <Button
            type="submit"
            variant="contained"
            color={"inherit"}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={18} /> : <SaveOutlinedIcon />
            }
          >
            Save
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default NewProduct;
