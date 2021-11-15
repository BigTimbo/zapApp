import React from 'react';
import '../CSS/Report.css';

class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            location: null,
            media: null,
            alive: 1,
            causeOfDeath: null,
            notes: null
        }
    }
    componentDidMount() {
        this.getLocation();
    }
    async sendPost(evt) {
        evt.preventDefault();
        const data = new FormData();
        data.append('location', this.state.location);
        data.append( 'media', this.state.media, this.state.media.name);
        data.append('alive', this.state.alive);
        data.append('causeOfDeath', this.state.causeOfDeath);
        data.append('notes', this.state.notes);
        console.log(data);
        const response = await fetch('http://localhost:63342/zapapp/src/PHP/api.php', {
            method: 'POST',
            body: data
        });
        console.log(response);
    }
    getLocation(){
        const successCallback = (pos) => {
            console.log(pos);
            const location = {
                "lng" : pos.coords.longitude,
                "lat" : pos.coords.latitude
            }
            this.setState({location: JSON.stringify(location)})
        };
        const errorCallback = (err) => {
            console.log(err);
        };
        navigator.geolocation.watchPosition(successCallback, errorCallback);
    }
    formVisible(evt){
        this.setState({alive: evt.target.value});
        if (evt.target.value === "0"){
            this.setState({visible: true})
        }else{
            this.setState({visible: false})
        }
    }
    render(){
        const CoD = this.state.visible ? (
            <fieldset>
                <legend>
                    <h2><label htmlFor="causeOfDeath">Cause of Death?</label></h2>
                </legend>
                <select name="causeOfDeath" defaultValue="null" id="causeOfDeath" onChange={(evt) => this.setState({causeOfDeath: evt.target.value})}>
                    <option value="null">-- select an option --</option>
                    <option value="electrocution">Fence Death: Electrocution</option>
                    <option value="caught">Fence Death: Caught on non-electrified fence</option>
                    <option value="road">Road Death</option>
                    <option value="other">Other</option>
                </select>
            </fieldset>
        ) : (
            ""
        );
        return(
            <div className="report">
                <div className="reportContent">
                    <form className="reportForm" onSubmit={(evt) => this.sendPost(evt)}>
                        <h1>Report a Sighting</h1>
                        <h2>Please detail the conditions of your sighting here:</h2>
                        <fieldset>
                            <legend>
                                <h2><label htmlFor="media">Please upload an image:</label></h2>
                            </legend>
                            <input type="file" onChange={(evt) => this.setState({media : evt.target.files[0]})}/>
                        </fieldset>
                        <fieldset>
                            <legend>
                                <h2><label htmlFor="alive">Is the Pangolin Alive?</label></h2>
                            </legend>
                            <select name="alive" id="alive" defaultValue="1" onChange={evt => this.formVisible(evt)}>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </fieldset>
                        {CoD}
                        <fieldset>
                            <legend>
                                <h2><label htmlFor="notes">Notes</label></h2>
                            </legend>
                            <textarea placeholder="Type your notes here...." name="notes" className="notes" onChange={(evt) => this.setState({notes: evt.target.value})} />
                            <span className="notes_error" />
                        </fieldset>
                        <input name="btnSubmit" type="submit" className="submit" value="Submit"/>
                    </form>
                </div>
            </div>
        )
    }
}
export default Report;