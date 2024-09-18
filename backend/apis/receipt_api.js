const express = require("express");
const router = express.Router();
const Receipt = require("../models/receipt_model");
const ReceiptMenu = require("../models/receipt_menu_model");
const { Sequelize, Op } = require("sequelize");

// Retrieve 6 most popular menus
router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await ReceiptMenu.findAll({
            attributes: [
                "menu_id",
                [Sequelize.fn("sum", Sequelize.col("quantity")), "total_quantity"]
            ],
            group: ["menu_id"],
            order: [[Sequelize.fn("sum", Sequelize.col("quantity")), "DESC"]],
            limit: 6
        });

        return res.status(200).json(bestSeller);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

// Retrieve total sales in the current day
router.get("/sales-today", async (req, res) => {
    try {
        const currentDay = new Date();
        currentDay.setHours(0, 0, 0, 0);
        const timestamp = currentDay.getTime();

        const salesToday = await Receipt.findOne({
            attributes: [
                [Sequelize.fn("count", Sequelize.col("id")), "total_sales"]
            ],
            where: {
                timestamp: {
                    [Op.gte]: timestamp,
                    [Op.lt]: timestamp + 86400000,
                }
            }
        });

        return res.status(200).json(salesToday);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

// Retrieve total sales in the current month
router.get("/sales-this-month", async (req, res) => {
    try {
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        const timestamp = currentMonth.getTime();

        const salesThisMonth = await Receipt.findOne({
            attributes: [
                [Sequelize.fn("count", Sequelize.col("id")), "total_sales"]
            ],
            where: {
                timestamp: {
                    [Op.gte]: timestamp,
                    [Op.lt]: timestamp + 2678400000
                }
            }
        });

        return res.status(200).json(salesThisMonth);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
module.exports = router