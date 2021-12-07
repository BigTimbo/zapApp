import React from 'react';
import '../CSS/Report.css';
import Loading from "../images/loading.gif";

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * The Report class holds the logic and content for the report page, which allows users to submit a Pangolin sighting report.
 */
class Report extends React.Component{
    /** Abort controller used to prevent memory leaks on fetch requests.
     * @type {AbortController}
     */
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
            fileError : false,
            locationError: false
        }
    }

    /**
     * This is a React method that is called on page load.
     * This method checks if the user is online and if there is any reports saved to local storage;
     * then continues to loop through, uploading and removing any reports.
     */
    async componentDidMount() {
        /**
         * Bundled local storage upload within try/catch in case of browser/device incompatibility & memory leaks.
         */
        try{
            /** Check if the user is connected to a network. */
            if (navigator.onLine){
                /** Check if there are any reports saved to local storage. */
                if (localStorage.length > 0){
                    /** Assign all report keys to variable. */
                    const keys = Object.keys(localStorage);
                    /** Create a new FormData object */
                    const data = new FormData();
                    /** For each report key in local storage */
                    for(let key of keys) {
                        /** Check if the key is not the key from sightings page. */
                        if (key !== 'allSightings'){
                            /** Reset the user notification responses. */
                            this.setState({storedReport: true});
                            this.setState({storedUploaded: false});
                            /** Assign the key's content to variable. */
                            const storedKey = localStorage.getItem(key);
                            /** Parse the key's content as JSON */
                            const storedJSON = JSON.parse(storedKey);
                            /** Append all the JSON values to the respective formData key. */
                            data.append('location', storedJSON.location);
                            data.append( 'media', storedJSON.media);
                            data.append('alive', storedJSON.alive);
                            data.append('causeOfDeath', storedJSON.causeOfDeath);
                            data.append('notes', storedJSON.notes);
                            /** Parse formData to sendPost method with abortController. */
                            const response = await this.sendPost(data, this.controller);
                            /** Check if fetch response is OK. */
                            if (response.ok){
                                /** Set the user notification responses. */
                                this.setState({storedUploaded: true});
                                this.setState({storedReport: false});
                                /** Remove the key from the local storage */
                                localStorage.removeItem(key);
                            }
                        }
                    }
                }
            }
        }catch (e){
            /** Catch and log any errors to console. */
            console.log(e);
        }
    }

    /**
     * This is a React method that is called when the component is unmounted on exit.
     * The abort controller is activated which accounts for any ongoing fetch requests that could cause memory leaks.
     */
    componentWillUnmount() {
        this.controller.abort();
    }

    /**
     * This method handles the submit event, called from the user form.
     * @param evt Event of form submission.
     */
    async handleSubmit(evt) {
        /** Bundled handle submit within try/catch in case of browser/device incompatibility & memory leaks. */
        try {
            /** Prevent form default submit event */
            evt.preventDefault();
            /** Check if file field is empty and of type file. */
            if (evt.target[1].value === '' && evt.target[1].type === 'file'){
                /** Set file error state to true and return false to break the code. */
                this.setState({fileError: true});
                return false;
            }else{
                /** Otherwise set error state to false. */
                this.setState({fileError: false});
            }
            /** Start loading gif. */
            this.setState({loading: true});
            /** Call getLocation method, set as state variable with location JSON & clear potential location error state. */
            const getLocation = await this.getLocation();
            const location = JSON.stringify({
                "lng": getLocation.coords.longitude,
                "lat": getLocation.coords.latitude
            })
            this.setState({locationError: false});
            this.setState({location: location});
            /** Check if the user is connected to a network. */
            if (navigator.onLine) {
                const data = new FormData();
                /** Append all the state values to the respective formData key. */
                data.append('location', this.state.location);
                data.append('media', this.state.media);
                data.append('alive', this.state.alive);
                data.append('causeOfDeath', this.state.causeOfDeath);
                data.append('notes', this.state.notes);
                /** Parse formData to sendPost method with abortController. */
                const response = await this.sendPost(data, this.controller);
                /** Check if fetch response is OK. */
                if (response.ok) {
                    /** Set the user notification responses. */
                    this.setState({successfulReport: true});
                    this.setState({storedUploaded: false});
                } else {
                    /** Otherwise Store values to local storage. */
                    this.storeLocal();
                }
            } else {
                /** Otherwise store values to local storage. */
                this.storeLocal();
            }
            /** Reset the form fields for new submissions. */
            evt.target.reset();
            this.setState({CoDVisible: false});
            /** Stop loading Gif. */
            this.setState({loading: false});
        }catch (e){
            /** Catch and log any errors to console. */
            console.log(e);
        }
    }

    /**
     * This method is called to store the state variables to the local Storage.
     */
    storeLocal(){
        this.setState({storedReport: true});
        /** Create a string from the JSON of report field values. */
        const data = JSON.stringify({
            'location' : this.state.location,
            'media' : this.state.media,
            'alive' : this.state.alive,
            'causeOfDeath' : this.state.causeOfDeath,
            'notes' : this.state.notes
        })
        /** Create a unique key from date and convert to string. */
        const uniqueKey = (new Date()).getTime().toString();
        /** Save the report content to unique key. */
        localStorage.setItem(uniqueKey, data);
    }

    /**
     * This method is called to send data to the API via a POST request and returns the response.
     * @param data FormData object to be sent through POST body.
     * @param controller AbortController to abort on unMount to prevent memory leaks
     * @returns {Promise<Response>} Returns a POST HTTP request response.
     */
    async sendPost(data, controller){
        return await fetch('https://ta459.brighton.domains/static/PHP/api.php', {
            controller,
            method: 'POST',
            body: data
        });
    }

    /**
     * This method is called to convert a file to base64 and returns a base64 string from the promise object.
     * @param img Image blob.
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
            navigator.geolocation.getCurrentPosition(resolve, (e)=>{
                /** If the location request is rejected set error state. */
                this.setState({locationError: true});
                /** Stop loading Gif. */
                this.setState({loading: false});
                /** Parse back the error event through to the Promise reject handle. */
                reject(e);
            }, {timeout: 5000});
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
                /** Set value of alive field to state. */
                this.setState({alive: evt.target.value});
                /** Change state for causeOfDeath field to become visible on the page if field is 1 or not if 0. */
                if (evt.target.value === "0") {
                    this.setState({CoDVisible: true})
                } else {
                    this.setState({CoDVisible: false})
                }
                break;
            case 'media':
                /** Check if input isn't empty. */
                if (evt.target.value !== ''){
                    /** Parse the first submitted file to the getBase64Image method. */
                    let media = await this.getBase64Image(evt.target.files[0]);
                    /** Check file is neither jpeg/jpg or png */
                    if (!media.includes('data:image/jpeg') && !media.includes('data:image/png')){
                        /** if the file isn't one of those image types, report the error and reset the file field */
                        this.setState({fileError: true})
                        evt.target.value = '';
                    }else{
                        /** Otherwise set value of media field to Base64 image & reset error state */
                        this.setState({media: media});
                        this.setState({fileError: false})
                    }
                }
                break;
            default :
                /** for all other input fields, set the state of field target to field value */
                this.setState({[evt.target.name]: evt.target.value})
                break;
        }
    }

    /**
     * This method handles close button onClick events, settings the state of element target to the inverse boolean.
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
        /** This ternary statement will render the causeOfDeath fields based on state boolean value. */
        const CoD = this.state.CoDVisible ?
            <fieldset>
                <legend>
                    <h2><label htmlFor="causeOfDeath">Cause of Death?</label></h2>
                </legend>
                <select name="causeOfDeath" defaultValue="null" id="causeOfDeath" onChange={(evt) => this.handleInput(evt)}>
                    <option value="null">-- select an option --</option>
                    <option value="Caught on electric fence">Fence Death: Electrocution</option>
                    <option value="Caught on non-electric fence">Fence Death: Caught on non-electrified fence</option>
                    <option value="Road Incident">Road Death</option>
                    <option value="Other">Other</option>
                </select>
            </fieldset>
            :
            ""
        ;
        /** This ternary statement will render the loading gif based on state boolean value. */
        const loading = this.state.loading ?
            <img id="loading" src={Loading} width="50px" height="50px" alt="Loading Animation"/>
            :
            <input name="btnSubmit" type="submit" className="submit" value="Submit"/>
        ;
        /** This ternary statement will render the location error warning based on state boolean value. */
        const locationError = this.state.locationError ?
            <div className="reportBanner warning">
                <p>Unfortunately we weren't able to collect your location, please check you give us location permission and try again!</p>
                <div id="storedReport" className="alertClose" onClick={(evt) => this.handleClose(evt)}>+</div>
            </div>
            :
            ""
        ;
        /** This ternary statement will render the locally stored report warning based on state boolean value. */
        const storedReport = this.state.storedReport ?
            <div className="reportBanner warning">
                <p>Unfortunately we are not able to send your report to our servers right now, but the details have been stored and will be sent when next possible!</p>
                <div id="storedReport" className="alertClose" onClick={(evt) => this.handleClose(evt)}>+</div>
            </div>
            :
            ""
        ;
        /** This ternary statement will render the locally stored report upload successful based on state boolean value. */
        const storedUploaded = this.state.storedUploaded ?
            <div className="reportBanner good">
                <p>We have successfully uploaded the stored reports!</p>
                <div id="storedUploaded" className="alertClose" onClick={(evt) => this.handleClose(evt)}>+</div>
            </div>
            :
            ""
        ;
        /** This ternary statement will render the report upload successful based on state boolean value. */
        const successfulReport = this.state.successfulReport ?
            <div className="reportBanner good">
                <p>Successfully uploaded your report!</p>
                <div id="successfulReport" className="alertClose" onClick={(evt) => this.handleClose(evt)}>+</div>
            </div>
            :
            ""
        ;
        /** This ternary statement will render the file input mismatch based on state boolean value. */
        const fileError = this.state.fileError ?
            <p id="fileError">Warning: Please Upload an image file either .JPG, .JPEG or .PNG</p>
            :
            ""
        ;
        /** This section returns back the conditionally rendered components. */
        return(
            <div className="report">
                <div className="reportContent">
                    {locationError}
                    {successfulReport}
                    {storedReport}
                    {storedUploaded}
                    <form className="reportForm" onSubmit={(evt) => this.handleSubmit(evt)}>
                        <h1>Report a Sighting</h1>
                        <h2>Please detail the conditions of your sighting here, we will also request your location on submission.</h2>
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