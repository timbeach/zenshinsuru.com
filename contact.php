<?php
// Honeypot check - bots fill hidden fields
if (!empty($_POST['website'])) {
    http_response_code(400);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation
$errors = [];
if ($name === '') {
    $errors[] = 'Name is required';
}
if ($message === '') {
    $errors[] = 'Message is required';
}
if ($email === '' && $phone === '') {
    $errors[] = 'Please provide either email or phone';
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if ($errors) {
    http_response_code(400);
    echo implode("\n", $errors);
    exit;
}

// Build email
$to = 'beachtimothyd@gmail.com';
$subject = 'Zenshin Suru Contact: ' . substr($name, 0, 50);

$body = "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Phone: $phone\n";
$body .= "\nMessage:\n$message\n";

$headers = 'From: noreply@zenshinsuru.com' . "\r\n";
if ($email !== '') {
    $headers .= 'Reply-To: ' . $email . "\r\n";
}

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    header('Location: index.html?sent=1#contact');
} else {
    http_response_code(500);
    echo 'Failed to send message. Please try again.';
}
