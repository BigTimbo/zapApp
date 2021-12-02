<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
require 'db.php';
/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 */
class api extends db
{
    /** @var array Global variable for storing the response for any HTTP request. */
    private array $response;

    /**
     * This is the first method called after api object creation.
     * The logic serves to call upon the equivalent method for the HTTP request that the API is called from.
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
     * returning as void on potential errors.
     */
    private function post(): void
    {
        /** Assigning variables for all POST body content keys. */
        $location = $_POST['location'];
        $b64 = $_POST['media'];
        $alive = $_POST['alive'];
        $causeOfDeath = $_POST['causeOfDeath'];
        $notes = $_POST['notes'];
        /** Strip down the base64 strings to replace the data type preface for both accepted image formats. */
        $b64Strip = str_replace("data:image/jpeg;base64,", "", $b64);
        $b64Strip = str_replace("data:image/png;base64,", "", $b64Strip);
        /** Decode and recode the POST media content and compare to the original to check it is correct Base64 format,
         * or if the location POST content is empty
         */
        if (base64_encode(base64_decode($b64Strip, true)) !== $b64Strip || empty($location)){
            /** Set HTTP response to 400 and return void to end the current script. */
            http_response_code(400);
            return;
        }
        /** Create a unique ID and concatenate it onto a conditional ternary to check if the base64 doesn't have the jpeg tag. */
        $mediaName = uniqid().((strpos($b64, 'data:image/jpeg') !== false) ? '.jpg' : '.png');
        /** Create media path from concatenated path to mediaName variable. */
        $mediaPath = '../userImages/' . $mediaName;
        /** Store the file contents of the base64 string to the mediaPath variable. */
        file_put_contents($mediaPath, file_get_contents($b64));
        /** Start the SQL PDO prepared statement and execute the contents with equivalent variables. */
        $stmt = $this->connect()->prepare('INSERT INTO sightings(location, media, alive, causeOfDeath, notes) VALUES(?, ?, ?, ?, ?)');
        $stmt->execute([$location, $mediaName, $alive, $causeOfDeath, $notes]);
        /** Set HTTP response to 201. */
        http_response_code(201);
        /** Return the response to the request with JSON key result and parse this response calling the display method */
        $this->response['result'] = 'Successfully added';
        $this->display();
    }

    /**
     * This method handles the logic for GET requests.
     */
    private function get(){
        /** Start the SQL PDO query to select all content from sightings table. */
        $stmt = $this->connect()->query('SELECT * FROM sightings');
        /** Check if there are more than 0 rows in the query result. */
        if ($stmt->rowCount() > 0){
            /** Set HTTP response to 200. */
            http_response_code(200);
            /** While variable as fetch of each row in query table. */
            while($row = $stmt->fetch()){
                /** Set response for each row as JSON array to equivalent value key. */
                $this->response['sightings'][] = [
                    'ID' => $row['ID'],
                    'location' => $row['location'],
                    'media' => $row['media'],
                    'alive' => $row['alive'],
                    'causeOfDeath' => $row['causeOfDeath'],
                    'notes' => $row['notes']
                ];
            }
        }else{
            /** Otherwise, set HTTP response to 204 and response JSON with result key. */
            http_response_code(204);
            $this->response['result'] = 'No results';
        }
        /** Parse response content by calling the display method. */
        $this->display();
    }

    /**
     * The display function is used to echo out either the Get or Post Api response as JSON encoded data.
     */
    private function display()
    {
        echo json_encode($this->response, JSON_PRETTY_PRINT);
    }
}
$Api = new api();
$Api->requestMethod();