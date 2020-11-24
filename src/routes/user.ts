import express from "express";
import { user } from "../controllers/user";

const router = express.Router();

router.post("/register", user.register);
router.get("/", user.getAllUser);
router.put("/:email", user.updateUser);
router.delete("/:email", user.deleteUser);
router.post("/login", user.login);

export { router as UserRouter };
