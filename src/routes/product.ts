import express from "express";
import { ProductService } from "../controllers/products";
import { CheckAuth } from "../middleware/auth";

const router = express.Router();

router.post("/", CheckAuth, ProductService.addProduct);
router.get("/", CheckAuth, ProductService.GetProduct);
router.put("/:id", CheckAuth, ProductService.UpdateProduct);
router.delete("/:id", CheckAuth, ProductService.DeleteProduct);

export { router as ProductRouter };
