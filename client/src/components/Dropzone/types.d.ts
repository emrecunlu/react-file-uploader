declare global {
  type FileStatus = "Idle" | "InProgress" | "Error" | "Done";

  interface IUserFile {
    id?: string;
    name: string;
    type: string;
    size: number;
    file?: File;
    status: FileStatus;
    percent?: number;
    errors?: string[];
  }
}

export {};
