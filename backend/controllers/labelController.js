const Label = require("../models/Label");

const labelController = {
    createLabel: async (req, res, next) => {
        let label = new Label();

        label.name = req.body.name;

        try {
            label = await label.save();

            res.json({
                success: true,
                data: label,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "The label cannot be created",
                error: error,
            });
        }
    },

    getAllLabels: async (req, res) => {
        const labels = await Label.find();

        if (!labels) {
            return res.status(500).json({
                success: false,
                message: "No label existed",
            });
        }

        res.json({
            success: true,
            data: labels,
        });
    },

    getLabelById: async (req, res) => {
        const label = await Label.findById(req.params.id);

        if (!label) {
            return res.status(500).json({
                success: false,
                message: "The label with the given ID was not found",
            });
        }

        res.json({
            success: true,
            data: label,
        });
    },

    updateLabel: async (req, res) => {
        const labelExist = await Label.findById(req.query.id);

        if (!labelExist) {
            return res.status(404).json({
                success: false,
                message: "The label Not Found",
            });
        }

        let label = {
            name: req.body.name,
        };

        try {
            label = await Label.findByIdAndUpdate(req.query.id, label, { new: true });

            res.json({
                success: true,
                data: label,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "The label cannot be updated",
                error: error,
            });
        }
    },

    deleteLabel: async (req, res) => {
        Label.findByIdAndRemove(req.query.id)
            .then((label) => {
                if (label) {
                    return res.status(200).json({
                        success: true,
                        message: "The label is deleted",
                    });
                }

                return res.status(404).json({
                    success: false,
                    message: "The label with the given ID was not found",
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    success: false,
                    message: "The label cannot be deleted",
                    error: error,
                });
            });
    },
};

module.exports = labelController;
