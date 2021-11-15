import React from 'react';
import '../CSS/Sightings.css';

class Sightings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content : null
        }
    }
    componentDidMount(){
        this.sendGet();
    }
    async sendGet(){
        const response = await fetch('http://localhost:63342/zapapp/src/PHP/api.php');
        const content = await response.json();
        const contentString = JSON.stringify(content);
        this.setState({content : contentString});
    }
    render(){
        return (
            <div className="sightings">
                <div className="sightingsContent">
                    {this.state.content}
                </div>
            </div>
        )
    }
}
export default Sightings;