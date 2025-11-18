import express from "express";
import { getDB } from "./db.js";

const router = express.Router();

router.get("/lessons", async (req, res) => {
    try {
        const db = getDB();
        const lessons = await db.collection("tutors").find({}).toArray();

        res.json(lessons);
    } catch (err) {
        console.error("Error fetching lessons:", err);
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

router.post("/orders", async (req, res) => {
    try {
        const newOrder = req.body;

        const db = getDB();
        const result = await db.collection("orders").insertOne(newOrder);

        res.json({
            message: "Order created successfully",
            orderId: result.insertedId
        });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

router.put("/lessons/:id", async (req, res) => {
    try {
        const lessonId = parseInt(req.params.id); 
        const updates = req.body;

        const db = getDB();
        const result = await db.collection("tutors").updateOne(
            { id: lessonId },
            { $set: updates }
        );

        res.json({
            message: "Lesson updated",
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.error("Error updating lesson:", err);
        res.status(500).json({ error: "Failed to update lesson" });
    }
});

export default router;
