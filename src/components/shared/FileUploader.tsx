import {  useState } from "react";

interface FileUploaderProps {
  onUpload: (files: { file: File; url: string }[]) => void;
  accept: string;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload, accept, multiple = false }) => {
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const filesArray = Array.from(event.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviewURLs(filesArray.map((f) => f.url));
    onUpload(filesArray);
  };

  return (
    <div className="flex flex-center flex-col mine-dark rounded-xl cursor-pointer text-center">
      <input type="file" accept={accept} multiple={multiple} onChange={handleFileChange} className="cursor-pointer" />
      <div className="flex flex-1 justify-center w-full p-5 lg:p-10 preview-container">
        {previewURLs.map((src, index) => (
          <img key={index} src={src} alt="Preview" className="preview-image" />
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
