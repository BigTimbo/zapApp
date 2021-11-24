import React from 'react';
import '../CSS/Report.css';
import Loading from "../images/loading.gif";

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 */
class Report extends React.Component{
    // abort controller used to prevent memory leaks on fetch requests
    controller = new AbortController();
    /**
     * This is a React method that initialises the state variables and is called on class object creation.
     * The state variables are used to handle boolean rendering states and form data content across the class.
     * @param props Properties of Report class.
     */
    constructor(props) {
        super(props);
        this.state = {
            CoDVisible: false,
            media: null,
            alive: 1,
            causeOfDeath: null,
            notes: null,
            storedReport: false,
            loading : false,
            storedUploaded: false,
            successfulReport: false,
            location: null,
            fileError : false
        }
    }

    /**
     * This is a React method that is called on page load.
     * This method checks if the user is online and if there is any reports saved to local storage;
     * then continues to loop through, uploading and removing any reports.
     */
    async componentDidMount() {
        // bundle local storage upload within try/catch in case of browser/device incompatibility & memory leaks
        try{
            // check if the user is connected to a network
            if (navigator.onLine){
                // check if there are any reports saved to local storage
                if (localStorage.length > 0){
                    //gather only my own report keys
                    const keys = Object.keys(localStorage);
                    const data = new FormData();
                    // for each report key, parse the JSON and send the content to my API
                    for(let key of keys) {
                        if (key !== 'allSightings'){
                            // set the user notification responses
                            this.setState({storedReport: true});
                            this.setState({storedUploaded: false});
                            // gather this key content
                            const storedKey = localStorage.getItem(key);
                            // parse this key content as JSON
                            const storedJSON = JSON.parse(storedKey);
                            // append all the JSON values to the respective form data key
                            data.append('location', storedJSON.location);
                            data.append( 'media', storedJSON.media);
                            data.append('alive', storedJSON.alive);
                            data.append('causeOfDeath', storedJSON.causeOfDeath);
                            data.append('notes', storedJSON.notes);
                            // send the fetch request to my API with post body
                            const response = await this.sendPost(data, this.controller);
                            // check if fetch response is OK
                            if (response.ok){
                                // set the user notification responses
                                this.setState({storedUploaded: true});
                                this.setState({storedReport: false});
                                // wipe the key from the local storage
                                localStorage.removeItem(key);
                            }
                        }
                    }
                }
            }
        }catch (e){
            console.log(e);
        }
    }
    componentWillUnmount() {
        this.controller.abort();
    }

    /**
     * This method handles the submit event, called from the user form.
     * @param evt Event of form submission.
     */
    async handleSubmit(evt) {
        // bundle whole handle submit within try/catch in case of browser/device incompatibility & memory leaks
        try {
            // prevent form default submit event
            evt.preventDefault();
            // check if file field is empty
            if (evt.target[1].value === '' && evt.target[1].type === 'file'){
                // set error state to true
                this.setState({fileError: true});
                return false;
            }else{
                // set error state to false
                this.setState({fileError: false});
            }
            // start loading
            this.setState({loading: true});
            // request user location and set as state variable: location
            const getLocation = await this.getLocation();
            const location = JSON.stringify({
                "lng": getLocation.coords.longitude,
                "lat": getLocation.coords.latitude
            })
            this.setState({location: location});
            // check if the user is connected to a network
            if (navigator.onLine) {
                const data = new FormData();
                // append all the state values to the respective form data key
                data.append('location', this.state.location);
                data.append('media', this.state.media);
                data.append('alive', this.state.alive);
                data.append('causeOfDeath', this.state.causeOfDeath);
                data.append('notes', this.state.notes);
                // send the fetch request to my API with post body
                const response = await this.sendPost(data, this.controller);
                // check if fetch response is OK
                if (response.ok) {
                    // set the user notification responses
                    this.setState({successfulReport: true});
                    this.setState({storedUploaded: false});
                } else {
                    // store values to localStorage
                    this.storeLocal();
                }
            } else {
                // store values to localStorage
                this.storeLocal();
            }
            // reset the form fields for new submissions
            evt.target.reset();
            this.setState({CoDVisible: false});
            // stop loading
            this.setState({loading: false});
        }catch (e){
            console.log(e);
        }
    }

    /**
     * This method is called to store the state variables to the local Storage.
     */
    storeLocal(){
        this.setState({storedReport: true});
        // create a string from the json of report values
        const data = JSON.stringify({
            'location' : this.state.location,
            'media' : this.state.media,
            'alive' : this.state.alive,
            'causeOfDeath' : this.state.causeOfDeath,
            'notes' : this.state.notes
        })
        // create a unique key from date number to string
        const uniqueKey = (new Date()).getTime().toString();
        // save the report content to unique key
        localStorage.setItem(uniqueKey, data);
    }

    /**
     * This method is called to send data to the API via a POST request and returns the response.
     * @param data FormData object to be sent through POST body.
     * @param controller AbortController to abort on unMount to prevent memory leaks
     * @returns {Promise<Response>} Returns a POST HTTP request response.
     */
    async sendPost(data, controller){
        return await fetch('http://localhost:63342/zapapp/src/PHP/api.php', {
            controller,
            method: 'POST',
            body: data
        });
    }

    /**
     * This method is called to convert a file to base64 and returns a base64 string from the promise.
     * @param img
     * @returns {Promise<String>} Returns a String of base64.
     */
    getBase64Image(img) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(img)
        })
    }

    /**
     * This method is called to watch the users position and returns the location JSON from the promise.
     * @returns {Promise<JSON>} Returns a JSON array of location data.
     */
    getLocation(){
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    /**
     * This method is called from onChange events in the form, parsing the event parameter.
     * Using a switch, the event name is compared to handle specific field events.
     * The default event encompasses all other non-specific event actions, and assigns the value to state.
     * @param evt
     */
    async handleInput(evt) {
        switch (evt.target.name) {
            case 'alive':
                // set value to state
                this.setState({alive: evt.target.value});
                // change state for causeOfDeath field to become visible/rendered on the page.
                if (evt.target.value === "0") {
                    this.setState({CoDVisible: true})
                } else {
                    this.setState({CoDVisible: false})
                }
                break;
            case 'media':
                // check if input isn't empty after change
                if (evt.target.value !== ''){
                    // take the first file from field and convert to base64 string
                    let media = await this.getBase64Image(evt.target.files[0]);
                    // check if file field is
                    if (!media.includes('data:image')){
                        this.setState({fileError: true})
                        evt.target.value = '';
                    }else{
                        // set value to state
                        this.setState({media: media});
                        this.setState({fileError: false})
                    }
                }
                break;
            default :
                // set value to state
                this.setState({[evt.target.name]: evt.target.value})
                break;
        }
    }

    /**
     *
     * @param evt
     */
    handleClose(evt){
        this.setState({[evt.target.id]: ![evt.target.id]})
    }

    /**
     *This is a React method that renders the report page content.
     * Ternary variables set at the start help dynamically render the content based on the state conditions.
     * @returns {JSX.Element}
     */
    render(){
        const CoD = this.state.CoDVisible ?
            <fieldset>
                <legend>
                    <h2><label htmlFor="causeOfDeath">Cause of Death?</label></h2>
                </legend>
                <select name="causeOfDeath" defaultValue="null" id="causeOfDeath" onChange={(evt) => this.handleInput(evt)}>
                    <option value="null">-- select an option --</option>
                    <option value="electrocution">Fence Death: Electrocution</option>
                    <option value="caught">Fence Death: Caught on non-electrified fence</option>
                    <option value="road">Road Death</option>
                    <option value="other">Other</option>
                </select>
            </fieldset>
            :
            ""
        ;
        const loading = this.state.loading ?
            <img id="loading" src={Loading} width="50px" height="50px" alt="Loading Animation"/>
            :
            <input name="btnSubmit" type="submit" className="submit" value="Submit"/>
        ;
        const storedReport = this.state.storedReport ?
            <div className="reportBanner warning">
                <p>Unfortunately we are not able to send your report to our servers right now, but the details have been stored and will be sent when next possible!</p>
                <div id="storedReport" className="alertClose" onClick={(evt) => this.handleClose(evt)}>+</div>
            </div>
            :
            ""
        ;
        const storedUploaded = this.state.storedUploaded ?
            <div className="reportBanner good">
                <p>We have successfully uploaded the stored reports!</p>
                <div id="storedUploaded" className="alertClose" onClick={(evt) => this.handleClose(evt)}>+</div>
            </div>
            :
            ""
        ;
        const successfulReport = this.state.successfulReport ?
            <div className="reportBanner good">
                <p>Successfully uploaded your report!</p>
                <div id="successfulReport" className="alertClose" onClick={(evt) => this.handleClose(evt)}>+</div>
            </div>
            :
            ""
        ;
        const fileError = this.state.fileError ?
            <p id="fileError">Warning: Please Upload an image file</p>
            :
            ""
        ;
        return(
            <div className="report">
                <div className="reportContent">
                    {successfulReport}
                    {storedReport}
                    {storedUploaded}
                    <form className="reportForm" onSubmit={(evt) => this.handleSubmit(evt)}>
                        <h1>Report a Sighting</h1>
                        <h2>Please detail the conditions of your sighting here:</h2>
                        <fieldset>
                            <legend>
                                <h2><label htmlFor="media">Please upload an image:</label></h2>
                            </legend>
                            <input name="media" id="media" type="file" accept="image/*" onChange={(evt) => this.handleInput(evt)} />
                            {fileError}
                        </fieldset>
                        <fieldset>
                            <legend>
                                <h2><label htmlFor="alive">Is the Pangolin Alive?</label></h2>
                            </legend>
                            <select name="alive" id="alive" defaultValue="1" onChange={(evt) => this.handleInput(evt)}>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </fieldset>
                        {CoD}
                        <fieldset>
                            <legend>
                                <h2><label htmlFor="notes">Notes</label></h2>
                            </legend>
                            <textarea placeholder="Type your notes here...." name="notes" className="notes" onChange={(evt) => this.handleInput(evt)} />
                            <span className="notes_error" />
                        </fieldset>
                        {loading}
                    </form>
                </div>
            </div>
        )
    }
}
export default Report;