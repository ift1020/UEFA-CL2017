<?php
header('Content-Type: text/html; charset=utf-8');

$logObj = new logReceiver();
$logObj->responseMsg();

class logReceiver
{

    //响应消息
    public function responseMsg()
    {
        //if ( !isset( $HTTP_RAW_POST_DATA ) ) $HTTP_RAW_POST_DATA = file_get_contents( 'php://input' );
        //$server->service($HTTP_RAW_POST_DATA);
        //$postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
        $postStr = file_get_contents( 'php://input' );
        //echo $postStr;

        if (!empty($postStr)){
            $this->logger("R -- ".date('Y-m-d H:i:s')." \r\n".$postStr);
        } else {
            //echo "";
            exit;
        }
    }

    //日志记录
    public function logger($log_content)
    {
        $max_size = 1000000;
        $log_filename = "access.log";
        
        try {
	        if (file_exists($log_filename) and (abs(filesize($log_filename)) > $max_size)) {
	            //unlink($log_filename);
	            rename($log_filename, $log_filename.".".date('Y-m-d'));
	        }
	        file_put_contents($log_filename, $log_content."\r\n", FILE_APPEND);
	      } catch (Exception $e) {
	      	echo 'Caught exception: '. $e->getmessage(). "\n";
	      }
    }
}
?>