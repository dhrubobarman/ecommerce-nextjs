import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Fab,
  Button,
  LinearProgress,
} from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Image from "next/image";
import { axiosInstance, asyncPromise, customToastContext } from "@/lib";
import ClearIcon from "@mui/icons-material/Clear";
import { AxiosProgressEvent } from "axios";

interface uploadFilesInterface
  extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string;
  icon?: string | React.ReactElement;
  fileType?: string;
  onUpload?: (data: string[]) => void;
  uploadFilesDirectly?: boolean;
}

const UploadFiles: React.FC<uploadFilesInterface> = ({
  accept = "image/*",
  title = "upload image",
  id = "raised-button-file-upload",
  text = "Upload Image",
  icon = <FileUploadOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />,
  fileType = "images",
  onUpload = null,
  uploadFilesDirectly = false,
}) => {
  const [_, setToastConfig] = customToastContext();
  const [selectedFiles, setSelectedFiles] = React.useState<string[] | null>(
    null
  );
  const [formData, setFormData] = React.useState<FormData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const uploadFiles = async () => {
    setLoading(true);
    if (!formData) {
      return;
    }
    const [response, error] = await asyncPromise(
      axiosInstance().post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = 0;
          if (total) {
            percent = Math.floor((loaded * 100) / total);
            setUploadProgress(percent);
          }
        },
      })
    );
    if (response) {
      if (onUpload && !uploadFilesDirectly) {
        onUpload(response.data);
      }
      clearFileUrls();
      setToastConfig({
        open: true,
        message: "Images uploaded",
        type: "success",
      });
      return response.data;
    }
    if (error) {
      setToastConfig(error);
    }
    setLoading(false);
  };

  const createFileUrls = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      data.append("file", file);
    }
    setFormData(data);
    const fileUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      fileUrls.push(url);
    }
    setSelectedFiles(fileUrls);
    e.target.value = "";
  };

  const clearFileUrls = () => {
    setFormData(null);
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }
    for (let i = 0; i < selectedFiles.length; i++) {
      const element = selectedFiles[i];
      URL.revokeObjectURL(element);
    }
    setSelectedFiles(null);
  };

  React.useEffect(() => {
    if (uploadFilesDirectly && formData && onUpload) {
      uploadFiles().then((data) => onUpload(data));
    }
  }, [uploadFilesDirectly, formData]);

  return (
    <Box sx={{ mb: 2 }}>
      <Box>
        {selectedFiles ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              mb: 2,
              flexWrap: "wrap",
            }}
            className="relative"
          >
            {selectedFiles.map((item, index) => (
              <Box key={item} className={`relative group`}>
                {loading && (
                  <CircularProgress
                    size={40}
                    sx={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      margin: "auto",
                    }}
                  />
                )}
                <Image
                  src={item}
                  alt={`Product image ${index}`}
                  width={100}
                  height={100}
                  loading="lazy"
                  className={`w-[100px] h-[100px] object-cover border border-[1px solid gray] rounded-md overflow-hidden ${
                    loading ? "opacity-60" : ""
                  }`}
                />
              </Box>
            ))}
            {loading && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress
                  variant="buffer"
                  value={uploadProgress}
                  valueBuffer={calculatebuffer(uploadProgress)}
                />
              </Box>
            )}
            <Box></Box>
          </Box>
        ) : null}
      </Box>
      <input
        accept={accept}
        className="hidden"
        id={id}
        multiple
        type="file"
        placeholder={title}
        onChange={createFileUrls}
      />
      {!selectedFiles ? (
        <label htmlFor={id} title={title}>
          <Fab
            component="span"
            variant="extended"
            color="primary"
            sx={{ mb: 2 }}
            size="small"
          >
            {icon}
            {text}
          </Fab>
        </label>
      ) : (
        !uploadFilesDirectly && (
          <>
            <Button
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={18} />
                ) : (
                  <FileUploadOutlinedIcon />
                )
              }
              onClick={uploadFiles}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              Confirm
            </Button>
            <Button
              variant="contained"
              color={"warning"}
              startIcon={<ClearIcon />}
              onClick={clearFileUrls}
              disabled={loading}
            >
              Cancel
            </Button>
          </>
        )
      )}
    </Box>
  );
};

export default UploadFiles;

function calculatebuffer(progress: number) {
  let buffer = 0;
  if (progress > 100) {
    buffer = 10;
  } else {
    const diff = Math.random() * 5;
    const diff2 = Math.random() * 5;
    buffer = progress + diff + diff2;
  }
  return buffer;
}
