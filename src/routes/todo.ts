import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Todo } from "../models/todo";

const router = express.Router();

router.get("/todo/:page/:size", [], async (req: Request, res: Response) => {
  const data = req.query;
  const pagination = req.params;

  const page = parseInt(pagination.page) || 1;
  const size = parseInt(pagination.size) || 10;

  try {
    const todo = await Todo.find(data)
      .skip((page - 1) * size)
      .limit(size);

    const total = await Todo.countDocuments({});

    return res.status(200).send({
      status: 200,
      page: page,
      size: size,
      total: total,
      result: todo,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
});

router.get("/todo/:search", [], async (req: Request, res: Response) => {
  const params = req.params;
  const data = req.query;

  try {
    const todo = await Todo.find({
      [params.search]: new RegExp(`${data.value}`),
    });

    return res.status(200).send({
      status: 200,
      result: todo,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
});

router.post("/todo", async (req: Request, res: Response) => {
  const { title, description } = req.body;

  try {
    const todo = Todo.build({ title, description });

    await todo.save();
    return res.status(201).send({
      status: 201,
      result: todo,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
});

router.put("/todo/:id", async (req: Request, res: Response) => {
  const data = req.body;
  const params = req.params;

  let id;

  try {
    id = mongoose.Types.ObjectId(params.id);
  } catch (error) {
    return res.status(422).send({
      status: 422,
      message: "Opps...!!! it seems not like geo tirta id",
    });
  }

  try {
    const todo = await Todo.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    return res.status(201).send({
      status: 201,
      result: todo,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
});

router.delete("/todo/:id", async (req: Request, res: Response) => {
  const params = req.params;

  let id;

  try {
    id = mongoose.Types.ObjectId(params.id);
  } catch (error) {
    return res.status(422).send({
      status: 422,
      message: "Opps...!!! it seems not like geo tirta id",
    });
  }

  try {
    const todo = await Todo.findOneAndDelete({ _id: id });

    return res.status(201).send({
      status: 201,
      result: todo,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
});

export { router as todoRouter };
