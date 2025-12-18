import express from 'express';
import {
    getTasksByProject,
    getMyTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    updateTaskStatus,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createTask);

router.get('/my-tasks', protect, getMyTasks);

router.get('/project/:projectId', protect, getTasksByProject);

router
    .route('/:id')
    .get(protect, getTaskById)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

router.post('/:id/comments', protect, addComment);

router.patch('/:id/status', protect, updateTaskStatus);

export default router;
