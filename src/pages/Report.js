import React from 'react';
import '../CSS/Report.css';
import Loading from "../images/loading.gif";

class Report extends React.Component{
    /**
     *
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
            location: null
        }
    }

    /**
     *
     */
    async componentDidMount() {
        // bundle local storage upload within try/catch in case of browser/device incompatibility
        try{
            // check if the user is connected to a network
            if (navigator.onLine){
                // check if there are any reports saved to local storage
                if (localStorage.length > 0){
                    // set the user notification responses
                    this.setState({storedReport: true});
                    this.setState({storedUploaded: false});
                    //gather only my own report keys
                    const keys = Object.keys(localStorage);
                    const data = new FormData();
                    // for each report key, parse the JSON and send the content to my API
                    for(let key of keys) {
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
                        const response = await fetch('http://localhost:63342/zapapp/src/PHP/api.php', {
                            method: 'POST',
                            body: data
                        });
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
        }catch (e){
            console.log(e);
        }
    }

    /**
     *
     * @param evt Event of form submission.
     */
    async handleSubmit(evt) {
        // bundle whole handle submit within try/catch in case of browser/device incompatibility
        try {
            // prevent form default submit event
            evt.preventDefault();
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
                const response = await fetch('http://localhost:63342/zapapp/src/PHP/api.php', {
                    method: 'POST',
                    body: data
                });
                // check if fetch response is OK
                if (response.ok) {
                    // set the user notification responses
                    this.setState({successfulReport: true});
                    this.setState({storedUploaded: false});
                } else {
                    // store values to localStorage
                    await this.storeLocal();
                }
            } else {
                // store values to localStorage
                await this.storeLocal();
            }
            // stop loading
            this.setState({loading: false});
        }catch (e){
            console.log(e);
        }
    }

    /**
     *
     */
    async storeLocal(){
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
     * Return the fileReader result as the resolve from this promise object, thereby converting a base64 string.
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
     * Return users watched position as the resolve section of this promise object.
     * @returns {Promise<JSON>} Returns a JSON array of location data.
     */
    getLocation(){
        return new Promise((resolve, reject) => {
            navigator.geolocation.watchPosition(resolve, reject);
        });
    }

    /**
     * This method is triggered from onChange events from the form, parsing the event parameter.
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
                // take the first file from field and convert to base64 string
                const media = await this.getBase64Image(evt.target.files[0]);
                // set value to state
                this.setState({media: media});
                break;
            default :
                // set value to state
                this.setState({[evt.target.name]: evt.target.value})
                break;
        }
    }

    /**
     * React method to render the report page content.
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
            <h1>Unfortunately we are not able to send your report to our servers right now, but the details have been stored and will be sent when next possible!</h1>
            :
            ""
        ;
        const storedUploaded = this.state.storedUploaded ?
            <h1>We have successfully uploaded the stored reports!</h1>
            :
            ""
        ;
        const successfulReport = this.state.successfulReport ?
            <h1>Successfully uploaded your report!</h1>
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
                            <input name="media" id="media" type="file" onChange={(evt) => this.handleInput(evt)} />
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