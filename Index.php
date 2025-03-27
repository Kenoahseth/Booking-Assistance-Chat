<?php
header("Content-Type: application/json");
require_once "db_connect.php"; // Include database connection

// Function to check if message can be answered by bot
function getBotResponse($message) {
    $responses = [
        "hello" => "Hello! How can I assist you with your booking?",
        "book a room" => "Sure! What dates are you looking for?",
        "cancel my booking" => "Please provide your booking reference number.",
    ];
    return $responses[strtolower($message)] ?? null;
}

// Get user input
$data = json_decode(file_get_contents("php://input"), true);
$message = trim($data["message"] ?? "");
$sender = trim($data["sender"] ?? ""); // 'client' or 'admin'

if (!$message || !$sender) {
    echo json_encode(["error" => "Invalid input."]);
    exit;
}

// Check if bot can respond
$botReply = getBotResponse($message);
if ($botReply) {
    $botSender = "bot";
    $stmt = $conn->prepare("INSERT INTO messages (sender, message) VALUES (?, ?)");
    $stmt->bind_param("ss", $botSender, $botReply);
    $stmt->execute();
    $stmt->close();
} else {
    // Store message in database if bot can't respond
    $stmt = $conn->prepare("INSERT INTO messages (sender, message) VALUES (?, ?)");
    $stmt->bind_param("ss", $sender, $message);
    $stmt->execute();
    $stmt->close();
}

// Fetch latest messages
$result = $conn->query("SELECT sender, message, timestamp FROM messages ORDER BY timestamp DESC LIMIT 20");
$messages = [];
while ($row = $result->fetch_assoc()) {
    $messages[] = $row;
}

// Return chat history
echo json_encode(["messages" => array_reverse($messages)]);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Chat</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
<div class="container">
    <div class="row clearfix">
        <div class="col-lg-12">
            <div class="card chat-app">
                <div class="chat">
                    <div class="chat-history" id="chat-history">
                        <ul class="m-b-0" id="chat-messages"></ul>
                    </div>
                    <div class="chat-message clearfix">
                        <div class="input-group mb-0">
                            <input type="text" id="message" class="form-control" placeholder="Enter text here...">
                            <div class="input-group-append">
                                <button class="btn btn-primary" id="send">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    function fetchMessages() {
        $.get('your_php_file.php', function(response) {
            $('#chat-messages').empty();
            response.messages.forEach(msg => {
                let className = msg.sender === 'client' ? 'my-message' : 'other-message';
                $('#chat-messages').append(`<li class="clearfix"><div class="message ${className}">${msg.message}</div></li>`);
            });
        });
    }
    
    $(document).ready(function() {
        fetchMessages();
        setInterval(fetchMessages, 3000);
        
        $('#send').click(function() {
            let message = $('#message').val();
            if (!message) return;
            
            $.post('your_php_file.php', JSON.stringify({ message: message, sender: 'client' }), function() {
                $('#message').val('');
                fetchMessages();
            });
        });
    });
</script>
</body>
</html>
