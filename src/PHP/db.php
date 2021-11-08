<?php
class db
{
    protected function connect(){
        try{
             //Brighton domains
            $host = 'brighton';
            $user = 'ta459';
            $pwd = '!University-03841480';
            return new PDO('mysql:host=' . $host . ';dbname=ta459_CI609_Assignment;charset=utf8mb4', $user, $pwd);
        }catch(Exception $e){
            print "Connection failed: ".$e->getMessage();
            die();
        }
    }
}