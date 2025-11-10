// Handles variable creation
document.getElementById('variableCount').addEventListener('input', function () {
    const container = document.getElementById('variablesContainer');
    container.innerHTML = ''; // Clear old fields
    let count = parseInt(this.value);

    if (count > 6) count = 6; // Max 6

    for (let i = 1; i <= count; i++) {
        const row = document.createElement('div');
        row.className = "variable-row";

        row.innerHTML = `
            <span>Variable ${i}</span>
            <input type="text" name="var${i}" placeholder="Enter Name" required>
            <select name="type${i}" required>
                <option value="">Select Type</option>
                <option value="number">Number</option>
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
            </select>
        `;

        container.appendChild(row);
    }
});

// Handles form submission & redirect
document.getElementById('projectForm').addEventListener('submit', function (event) {
    event.preventDefault();
    window.location.href = "projects.html"; // Redirect
});
