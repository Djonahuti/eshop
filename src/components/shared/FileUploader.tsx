import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

//import { convertFileToUrl } from "@/lib/utils";
import { Button } from "../ui/button";
import { storage } from "@/lib/appwrite";
import { ID } from "appwrite";

const SB_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const uploadFileToStorage = async (file) => {
    const response = await storage.createFile(SB_ID, ID.unique(), file); 
    return storage.getFilePreview(SB_ID, response.$id); // ✅ Return the file URL
  };

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
  
      try {
        const fileUrl = await uploadFileToStorage(file); // ✅ Upload and get URL
        setFile([file]); 
        setFileUrl(fileUrl);
        fieldChange(fileUrl); // ✅ Pass only URL, not File object
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
      'video/*': ['.mp4', '.m4v', '.x-m4v', '.avi', '.mov', '.webm', '.avchd', '.wmv']
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col mine-dark rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box ">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="base-medium text-light-2 mb-2 mt-6">
          Drag and drop files here, or click to select files
          </h3>
          <p className="text-light-4 small-regular mb-6">MP4, PNG, JPG, WAV, AVI, SVG</p>

          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
