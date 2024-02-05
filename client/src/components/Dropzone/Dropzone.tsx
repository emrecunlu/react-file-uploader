import {
  ChangeEvent,
  DragEvent,
  DragEventHandler,
  useEffect,
  useRef,
} from "react";
import { MdFileUpload } from "react-icons/md";
import File from "./components/File";

type StateType = React.Dispatch<React.SetStateAction<IUserFile[]>>;

interface Props {
  files: IUserFile[];
  onChange: StateType;
  size?: number;
  allowedTypes?: string[];
  onUpload: (file: IUserFile, index: number) => Promise<void> | void;
  onRemove: (id: string) => void;
}

export default function Dropzone({
  files,
  onChange,
  allowedTypes = ["jpeg", "jpg", "png", "avif", "mpeg", "pdf"],
  size = 2048,
  onUpload,
  onRemove,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRemove = (file: IUserFile) => {
    if (file.id) {
      onRemove && onRemove(file.id);
    } else {
      const pos = files.indexOf(file);

      if (pos !== -1) {
        onChange((prevFiles) => {
          const uploadFiles = [...prevFiles];
          uploadFiles.splice(pos, 1);

          return uploadFiles;
        });
      }
    }
  };

  const handleSelectFiles = (userFiles: FileList | null) => {
    if (userFiles && userFiles.length > 0) {
      const fileList = Array.from(userFiles).map((e) => {
        const file = {
          name: e.name,
          size: e.size,
          status: "Idle",
          type: e.type,
          file: e,
        } as IUserFile;

        const fileType = file.type.split("/")[1];
        const errors = [];

        if (allowedTypes && !allowedTypes.includes(fileType))
          errors.push("Invalid file type");

        if (file.size > size * 1024)
          errors.push(`The file size cannot be more than ${size} KB`);

        if (errors.length > 0) {
          file.status = "Error";
          file.errors = errors;
        }

        return file;
      }) as IUserFile[];

      onChange(files.concat(fileList));
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const userFiles = e.target.files;

    handleSelectFiles(userFiles);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const userFiles = e.dataTransfer.files;

    handleSelectFiles(userFiles);
  };

  useEffect(() => {
    const hasInProgres = files.some((e) => e.status === "InProgress");

    const handleUpload = async (index: number) => {
      onChange((prevFiles) => {
        const updatedFiles = [...prevFiles];
        updatedFiles[index].status = "InProgress";

        return updatedFiles;
      });

      await onUpload(files[index], index);

      onChange((prevFiles) => {
        const updatedFiles = [...prevFiles];
        updatedFiles[index].status = "InProgress";

        return updatedFiles;
      });
    };

    const uploadNextFile = async (index: number) => {
      const fileList = files.filter((e) => e.status === "Idle");

      if (index < fileList.length) {
        const fileIndex = files.indexOf(fileList[index]);

        await handleUpload(fileIndex);
      }
    };

    if (!hasInProgres) {
      uploadNextFile(0);
    }
  }, [files, onChange, onUpload]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [files]);

  return (
    <div>
      <label
        htmlFor="uploader"
        className="border-4 border-dotted border-blue-300 flex items-center justify-center flex-col cursor-pointer h-48 bg-blue-100/30 group hover:bg-blue-100/40 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="uploader"
          className="absolute -left-[100vw]"
          onChange={handleFileInputChange}
          multiple
        />
        <MdFileUpload
          size={48}
          className="fill-blue-400 group-hover:fill-blue-300 transition-colors"
        />
        <span className="text-blue-400 font-medium mt-3 group-hover:text-blue-300 transition-colors">
          Drag or Select File
        </span>
      </label>
      {files.length > 0 && (
        <div
          className="grid grid-cols-1 mt-6 space-y-2 h-full max-h-80 overflow-auto transition-all"
          ref={containerRef}
        >
          {files.map((file, fileIndex) => (
            <File key={fileIndex} file={file} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
