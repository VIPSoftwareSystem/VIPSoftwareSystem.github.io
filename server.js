<?php
$dbhost = 'localhost';
$dbuser = 'glasgowAdmin';
$dbpass = '7&6H^OrifDxa6xlr';
$dbname = 'glasgow';

$licensePlate = $_POST['LicensePlate'];
$passengers = $_POST['Passengers'];
$grade = $_POST['Grade'];
$plateType = $_POST['Type'];
$notes = $_POST['notes'];
$recordedDate = date('Y-m-d H:i:s');

$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
if ($conn->connect_error) {
    die('Error connecting to the database: ' . $conn->connect_error);
}

$sql = "INSERT INTO plates (LicensePlate, Passengers, Grade, plateType, notes, RecordedDate)
        VALUES ('$licensePlate', '$passengers', '$grade', '$plateType', '$notes', '$recordedDate')";

if ($conn->query($sql) === TRUE) {
    echo 'Data saved successfully!';
} else {
    echo 'Error saving data: ' . $conn->error;
}

$conn->close();
?>