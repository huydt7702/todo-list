const labelController = require("../controllers/labelController");
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndUserAuthorization } = require("../controllers/verifyToken");

const router = require("express").Router();

router.post("/", (req, res) => {
    labelController.createTask(req, res);
});

router.get("/", (req, res) => {
    labelController.getAllTasks(req, res);
});

router.get("/:id", (req, res) => {
    labelController.getTaskById(req, res);
});

router.put("/", (req, res) => {
    labelController.updateTask(req, res);
});

router.delete("/", (req, res) => {
    labelController.deleteTask(req, res);
});

module.exports = router;
