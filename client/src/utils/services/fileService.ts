import { AxiosRequestConfig } from "axios";
import axios from "../plugins/axios";
import { IFile } from "../types/file";
import { IApiDataResult } from "../types/api";

export const createNewFile = (file: File, config?: AxiosRequestConfig) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post<IApiDataResult<IFile>>("/File/Create", formData, config);
};

export const deleteFile = (id: string) => {
  return axios.delete("/File/Delete", { params: { id } });
};

export const getAllFiles = () => {
  return axios.get<IFile[]>("/File/Get");
};
