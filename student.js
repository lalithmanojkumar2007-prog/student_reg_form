const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        age: {
            type: Number,
            required: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        rollNumber: {
            type: String,
            required: true,
            trim: true
        },

        course: {
            type: String,
            required: true
        },

        branch: {
            type: String,
            required: true
        },

        gender: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;