import React from 'react';
import '../CSS/Sightings.css';
import Loading from '../images/loading.gif';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 */
class Sightings extends React.Component {
    controller = new AbortController();
    constructor(props) {
        super(props);
        this.state = {
            content : null,
            loading : true,
            sightingsMap : null,
        }
    }
    async componentDidMount(){
        try {
            const cachedJson = localStorage.getItem('allSightings');
            if (navigator.onLine) {
                const response = await fetch('http://localhost:63342/zapapp/src/PHP/api.php', this.controller);
                if (response.ok) {
                    localStorage.removeItem('allSightings');
                    const json = await response.json();
                    if (json.result !== 'No results') {
                        this.buildTable(json);
                    }
                    const storeLocal = JSON.stringify(json);
                    localStorage.setItem('allSightings', storeLocal);
                } else if (cachedJson) {
                    const json = JSON.parse(cachedJson);
                    this.buildTable(json);
                    this.setState({content: this.state.content});
                }
            } else if (cachedJson) {
                const json = JSON.parse(cachedJson);
                this.buildTable(json);
                this.setState({content: this.state.content});
            }
            this.setState({loading: false});
        }catch (e) {
            console.log(e)
        }
    }
    componentWillUnmount() {
        this.controller.abort();
    }
    handleClick(evt){
        if (evt.target.className === 'close' && !evt.target.parentElement.hidden){
            evt.target.parentElement.hidden = true;
        }else if (evt.target.className === 'modal-cell' && evt.target.children[0].hidden) {
            evt.target.children[0].hidden = false;
        }
    }
    buildTable(json){
        const content = [];
        const mapContent = [];
        if (json.sightings){
            for (let i = 0; i < json.sightings.length; i++) {
                let location = json.sightings[i].location;
                location = JSON.parse(location);
                const pin = `pin-s-${json.sightings[i].ID}+555555(${location.lng},${location.lat})`;
                mapContent.push(pin);
                content.push(
                    <tr key={json.sightings[i].ID} >
                        <td>{json.sightings[i].ID}</td>
                        <td>{json.sightings[i].alive=== '1' ? <p>&#9989;</p> : <p>&#10060;</p>}</td>
                        <td>{json.sightings[i].causeOfDeath === 'null' ? 'none' : json.sightings[i].causeOfDeath}</td>
                        <td className="modal-cell" onClick={(evt)=>{this.handleClick(evt)}}>
                            <div hidden={true} className="modal">
                                <span className="close" onClick={(evt)=> {this.handleClick(evt)}}>&times;</span>
                                <img className="modal-content" alt={`user submitted sighting for ID ${json.sightings[i].ID}`} src={require(`../images/userImages/${json.sightings[i].media}`).default}/>
                            </div>
                            Show Image
                        </td>
                        <td>{json.sightings[i].notes=== 'null' ? 'none' : json.sightings[i].notes}</td>
                    </tr>
                );
            }
            this.setState({sightingsMap : `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${mapContent.toString()}/23.5713,-28.6876,5.1,0/1280x720?access_token=pk.eyJ1IjoiYmlndGltYm8iLCJhIjoiY2t3YWcxeTMwMXM0NzJ2cmg4b2o0YnhsaiJ9.JZWpZWaRPgctxFfIP0Vsqw`})
            this.setState({content : content});
        }
    }
    render(){
        const loading = this.state.loading ?
            <div className="loadingContainer">
                <img id="loading" src={Loading} width="50px" height="50px" alt="Loading Animation"/>
            </div>
            :
            <div className="sightingsContent">
                <img src={this.state.sightingsMap ? this.state.sightingsMap : "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/23.5713,-28.6876,5.1,0/1280x720?access_token=pk.eyJ1IjoiYmlndGltYm8iLCJhIjoiY2t3YWcxeTMwMXM0NzJ2cmg4b2o0YnhsaiJ9.JZWpZWaRPgctxFfIP0Vsqw"} width="1280px" height="720px" className="map"  alt="Sightings map" />
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
        return (
            <div className="sightings">
                {loading}
            </div>
        )
    }
}
export default Sightings;