import { useEffect, useState } from "react";
import {
  createNewFile,
  deleteFile,
  getAllFiles,
} from "./utils/services/fileService";
import Dropzone from "./components/Dropzone/Dropzone";

export default function App() {
  const [files, setFiles] = useState<IUserFile[]>([]);

  const handleRemove = (id: string) => {
    deleteFile(id).then(() => {
      const fileIndex = files
        .filter((e) => e.status === "Done")
        .findIndex((e) => e.id === id);

      setFiles((prevFiles) => {
        const uploadFiles = [...prevFiles];
        uploadFiles.splice(fileIndex, 1);

        return uploadFiles;
      });
    });
  };

  const loadFiles = () => {
    getAllFiles().then((result) => {
      const list = result.data;

      setFiles(
        list.map((e) => ({
          id: e.id,
          name: e.name,
          size: e.size,
          status: "Done",
          type: e.type,
        })) as IUserFile[]
      );
    });
  };

  const handleUpload = (file: IUserFile, index: number) => {
    createNewFile(file.file as File, {
      onUploadProgress: (event) => {
        const progress = Math.round(
          ((event.loaded as number) * 100) / (event.total as number)
        );

        setFiles((prevFiles) => {
          const uploadedFiles = [...prevFiles];
          uploadedFiles[index].percent = progress;

          return uploadedFiles;
        });
      },
    })
      .then((result) => {
        const {
          data: { id },
        } = result.data;

        setFiles((prevFiles) => {
          const uploadedFiles = [...prevFiles];
          uploadedFiles[index].status = "Done";
          uploadedFiles[index].id = id;

          return uploadedFiles;
        });
      })
      .catch(() => {
        setFiles((prevFiles) => {
          const uploadedFiles = [...prevFiles];
          uploadedFiles[index].status = "Error";

          return uploadedFiles;
        });
      });
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="w-full h-screen max-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 p-4">
        <Dropzone
          files={files}
          onChange={setFiles}
          onUpload={handleUpload}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}
