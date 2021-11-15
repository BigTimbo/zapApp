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
        $location = $_POST['location'];
        $mediaName = $_FILES['media']['name'];
        $alive = $_POST['alive'];
        $causeOfDeath = $_POST['causeOfDeath'];
        $notes = $_POST['notes'];
        $stmt = $this->connect()->prepare('INSERT INTO sightings(location, media, alive, causeOfDeath, notes) VALUES(?, ?, ?, ?, ?)');
        $stmt->execute([$location, $mediaName, $alive, $causeOfDeath, $notes]);
        $this->response['result'] = 'Successfully added';
        $this->display();
        http_response_code(201);
        $mediaIMG = $_FILES['media']['tmp_name'];
        $mediaSize = $_FILES['media']['size'];
        $extArray = explode('.', $mediaName);
        $mediaExt = strtolower(end($extArray));
        $extensions = ['jpg', 'jpeg', 'png', 'gif'];
        $path = '../images/userImages/';
        $file = $path . $mediaName;
        if (in_array($mediaExt, $extensions) && $mediaSize < 2097152) {
            move_uploaded_file($mediaIMG, $file);
        }
    }

    private function get(){
        $stmt = $this->connect()->query('SELECT * FROM sightings');
        if ($stmt->rowCount() > 0){
            while($row = $stmt->fetch()){
                $this->response['sightings'][] = [
                    'location' => $row['location'],
                    'media' => $row['media'],
                    'alive' => $row['alive'],
                    'causeOfDeath' => $row['causeOfDeath'],
                    'notes' => $row['notes']
                ];
            }
            $this->display();
        }else{
            $this->response['result'] = 'No results';
        }
    }
    private function display()
    {
        echo json_encode($this->response, JSON_PRETTY_PRINT);
    }
}
$Api = new api();
$Api->requestMethod();