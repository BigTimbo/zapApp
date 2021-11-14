import React from 'react';
import '../CSS/Report.css';

class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            location: null,
            media: null,
            alive: null,
            causeOfDeath: null,
            notes: null
        }
    }
    async sendPost(evt) {
        evt.preventDefault();
        // const media = this.state.media.replace("C:\\fakepath\\", "");
        // const data = JSON.stringify({
        //     'location' : this.state.location,
        //     'media' : media,
        //     'alive' : this.state.alive,
        //     'causeOfDeath' : this.state.causeOfDeath,
        //     'notes' : this.state.notes
        // });
        const data = new FormData();
        data.append('location', this.state.location);
        data.append( 'media', this.state.media, this.state.media.name);
        data.append('alive', this.state.alive);
        data.append('causeOfDeath', this.state.causeOfDeath);
        data.append('notes', this.state.notes);
        console.log(data);
        const response = await fetch('http://localhost:63342/zapapp/src/PHP/api.php', {
            method: 'POST',
            // headers: {'Content-Type': 'application/json;'},
            // headers: {'Content-Type' : 'multipart/form-data'},
            body: data
        });
        console.log(response);
        // fetch('http://localhost:63342/zapapp/src/PHP/api.php', {
        //     method: 'POST',
        //     // headers: {'Content-Type': 'application/json'},
        //     // headers: {'Content-Type' : 'multipart/form-data'},
        //     body: data
        // })
        //     .then(response => {
        //         if (!response.ok){
        //             console.log("error");
        //         }
        //         return response.json();
        //     })
        //     .then(result => {
        //         console.log(result);
        //     })
        //     .catch(error => {
        //         console.error('There has been a problem with your fetch operation:', error);
        //     });
    }
    render(){
        return(
            <div className="report">
                <div className="reportContent">
                    <form className="reportForm" onSubmit={(evt) => this.sendPost(evt)}>
                        <h1>Report a Sighting</h1>
                        <h2>Please detail the conditions of your sighting here:</h2>
                        <fieldset>
                            <legend>
                                <h2><label htmlFor="location">Please mark your location:</label></h2>
                            </legend>
                            <input onChange={(evt) => this.setState({location: evt.target.value})}/>
                        </fieldset>
                        <fieldset>
                            <legend>
                                <h2><label htmlFor="media">Please upload an image:</label></h2>
                            </legend>
                            {/*this.setState({media : evt.target.files[0]})*/}
                            {/*this.setState({media : evt.target.value})*/}
                            <input type="file" onChange={(evt) => this.setState({media : evt.target.files[0]})}/>
                        </fieldset>
                        <fieldset>
                            <legend>
                                <h2><label htmlFor="alive">Is the Pangolin Alive?</label></h2>
                            </legend>
                            <select name="alive" id="alive" onChange={evt => this.setState({alive: evt.target.value})}>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </fieldset>
                        <fieldset>
                            <legend>
                                <h2><label htmlFor="causeOfDeath">Cause of Death?</label></h2>
                            </legend>
                            <select name="causeOfDeath" id="causeOfDeath" onChange={(evt) => this.setState({causeOfDeath: evt.target.value})}>
                                <option value="electrocution">Fence Death: Electrocution</option>
                                <option value="caught">Fence Death: Caught on non-electrified fence</option>
                                <option value="road">Road Death</option>
                                <option value="other">Other</option>
                            </select>
                        </fieldset>
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