function fetchGradeData() {
    // This function will query the PostgreSQL database and return grade data
    console.log("Fetching grade data...");
    // Create a new request for HTTP data
    let xhr = new XMLHttpRequest();
    // This is the address on the machine we're asking for data
    let apiRoute = "/api/grades";
    // When the request changes status, we run this anonymous function
    xhr.onreadystatechange = function() {
        let results;
        // Check if we're done
        if (xhr.readyState === xhr.DONE) {
            // Check if we're successful
            if (xhr.status !== 200) {
                console.error(`Could not get grades. Status: ${xhr.status}`);
            }
            // And then call the function to update the HTML with our data
            populateGradebook(JSON.parse(xhr.responseText));
        }
    }.bind(this);
    xhr.open("get", apiRoute, true);
    xhr.send();
}


function populateGradebook(data) {
    // This function will take the fetched grade data and populate the table
    console.log("Populating gradebook with data:", data);
    let tableElm = document.getElementById("gradebook").getElementsByTagName('tbody')[0]; // Get the <tbody> of the gradebook table
    tableElm.innerHTML = ''; // Clear previous rows if any

    data.forEach(function(assignment) { // For each row of data we're passed in
        let row = document.createElement("tr"); // create a table row element
        let columns = []; // Handy place to stick the columns of information

        columns.name = document.createElement("td"); // The first column's table data will be the name
        columns.name.appendChild(
            // Concatenate the full name: "last_name, first_name"
            document.createTextNode(assignment.last_name + "," + assignment.first_name)
        );
        row.appendChild(columns.name);

        // Add assignment1, assignment2, assignment3 columns
        for (let i = 1; i <= 3; i++) {
            let assignCell = document.createElement("td");
            assignCell.appendChild(
                document.createTextNode(assignment[`assignment${i}`])
            );
            row.appendChild(assignCell);
        }

        // Calculate letter grade based on total_grade
        let letterGrade;
        if (assignment.total_grade >= 90) {
            letterGrade = 'A';
        } else if (assignment.total_grade >= 80) {
            letterGrade = 'B';
        } else if (assignment.total_grade >= 70) {
            letterGrade = 'C';
        } else if (assignment.total_grade >= 60) {
            letterGrade = 'D';
        } else {
            letterGrade = 'F';
        }

        columns.grade = document.createElement("td"); // second column will be the grade
        columns.grade.appendChild(
            document.createTextNode(letterGrade)
        );
        row.appendChild(columns.grade);

        // Add the row to the table itself to make the data visible
        tableElm.appendChild(row);
    });
}

fetchGradeData();