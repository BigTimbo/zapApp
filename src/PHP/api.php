<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
require 'db.php';
class api extends db
{
    private array $response;

    public function requestMethod()
    {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $this->post();
        } else if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $this->get();
        }
    }
    private function post(){
//        $body = file_get_contents('php://input');
//        $json = json_decode($body);
//        $location = $json->location;
//        $media = $json->media;
//        $alive = $json->alive;
//        $causeOfDeath = $json->causeOfDeath;
//        $notes = $json->notes;
        http_response_code(201);
        $location = $_POST['location'];
        $media = $_FILES['media']['name'];
        $alive = $_POST['alive'];
        $causeOfDeath = $_POST['causeOfDeath'];
        $notes = $_POST['notes'];
        $stmt = $this->connect()->prepare('INSERT INTO sightings(location, media, alive, causeOfDeath, notes) VALUES(?, ?, ?, ?, ?)');
        $stmt->execute([$location, $media, $alive, $causeOfDeath, $notes]);
        $this->response['id'] = (int)$this->connect()->lastInsertId();
        $this->display();
    }
    private function get(){
        echo 'get';
    }
    private function display()
    {
        echo json_encode($this->response, JSON_PRETTY_PRINT);
    }
    public function test(){
        echo '<p>hello world!</p>';
    }
}
$Api = new api();
$Api->requestMethod();