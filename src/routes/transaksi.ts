import express from "express";
import { TransaksiService } from "../controllers/transaksi";
import { CheckAuth } from "../middleware/auth";

const router = express.Router();

router.get("/all", CheckAuth, TransaksiService.GetProductAll);
router.get("/:page/:size", CheckAuth, TransaksiService.GetProduct);
router.post("/", CheckAuth, TransaksiService.doTransaction);

export { router as TransaksiRouter };
