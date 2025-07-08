<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

// 获取 POST 请求数据
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => '账号和密码不能为空']);
    exit;
}

// 防止 SQL 注入
$username = $conn->real_escape_string($username);
$password = $conn->real_escape_string($password);

// 查询用户
$sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode(['status' => 'success', 'message' => '登录成功']);
} else {
    echo json_encode(['status' => 'error', 'message' => '账号或密码错误']);
}

$conn->close();
?>  