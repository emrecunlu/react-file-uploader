import classNames from "classnames";
import { MdDelete } from "react-icons/md";

interface Props {
  file: IUserFile;
  onRemove?: (file: IUserFile) => void;
}

export default function File({ file, onRemove }: Props) {
  const formatBytes = (byteValue: number): string => {
    const units = ["Byte", "KB", "MB", "GB"];
    let value = byteValue;

    for (let i = 0; i < units.length; i++) {
      if (value < 1024 || i === units.length - 1) {
        return `${value.toFixed(2)} ${units[i]}`;
      }
      value /= 1024;
    }

    return "";
  };

  const getFileIconPath = (type: string) => {
    const fileType = type.split("/")[1];

    if (
      fileType === "jpeg" ||
      fileType === "jpg" ||
      fileType === "png" ||
      fileType === "avif" ||
      fileType === "webp"
    ) {
      return "/icons/JPG.png";
    } else if (fileType === "mpeg") {
      return "/icons/MP3.png";
    } else if (fileType === "pdf") {
      return "/icons/PDF.png";
    }

    return "/icons/DOC.png";
  };

  return (
    <div
      className={classNames("border rounded px-4 py-2", {
        "bg-red-100": file.status === "Error",
        "bg-blue-50": file.status === "Done",
        "bg-green-50": file.status === "InProgress",
        "bg-gray-100": file.status === "Idle",
      })}
    >
      <div className="flex">
        <div className="mr-4">
          <img
            src={getFileIconPath(file.type)}
            className="w-6 h-8 object-cover object-center"
          />
        </div>
        <div className="flex flex-col flex-1">
          <h6 className="text-sm text-zinc-900>">{file.name}</h6>
          <span className="text-[11px] font-medium mt-1">
            {formatBytes(file.size)}
          </span>
          {file.errors && file.errors.length > 0 && (
            <span className="font-semibold text-red-600 text-[11px] mt-2">
              {file.errors[0]}
            </span>
          )}
        </div>
        {(file.status === "Error" || file.status === "Done") && (
          <button
            className="w-6 h-6 flex items-center justify-center border rounded-full bg-white"
            onClick={() => onRemove && onRemove(file)}
          >
            <MdDelete className="fill-red-600" />
          </button>
        )}
      </div>
      {file.status === "InProgress" && file.percent && (
        <div className="relative h-1 bg-blue-200 w-full mt-2 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 w-0 h-full bg-blue-400"
            style={{
              width: file.percent + "%",
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
