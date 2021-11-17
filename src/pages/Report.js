import React from 'react';
import '../CSS/Report.css';

class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            media: null,
            alive: 1,
            causeOfDeath: null,
            notes: null
        }
    }
    async sendPost(evt) {
        evt.preventDefault();
        const getLocation = await this.getLocation();
        const location = JSON.stringify({
            "lng" : getLocation.coords.longitude,
            "lat" : getLocation.coords.latitude
        })
        if (navigator.onLine){
            const data = new FormData();
            data.append('location', location);
            data.append( 'media', this.state.media);
            data.append('alive', this.state.alive);
            data.append('causeOfDeath', this.state.causeOfDeath);
            data.append('notes', this.state.notes);
            const response = await fetch('http://localhost:63342/zapapp/src/PHP/api.php', {
                method: 'POST',
                body: data
            });
            console.log(response);
        }else{
            const data = JSON.stringify({
                'location' : location,
                'media' : this.state.media,
                'alive' : this.state.alive,
                'causeOfDeath' : this.state.causeOfDeath,
                'notes' : this.state.notes
            })
            localStorage.setItem('data', data);
        }
    }
    getBase64Image(img) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(img)
        })
    }
    getLocation(){
        return new Promise((resolve, reject) => {
            navigator.geolocation.watchPosition(resolve, reject);
        });
    }
    async handleInput(evt) {
        switch (evt.target.name) {
            case 'alive':
                this.setState({alive: evt.target.value});
                if (evt.target.value === "0") {
                    this.setState({visible: true})
                } else {
                    this.setState({visible: false})
                }
                break;
            case 'media':
                const media = await this.getBase64Image(evt.target.files[0]);
                this.setState({media: media});
                console.log(this.state.media);
                break;
            default :
                this.setState({[evt.target.name]: evt.target.value})
                break;
        }
    }
    render(){
        const CoD = this.state.visible ? (
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
        ) : "";
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
                        <input name="btnSubmit" type="submit" className="submit" value="Submit"/>
                    </form>
                </div>
            </div>
        )
    }
}
export default Report;