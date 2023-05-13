import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Fab,
  Checkbox,
} from "@mui/material";
import type { PaperProps } from "@mui/material/Paper";
import React, { FC } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { UploadFiles } from ".";
import Image from "next/image";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { axiosInstance, asyncPromise, customToastContext } from "@/lib";

export interface productFromValueInterface {
  title: string;
  description: string;
  price: string;
  photos: string[];
}

interface newProps extends PaperProps {
  values: productFromValueInterface;
  setValues: any;
  onFormSubmit(
    e: React.FormEvent<HTMLFormElement> | null,
    data: productFromValueInterface | null
  ): void;
  loading: boolean;
  head?: string | React.ReactElement;
  uploadPhotosDirectly?: boolean;
}

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

const ProductForm: FC<newProps> = ({
  values,
  setValues,
  onFormSubmit,
  loading,
  sx,
  head = "New Product",
  uploadPhotosDirectly = false,
  ...others
}) => {
  const [_, setToastConfig] = customToastContext();
  const onValueChannge = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setValues((prev: any) => ({ ...prev, [e.target.name]: value }));
  };
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);

  const deletePhoto = async (imageData: string[]) => {
    const [response, error] = await asyncPromise(
      axiosInstance().put("/api/deletefile", { files: imageData })
    );
    if (error) {
      setToastConfig(error);
    }
    if (response) {
      console.log(response?.data);
      setToastConfig({
        open: true,
        type: "success",
        message: "Image deleted",
      });
      const newImages: string[] = [];
      for (let index = 0; index < values.photos.length; index++) {
        const image = values.photos[index];
        const present = [...selectedImages].includes(image);
        if (!present) newImages.push(image);
      }

      const newValues = { ...values, photos: newImages };
      setValues(newValues);
      if (onFormSubmit) {
        onFormSubmit(null, newValues);
      }
    }
  };

  const checkBoxOnClick = React.useCallback(
    (image: string) => {
      const prevImages = [...selectedImages];
      const isPresent = prevImages.findIndex((i) => i === image) !== -1;
      if (isPresent) {
        const newList = prevImages.filter((i) => i !== image);
        setSelectedImages(newList);
      } else {
        setSelectedImages((prev) => [...prev, image]);
      }
    },
    [selectedImages]
  );

  const isCheckboxChecked = React.useCallback(
    (image: string) => {
      return selectedImages.some((i) => i === image);
    },
    [selectedImages]
  );

  return (
    <Paper sx={{ p: 3, ...sx }} className="w-full grid gap-5" {...others}>
      <form onSubmit={(e) => onFormSubmit(e, null)}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {head}
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
          sx={{ mb: 2 }}
          required
        />
        {!values?.photos && (
          <Typography sx={{ mb: 2 }}>No image in this product</Typography>
        )}
        {values?.photos?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            {values?.photos?.map((image, index) => (
              <Box
                className={`relative group cursor-pointer`}
                key={image}
                onClick={() => checkBoxOnClick(image)}
              >
                <Checkbox
                  aria-label="select image"
                  onChange={() => checkBoxOnClick(image)}
                  checked={isCheckboxChecked(image)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    transition:
                      "opacity .3s, background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                  }}
                />

                <Image
                  src={image}
                  alt={`Product image ${index}`}
                  width={100}
                  height={100}
                  className="w-[100px] h-[100px] object-cover border border-[1px solid gray] rounded-md overflow-hidden"
                  loading="lazy"
                />
              </Box>
            ))}
            {selectedImages.length > 0 && (
              <Box>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => deletePhoto(selectedImages)}
                  sx={{
                    display: "block",
                  }}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        <UploadFiles
          onUpload={(data) => {
            const newValues = { ...values, photos: data };
            setValues(newValues);
            if (onFormSubmit) {
              onFormSubmit(null, newValues);
            }
          }}
          uploadFilesDirectly={uploadPhotosDirectly}
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
          sx={{ mb: 2 }}
          required
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
          sx={{ mb: 2 }}
          required
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
      </form>
    </Paper>
  );
};

export default ProductForm;
