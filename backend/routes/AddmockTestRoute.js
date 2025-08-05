import express from 'express';

import MockTest from "../models/AddMockTest.js";

const router = express.Router();

router.post("/", async(req,res)=>{
    try {
        const newMockTest = new MockTest(req.body);
        const savedMockTest = await newMockTest.save();
        res.status(201).json(savedMockTest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create mock test' });
    }
});


router.get("/", async(req,res)=>{
    try {
        const mockTests = await MockTest.find();
        res.status(200).json(mockTests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch mock tests' });
    }
});

router.put("/:id", async(req,res)=>{
    try {
        const updatedMockTest = await MockTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedMockTest);      
    } catch (err) {
        res.status(500).json({ error: 'Failed to update mock test' });
    }
});


router.delete("/:id", async(req,res)=>{
    try {
        await MockTest.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Mock test deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete mock test' });
    }
});

export default router;