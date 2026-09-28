const form = document.getElementById("registrationForm");
const popup = document.getElementById("successPopup");
const closeButton = document.getElementById("closePopup");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const rollNo = document.getElementById("rollNo").value.trim();
    const course = document.getElementById("course").value;
    const branch = document.getElementById("branch").value;
    const address = document.getElementById("address").value.trim();

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    // Validation
    if (
        name === "" ||
        age === "" ||
        email === "" ||
        phone === "" ||
        rollNo === "" ||
        course === "" ||
        branch === "" ||
        address === "" ||
        gender === null
    ) {
        alert("Please fill in all fields.");
        return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Enter a valid 10-digit phone number.");
        return;
    }

    // Data sent to MongoDB
    const student = {
        name: name,
        age: Number(age),
        email: email,
        phone: phone,
        rollNumber: rollNo,
        course: course,
        branch: branch,
        gender: gender.value,
        address: address
    };

    try {

        const response = await fetch("/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                data.error ||
                "Registration failed"
            );
        }

        console.log("Student saved:", data);

        // Success message
        alert("Student registered successfully!");

        // Clear form
        form.reset();

        // Go directly to dashboard
        window.location.href = "/dashboard.html";

    } catch (error) {

        console.error("Registration error:", error);

        alert(
            "Unable to register student.\n\n" +
            error.message
        );
    }
});


// Close popup
closeButton.addEventListener("click", function () {

    popup.style.display = "none";

});