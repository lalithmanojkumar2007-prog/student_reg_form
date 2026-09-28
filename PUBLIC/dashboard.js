const API_URL = "/api/students";

let students = [];


// ========================================
// ELEMENTS
// ========================================

const tableBody =
    document.getElementById("studentTableBody");

const searchInput =
    document.getElementById("searchInput");

const refreshBtn =
    document.getElementById("refreshBtn");

const addStudentBtn =
    document.getElementById("addStudentBtn");

const modal =
    document.getElementById("studentModal");

const closeModal =
    document.getElementById("closeModal");

const studentForm =
    document.getElementById("studentForm");


// ========================================
// LOAD STUDENTS
// ========================================

async function loadStudents() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        const data =
            await response.json();

        // Supports both API response formats
        students =
            Array.isArray(data)
                ? data
                : data.students || [];

        displayStudents(students);

        updateStatistics(students);

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    ❌ Unable to load students.
                    Make sure the server is running.
                </td>
            </tr>
        `;
    }
}


// ========================================
// DISPLAY STUDENTS
// ========================================

function displayStudents(data) {

    tableBody.innerHTML = "";

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(student => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${escapeHTML(student.name || "")}</td>

            <td>
                ${escapeHTML(
                    student.rollNumber ||
                    student.rollNo ||
                    ""
                )}
            </td>

            <td>${escapeHTML(student.email || "")}</td>

            <td>${escapeHTML(student.phone || "")}</td>

            <td>${escapeHTML(student.course || "")}</td>

            <td>${escapeHTML(student.branch || "")}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent('${student._id}')"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent('${student._id}')"
                >
                    🗑️ Delete
                </button>

            </td>

        `;

        tableBody.appendChild(row);

    });
}


// ========================================
// STATISTICS
// ========================================

function updateStatistics(data) {

    document.getElementById("totalStudents")
        .textContent = data.length;


    const courses =
        new Set(
            data
                .map(student => student.course)
                .filter(Boolean)
        );

    const branches =
        new Set(
            data
                .map(student => student.branch)
                .filter(Boolean)
        );


    document.getElementById("totalCourses")
        .textContent = courses.size;


    document.getElementById("totalBranches")
        .textContent = branches.size;
}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        const search =
            this.value
                .toLowerCase()
                .trim();


        const filtered =
            students.filter(student => {

                return (

                    (student.name || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (student.rollNumber || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (student.email || "")
                        .toLowerCase()
                        .includes(search)

                );

            });


        displayStudents(filtered);

    }
);


// ========================================
// OPEN ADD MODAL
// ========================================

addStudentBtn.addEventListener(
    "click",
    function () {

        studentForm.reset();

        document.getElementById(
            "studentId"
        ).value = "";

        document.getElementById(
            "modalTitle"
        ).textContent = "Add Student";

        modal.style.display = "flex";

    }
);


// ========================================
// CLOSE MODAL
// ========================================

closeModal.addEventListener(
    "click",
    function () {

        modal.style.display = "none";

    }
);


// Close when clicking outside
modal.addEventListener(
    "click",
    function (event) {

        if (event.target === modal) {
            modal.style.display = "none";
        }

    }
);


// ========================================
// SAVE STUDENT
// POST / PUT
// ========================================

studentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "studentId"
            ).value;


        const student = {

            name:
                document.getElementById(
                    "studentName"
                ).value.trim(),

            age:
                Number(
                    document.getElementById(
                        "studentAge"
                    ).value
                ),

            email:
                document.getElementById(
                    "studentEmail"
                ).value.trim(),

            phone:
                document.getElementById(
                    "studentPhone"
                ).value.trim(),

            rollNumber:
                document.getElementById(
                    "studentRollNumber"
                ).value.trim(),

            course:
                document.getElementById(
                    "studentCourse"
                ).value,

            branch:
                document.getElementById(
                    "studentBranch"
                ).value,

            gender:
                document.getElementById(
                    "studentGender"
                ).value,

            address:
                document.getElementById(
                    "studentAddress"
                ).value.trim()

        };


        try {

            const response =
                await fetch(
                    id
                        ? `${API_URL}/${id}`
                        : API_URL,
                    {

                        method:
                            id ? "PUT" : "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(student)

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Operation failed"
                );

            }


            alert(
                id
                    ? "Student updated successfully!"
                    : "Student added successfully!"
            );


            modal.style.display = "none";


            await loadStudents();


        } catch (error) {

            console.error(error);

            alert(
                "Error: " +
                error.message
            );

        }

    }
);


// ========================================
// EDIT STUDENT
// ========================================

function editStudent(id) {

    const student =
        students.find(
            item => item._id === id
        );


    if (!student) {

        alert("Student not found.");

        return;

    }


    document.getElementById(
        "studentId"
    ).value = student._id;


    document.getElementById(
        "modalTitle"
    ).textContent = "Edit Student";


    document.getElementById(
        "studentName"
    ).value = student.name || "";


    document.getElementById(
        "studentAge"
    ).value = student.age || "";


    document.getElementById(
        "studentEmail"
    ).value = student.email || "";


    document.getElementById(
        "studentPhone"
    ).value = student.phone || "";


    document.getElementById(
        "studentRollNumber"
    ).value =
        student.rollNumber ||
        student.rollNo ||
        "";


    document.getElementById(
        "studentCourse"
    ).value = student.course || "";


    document.getElementById(
        "studentBranch"
    ).value = student.branch || "";


    document.getElementById(
        "studentGender"
    ).value = student.gender || "";


    document.getElementById(
        "studentAddress"
    ).value = student.address || "";


    modal.style.display = "flex";
}


// ========================================
// DELETE STUDENT
// ========================================

async function deleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Delete failed"
            );

        }


        alert(
            "Student deleted successfully!"
        );


        await loadStudents();


    } catch (error) {

        console.error(error);

        alert(
            "Error deleting student: " +
            error.message
        );

    }
}


// ========================================
// REFRESH
// ========================================

refreshBtn.addEventListener(
    "click",
    loadStudents
);


// ========================================
// HTML SAFETY
// ========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// INITIAL LOAD
// ========================================

loadStudents();