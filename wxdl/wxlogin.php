<?php
error_reporting(0);
header('Content-type:text/html;charset=utf-8');
 function send_post($url, $post_data)
 {
     $postdata = http_build_query($post_data);
     $options = array(
         'http' => array(
             'method' => 'POST',
             'header' => 'Content-type:application/x-www-form-urlencoded',
             'content' => $postdata,
             'timeout' => 15 * 60 // 超时时间（单位:s）
         )
     );
     $context = stream_context_create($options);
     $result = file_get_contents($url, false, $context);
     return $result;
 }
 //使用方法
 $post_data = array(
     'apiname' =>'smdl9612710001',
     'apipwsd' =>'7d2c77f0078f8bba6a73b39ef7e035a7'
 );
 $resdata= send_post('https://cloud.huaxio.cn/php/smdl/server/loginapi.php', $post_data);
 $array = json_decode($resdata, true);
 //存入scenes
 session_start();
 $_SESSION['scenes']=$array['scenes'];
 echo  $array['imgurl'];
?>