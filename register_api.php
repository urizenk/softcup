<?php
// 引入数据库连接文件
require_once 'db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 获取 POST 数据
    $account = isset($_POST['account']) ? trim($_POST['account']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    // 输入验证
    if (empty($account) || empty($password)) {
        echo json_encode(['success' => false, 'message' => '请输入账号和密码']);
        exit;
    }

    try {
        // 检查账号是否已存在
        $stmt = $pdo->prepare('SELECT id FROM users WHERE account = :account');
        $stmt->bindParam(':account', $account, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => '该账号已被注册！']);
            exit;
        }

        // 密码哈希处理（生产环境推荐使用 password_hash）
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // 插入新用户
        $stmt = $pdo->prepare('INSERT INTO users (account, password) VALUES (:account, :password)');
        $stmt->bindParam(':account', $account, PDO::PARAM_STR);
        $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
        $stmt->execute();

        echo json_encode(['success' => true, 'message' => '注册成功！']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => '注册失败，请稍后再试']);
        error_log('Database error: ' . $e->getMessage());
    }
}
?>