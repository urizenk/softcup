<?php
// 数据库配置
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "your_database";

// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);

// 检查连接
if ($conn->connect_error) {
    die("数据库连接失败: " . $conn->connect_error);
}

return $conn;
?>  