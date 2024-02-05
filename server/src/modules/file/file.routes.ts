import { Router } from "express";
import { getAll, create, remove } from "./file.controller";

const router = Router();

router.get("/Get", getAll);
router.post("/Create", create);
router.delete("/Delete", remove);

export default router;
