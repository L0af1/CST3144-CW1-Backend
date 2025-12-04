import express from "express";
import { getDB } from "./db.js";

const router = express.Router();

router.get("/lessons/search", async (req, res) => {
    try {
      const q = req.query.q?.toLowerCase() || "";
  
      if (!q) {
        return res.json([]); 
      }
  
      const db = getDB();
  
      const lessons = await db.collection("tutors").find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { subject: { $regex: q, $options: "i" } },
          { location: { $regex: q, $options: "i" } }
        ]
      }).toArray();
  
      res.json(lessons);
  
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      res.status(500).json({ error: "Search failed" });
    }
  });

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
  
      // added the basic validation i was told to add in the demonstration
      if (!newOrder.name || !newOrder.phone || !newOrder.lessonIDs || !newOrder.spaces) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const namePattern = /^[A-Za-z ]+$/;
      const phonePattern = /^[0-9]+$/;
  
      if (!namePattern.test(newOrder.name)) {
        return res.status(400).json({ error: "Name must contain letters and spaces only" });
      }
  
      if (!phonePattern.test(newOrder.phone)) {
        return res.status(400).json({ error: "Phone must contain digits only" });
      }
  
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
      const lessonId = Number(req.params.id);  
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
