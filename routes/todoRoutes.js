import { Router } from 'express';
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  markAsRead
} from '../controllers/todoController.js';

const router = Router();

router.post("/", createTodo);
router.get("/", getTodos);
router.put("/:id/", updateTodo);
router.delete("/:id/", deleteTodo);
router.patch("/:id/read/", markAsRead);

export default router;
// This file defines the routes for the Todo application, linking HTTP methods to controller functions for creating, retrieving, updating, deleting, and marking todos as read.