import express from "express";
import { ProductService } from "../controllers/products";
import { CheckAuth } from "../middleware/auth";
import { CheckCache, deleteCache } from "../middleware/nodeCacheMidleware";

const router = express.Router();

router.post("/", CheckAuth, deleteCache("/product"), ProductService.addProduct);
router.get("/:page/:size", CheckAuth, CheckCache, ProductService.GetProduct);
router.put(
  "/:id",
  CheckAuth,
  deleteCache("/product"),
  ProductService.UpdateProduct
);
router.delete(
  "/:id",
  CheckAuth,
  deleteCache("/product"),
  ProductService.DeleteProduct
);

export { router as ProductRouter };
