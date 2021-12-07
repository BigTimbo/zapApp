import React from 'react';
import '../CSS/Sightings.css';
import Loading from '../images/loading.gif';
import offlinePlaceholder from '../images/offline-placeholder.avif';
import offlineMap from '../images/map-offline.avif';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * The sightings class holds the logic and content for the sightings page, which displays all the users submitted reports.
 */
class Sightings extends React.Component {
    /** Abort controller used to prevent memory leaks on fetch requests.
     * @type {AbortController}
     */
    controller = new AbortController();
    /**
     * This is a React method that initialises the state variables and is called on class object creation.
     * The state variables are used to handle boolean states and content across the class.
     * @param props Properties of Sightings class.
     */
    constructor(props) {
        super(props);
        this.state = {
            content : null,
            loading : true,
            sightingsMap : null,
            online : false
        }
    }

    /**
     * This is a React method that is called on page load.
     * This method checks if the user is online and if there is any reports saved to local storage;
     * then continues to loop through, uploading and removing any reports.
     */
    async componentDidMount(){
        try {
            /** Assign local storage key allSightings to variable. */
            const cachedJson = localStorage.getItem('allSightings');
            /** Check if the user is connected to a network. */
            if (navigator.onLine) {
                /** Set the online state true */
                this.setState({online: true})
                /** Send a fetch request to API which returns back the GET response. */
                const response = await fetch('https://ta459.brighton.domains/static/PHP/api.php', this.controller);
                /** Check if response is OK. */
                if (response.ok) {
                    /** Clear all previous locally stored content on key allSightings. */
                    localStorage.removeItem('allSightings');
                    /** Convert response to JSON and check if there are results. */
                    const json = await response.json();
                    if (json.result !== 'No results') {
                        /** If there are results, parse the JSON to buildTable method. */
                        this.buildTable(json);
                    }
                    /** Convert results JSON to string and assign to local storage key allSightings. */
                    const storeLocal = JSON.stringify(json);
                    localStorage.setItem('allSightings', storeLocal);
                } else if (cachedJson) {
                    /** Otherwise if there is cachedJson stored, set online false and parse cachedJson content to buildTable method. */
                    this.setState({online: false});
                    const json = JSON.parse(cachedJson);
                    this.buildTable(json);
                }
            } else if (cachedJson) {
                /** Otherwise if there is cachedJson stored, set online false and parse cachedJson content to buildTable method. */
                this.setState({online: false})
                const json = JSON.parse(cachedJson);
                this.buildTable(json);
            }
            /** Stop the loading Gif. */
            this.setState({loading: false});
        }catch (e) {
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
     * This method handles the click event called from elements of the sightings table.
     * @param evt Click event on HTML Element.
     */
    handleClick(evt){
        /** Check if event target is the close class element and if it's parent element doesn't have the hidden attribute. */
        if (evt.target.className === 'close' && !evt.target.parentElement.hidden){
            /** Set the hidden attribute of the parent of the close button as true. */
            evt.target.parentElement.hidden = true;
        }else if (evt.target.className === 'modal-cell' && evt.target.children[0].hidden) {
            /** Otherwise if the event target is the modal-cell class element and if it's first child element is hidden, then set it's hidden attribute as false. */
            evt.target.children[0].hidden = false;
        }
    }

    /**
     * This method is called to construct the table with the dynamically produced JSON content parsed in the json parameter.
     * @param json JSON String
     */
    buildTable(json){
        /** Initialise content & mapContent arrays and baseURL string. */
        const content = [];
        const mapContent = [];
        const baseURL = 'https://ta459.brighton.domains/static/userImages/';
        /** Check if JSON has header sightings. */
        if (json.sightings){
            /** For each iteration in sightings JSON. */
            for (let i = 0; i < json.sightings.length; i++) {
                /** Gather location from JSON string and extract the content as JSON and construct pin string with latitude and longitude values. */
                let location = json.sightings[i].location;
                location = JSON.parse(location);
                const pin = `pin-s-${json.sightings[i].ID}+555555(${location.lng},${location.lat})`;
                /** Push pin content to mapContent array. */
                mapContent.push(pin);
                /** Push constructed table row content populated with json string values, some with conditional ternaries displaying different content. */
                content.push(
                    <tr key={json.sightings[i].ID} >
                        <td>{json.sightings[i].ID}</td>
                        <td>{json.sightings[i].alive=== '1' ? <p>&#9989;</p> : <p>&#10060;</p>}</td>
                        <td>{json.sightings[i].causeOfDeath === 'null' ? 'none' : json.sightings[i].causeOfDeath}</td>
                        <td className="modal-cell" onClick={(evt)=>{this.handleClick(evt)}}>
                            <div hidden={true} className="modal">
                                <span className="close" onClick={(evt)=> {this.handleClick(evt)}}>&times;</span>
                                <img className="modal-content" alt={`user submitted sighting for ID 
                                ${json.sightings[i].ID}`} src={this.state.online ? baseURL + json.sightings[i].media : offlinePlaceholder}/>
                            </div>
                            Show Image
                        </td>
                        <td>{json.sightings[i].notes=== 'null' ? 'none' : json.sightings[i].notes}</td>
                    </tr>
                );
            }
            /** Set the states for both sightingsMap and content to the relevant array content constructed above. */
            this.setState({sightingsMap : `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${mapContent.toString()}/23.5713,-28.6876,5.1,0/1280x720?access_token=pk.eyJ1IjoiYmlndGltYm8iLCJhIjoiY2t3YWcxeTMwMXM0NzJ2cmg4b2o0YnhsaiJ9.JZWpZWaRPgctxFfIP0Vsqw`});
            this.setState({content : content});
        }
    }

    /**
     *This is a React method that renders the report page content.
     * Ternary variables set at the start help dynamically render the content based on the state conditions.
     * @returns {JSX.Element}
     */
    render(){
        /** This ternary statement produces either the loading gif or the constructed sightings content dependant on loading state boolean. */
        const loading = this.state.loading ?
            <div className="loadingContainer">
                <img id="loading" src={Loading} width="50px" height="50px" alt="Loading Animation"/>
            </div>
            :
            <div className="sightingsContent">
                <img src={this.state.sightingsMap ?
                    this.state.sightingsMap
                    :
                    (this.state.online ?
                        "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/23.5713,-28.6876,5.1,0/1280x720?access_token=pk.eyJ1IjoiYmlndGltYm8iLCJhIjoiY2t3YWcxeTMwMXM0NzJ2cmg4b2o0YnhsaiJ9.JZWpZWaRPgctxFfIP0Vsqw"
                        :
                        offlineMap)
                } width="1280px" height="720px" className="map"  alt="Sightings map" />
                <table id="sightingsTable">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Alive</th>
                        <th>Cause Of Death</th>
                        <th>Image</th>
                        <th>Notes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.content}
                    </tbody>
                </table>
            </div>
        ;
        /** This section returns back the conditionally rendered components. */
        return (
            <div className="sightings">
                {loading}
            </div>
        )
    }
}
export default Sightings;