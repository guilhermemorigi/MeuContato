import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/user.js";

import express from "express";

const port = process.env.PORT || 3001;

const router = express.Router();

router.get("/", getUsers);

router.post("/", addUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
