import React from 'react';
import '../CSS/Sightings.css';
import Loading from '../images/loading.gif';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 */
class Sightings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content : null,
            loading : true
        }
    }
    async componentDidMount(){
        const cachedJson = localStorage.getItem('allSightings');
        if (navigator.onLine){
            const response = await fetch('http://localhost:63342/zapapp/src/PHP/api.php');
            if (response.ok){
                localStorage.removeItem('allSightings');
                const json = await response.json();
                this.buildTable(json);
                const storeLocal = JSON.stringify(json);
                localStorage.setItem('allSightings', storeLocal);
            }else if (cachedJson){
                const json = JSON.parse(cachedJson);
                this.buildTable(json);
                this.setState({content : this.state.content});
            } else{
                this.setState({content: <h1>Nothing to see here, just jedi business</h1>})
            }
        }else{
            if (cachedJson){
                const json = JSON.parse(cachedJson);
                this.buildTable(json);
                this.setState({content : this.state.content});
            } else{
                this.setState({content: <h1>Nothing to see here, just jedi business</h1>})
            }
        }
        this.setState({loading : false});
    }
    buildTable(json){
        const content = [];
        for (let i = 0; i < json.sightings.length; i++) {
            content.push(
                <tr key={json.sightings[i].ID}>
                    <td>{json.sightings[i].ID}</td>
                    <td>{json.sightings[i].alive=== '1' ? 'still kicking' : 'kicked the bucket'}</td>
                    <td>{json.sightings[i].causeOfDeath === 'null' ? 'none' : json.sightings[i].causeOfDeath}</td>
                    <td>{json.sightings[i].notes=== 'null' ? 'none' : json.sightings[i].notes}</td>
                </tr>
            );
        }
        this.setState({content : content});
    }
    render(){
        const loading = this.state.loading ?
            <div className="loadingContainer">
                <img id="loading" src={Loading} width="50px" height="50px" alt="Loading Animation"/>
            </div>
            :
            ""
        ;
        return (
            <div className="sightings">
                <div className="sightingsContent">
                    <table id="sightingsTable">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Alive</th>
                            <th>Cause Of Death</th>
                            <th>Notes</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.content}
                        </tbody>
                    </table>
                    {loading}
                </div>
            </div>
        )
    }
}
export default Sightings;