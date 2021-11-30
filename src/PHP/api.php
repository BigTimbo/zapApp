<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
require 'db.php';
class api extends db
{
    private array $response;

    /**
     * This is the first method called after api object creation.
     * The logic serves to call upon the equivalent code for the HTTP request that the API is called from.
     */
    public function requestMethod()
    {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $this->post();
        } else if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $this->get();
        }
    }

    /**
     * This method handles the logic for POST requests.
     * firstly assigning the POST body values to variables and
     */
    private function post(): void
    {
        $location = $_POST['location'];
        $b64 = $_POST['media'];
        $alive = $_POST['alive'];
        $causeOfDeath = $_POST['causeOfDeath'];
        $notes = $_POST['notes'];
        $b64Strip = str_replace("data:image/jpeg;base64,", "", $b64);
        $b64Strip = str_replace("data:image/png;base64,", "", $b64Strip);
        if (base64_encode(base64_decode($b64Strip, true)) !== $b64Strip || empty($location)){
            http_response_code(400);
            return;
        }
        $mediaName = uniqid().((strpos($b64, 'data:image/jpeg') !== false) ? '.jpg' : '.png');
        $mediaPath = '../images/userImages/' . $mediaName;
        file_put_contents($mediaPath, file_get_contents($b64));
        $stmt = $this->connect()->prepare('INSERT INTO sightings(location, media, alive, causeOfDeath, notes) VALUES(?, ?, ?, ?, ?)');
        $stmt->execute([$location, $mediaName, $alive, $causeOfDeath, $notes]);
        http_response_code(201);
        $this->response['result'] = 'Successfully added';
        $this->display();
    }

    private function get(){
        $stmt = $this->connect()->query('SELECT * FROM sightings');
        if ($stmt->rowCount() > 0){
            http_response_code(200);
            while($row = $stmt->fetch()){
                $this->response['sightings'][] = [
                    'ID' => $row['ID'],
                    'location' => $row['location'],
                    'alive' => $row['alive'],
                    'causeOfDeath' => $row['causeOfDeath'],
                    'notes' => $row['notes']
                ];
            }
        }else{
            http_response_code(204);
            $this->response['result'] = 'No results';
        }
        $this->display();
    }

    /**
     * The display function is used to echo out either the Get or Post Api response
     */
    private function display()
    {
        echo json_encode($this->response, JSON_PRETTY_PRINT);
    }
}
$Api = new api();
$Api->requestMethod();