const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const Student = require("./student");

const app = express();
const PORT = 3000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "PUBLIC")));


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


// ===============================
// FRONTEND
// ===============================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "PUBLIC", "Index.html")
    );
});


// ===============================
// API TEST
// ===============================

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Student Registry API is working!"
    });
});


// ===============================
// CREATE STUDENT - POST
// ===============================

app.post("/api/students", async (req, res) => {
    try {

        const student = new Student(req.body);

        const savedStudent = await student.save();

        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            student: savedStudent
        });

    } catch (error) {

        console.error("POST error:", error);

        res.status(400).json({
            success: false,
            message: "Error registering student",
            error: error.message
        });
    }
});


// ===============================
// GET ALL STUDENTS
// ===============================

app.get("/api/students", async (req, res) => {
    try {

        const students = await Student.find().sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: students.length,
            students: students
        });

    } catch (error) {

        console.error("GET error:", error);

        res.status(500).json({
            success: false,
            message: "Error fetching students",
            error: error.message
        });
    }
});


// ===============================
// GET ONE STUDENT
// ===============================

app.get("/api/students/:id", async (req, res) => {
    try {

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            student: student
        });

    } catch (error) {

        console.error("GET ONE error:", error);

        res.status(400).json({
            success: false,
            message: "Invalid student ID",
            error: error.message
        });
    }
});


// ===============================
// UPDATE STUDENT - PUT
// ===============================

app.put("/api/students/:id", async (req, res) => {
    try {

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student: student
        });

    } catch (error) {

        console.error("PUT error:", error);

        res.status(400).json({
            success: false,
            message: "Error updating student",
            error: error.message
        });
    }
});


// ===============================
// PARTIAL UPDATE - PATCH
// ===============================

app.patch("/api/students/:id", async (req, res) => {
    try {

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student partially updated",
            student: student
        });

    } catch (error) {

        console.error("PATCH error:", error);

        res.status(400).json({
            success: false,
            message: "Error updating student",
            error: error.message
        });
    }
});


// ===============================
// DELETE STUDENT
// ===============================

app.delete("/api/students/:id", async (req, res) => {
    try {

        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
            student: student
        });

    } catch (error) {

        console.error("DELETE error:", error);

        res.status(400).json({
            success: false,
            message: "Invalid student ID",
            error: error.message
        });
    }
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});