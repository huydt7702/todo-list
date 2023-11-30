const Task = require("../models/Task");

const taskController = {
    createTask: async (req, res, next) => {
        let task = new Task();

        task.name = req.body.name;
        task.isImportant = req.body.isImportant;
        task.userId = req.body.userId;

        try {
            task = await task.save();

            res.json({
                success: true,
                data: task,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "The task cannot be created",
                error: error,
            });
        }
    },

    getAllTasks: async (req, res) => {
        const tasks = await Task.find();

        if (!tasks) {
            return res.status(500).json({
                success: false,
                message: "No task existed",
            });
        }

        res.json({
            success: true,
            data: tasks,
        });
    },

    getTaskById: async (req, res) => {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(500).json({
                success: false,
                message: "The task with the given ID was not found",
            });
        }

        res.json({
            success: true,
            data: task,
        });
    },

    updateTask: async (req, res) => {
        const taskExist = await Task.findById(req.query.id);

        if (!taskExist) {
            return res.status(404).json({
                success: false,
                message: "The task Not Found",
            });
        }

        let task = {
            name: req.body.name,
            description: req.body.description,
            isImportant: req.body.isImportant,
            isFinished: req.body.isFinished,
            userId: req.body.userId,
            labelId: req.body.labelId,
        };

        try {
            task = await Task.findByIdAndUpdate(req.query.id, task, { new: true });

            res.json({
                success: true,
                data: task,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "The task cannot be updated",
                error: error,
            });
        }
    },

    deleteTask: async (req, res) => {
        Task.findByIdAndRemove(req.query.id)
            .then((task) => {
                if (task) {
                    return res.status(200).json({
                        success: true,
                        message: "The task is deleted",
                    });
                }

                return res.status(404).json({
                    success: false,
                    message: "The task with the given ID was not found",
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    success: false,
                    message: "The task cannot be deleted",
                    error: error,
                });
            });
    },
};

module.exports = taskController;
