<?php
// Database connection details (replace with secure credentials)
$servername = "localhost";
$username = "root"; // Secure username
$password = ""; // Strong password
$dbname = "Registration";

// Create a secure connection
try {
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  echo "Connected successfully <br>";
} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
  exit; // Terminate script on connection error
}

// Prepare the SQL statement with placeholders
$sql = "INSERT INTO Users (firstname, lastname, email, pass, addr, mobileno, gender)
         VALUES (:firstname, :lastname, :email, :hashedPassword, :address, :mobileno, :gender)";
$stmt = $conn->prepare($sql);

// Get form data and perform proper validation/sanitization (implement specific validation logic)
$firstname = filter_input(INPUT_POST, 'firstname', FILTER_SANITIZE_STRING); // Sanitize first name
$lastname  = filter_input(INPUT_POST, 'lastname', FILTER_SANITIZE_STRING);  // Sanitize last name
$email     = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);    // Validate email format
$password   = filter_input(INPUT_POST, 'pass', FILTER_SANITIZE_STRING);     // Sanitize password

// Validate email format and handle potential errors
if ($email === false) {
    echo "Invalid email format. Please enter a valid email address.";
    exit; // Terminate script on invalid email
}

// Hash the password using a strong algorithm (e.g., bcrypt)
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Bind parameters to the prepared statement for security
$stmt->bindParam(':firstname', $firstname);
$stmt->bindParam(':lastname', $lastname);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':hashedPassword', $hashedPassword);
$address    = filter_input(INPUT_POST, 'addr', FILTER_SANITIZE_STRING);   // Sanitize address
$mobileno   = filter_input(INPUT_POST, 'mobileno', FILTER_SANITIZE_STRING); // Sanitize mobile number
$gender     = filter_input(INPUT_POST, 'gender', FILTER_SANITIZE_STRING);   // Sanitize gender
$stmt->bindParam(':address', $address);
$stmt->bindParam(':mobileno', $mobileno);
$stmt->bindParam(':gender', $gender);

// Execute the prepared statement with bound parameters
if ($stmt->execute()) {
    echo "New record created successfully!<br>";
} else {
    // Handle execution errors using PDO error information
    $errorInfo = $stmt->errorInfo();
    echo "Error: SQL execution failed. Details: " . $errorInfo[2] . "<br>";  // Display error message (consider logging for troubleshooting)
}

$conn->close();
?>
