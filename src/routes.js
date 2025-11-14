import express from "express";
import { getDB } from "./db.js";

const router = express.Router();

// this get all lessons
router.get("/lessons", async (req, res) => {
    try {
        const db = getDB();
        const lessons = await db.collection("tutors").find({}).toArray();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

// and this posts a new order
router.post("/orders", async (req, res) => {
    try {
        const newOrder = req.body;

        const db = getDB();
        const result = await db.collection("orders").insertOne(newOrder);

        res.json({ message: "Order created", orderId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to create order" });
    }
});
// this puts an update to a lesson
router.put("/lessons/:id", async (req, res) => {
    try {
        const lessonId = parseInt(req.params.id); // my id is an integer (makes it easier to test)
        const updates = req.body;

        const db = getDB();

        const result = await db.collection("tutors").updateOne(
            { id: lessonId },
            { $set: updates }
        );

        res.json({ message: "Lesson updated", modified: result.modifiedCount });
    } catch (err) {
        res.status(500).json({ error: "Failed to update lesson" });
    }
});

export default router;
