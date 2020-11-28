import express from "express";
import { TransaksiService } from "../controllers/transaksi";
import { CheckAuth } from "../middleware/auth";
import { redisCache } from "../middleware/redis";

const router = express.Router();

router.get("/all", redisCache, CheckAuth, TransaksiService.GetProductAll);
router.get("/:page/:size", redisCache, CheckAuth, TransaksiService.GetProduct);
router.post("/", CheckAuth, TransaksiService.doTransaction);

export { router as TransaksiRouter };
