<?php
class db
{
    protected function connect(){
        try{
             //Brighton domains
//            $host = 'brighton';
//            $user = 'ta459';
//            $pwd = '!University-03841480';
//            $dbName = 'ta459_CI609_Assignment';
            // Local host
            $host = 'localhost';
            $user = 'root';
            $pwd = '';
            $dbName = 'zapapp';
            return new PDO('mysql:host=' . $host . ';dbname='.$dbName.';charset=utf8mb4', $user, $pwd);
        }catch(Exception $e){
            print "Connection failed: ".$e->getMessage();
            return http_response_code(500);
        }
    }
}