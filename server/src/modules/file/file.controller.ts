import { Request, Response } from "express";
import {
  getAll as getAllFiles,
  create as createNewFile,
  getById,
  remove as removeFile,
} from "./file.service";
import { UploadedFile } from "express-fileupload";
import path from "path";
import { unlink } from "fs";

export const getAll = async (req: Request, res: Response) => {
  const files = await getAllFiles();

  return res.json(files);
};

export const create = (req: Request, res: Response) => {
  const file = req.files && (req.files.file as UploadedFile);

  if (!file) {
    return res
      .status(400)
      .json({ message: "Lütfen geçerli bir dosya yükleyiniz." });
  }

  const fileName = file.name.replace(" ", "_");
  const uploadDir = path.join(process.cwd(), "uploads", fileName);

  file.mv(uploadDir, async (err) => {
    if (err) {
      return res.status(500).json("Dosya yükleme hatası.");
    }

    const fileEntity = await createNewFile({
      name: fileName,
      path: path.join("uploads", fileName),
      size: file.size,
      type: file.mimetype,
    });

    return res.json({
      message: "Dosya başarılı bir şekilde yüklendi.",
      data: fileEntity,
    });
  });
};

export const remove = async (req: Request, res: Response) => {
  const hasEntityId = await getById((req.query.id as string) ?? "");

  console.log(req.query);

  if (!hasEntityId) {
    return res
      .status(404)
      .json({ message: "Bu id ile eşleşen hiçbir dosya bulunamadı." });
  }

  const uploadDir = path.join(process.cwd(), hasEntityId.path);

  unlink(uploadDir, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Dosya silme esnasında hata meydana geldi." });
    }

    await removeFile(hasEntityId.id);

    return res.json({ message: "Dosya başarıyla silindi." });
  });
};
