import React from 'react';
import '../CSS/Sightings.css';
import Loading from '../images/loading.gif';

class Sightings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content : null,
            loading : true
        }
    }
    componentDidMount(){
        this.sendGet();
    }
    async sendGet(){
        const cachedJson = localStorage.getItem('content');
        if (navigator.onLine){
            const response = await fetch('http://localhost:63342/zapapp/src/PHP/api.php');
            if (response.ok){
                localStorage.clear('content');
                const json = await response.json();
                const content = JSON.stringify(json);
                this.setState({content : content});
                localStorage.setItem('content', content);
            }else if (cachedJson){
                const json = JSON.parse(cachedJson);
                const content = JSON.stringify(json);
                this.setState({content : content});
            } else{
                this.setState({content: <h1>Nothing to see here, just jedi business</h1>})
            }
        }else{
        if (cachedJson){
                const json = JSON.parse(cachedJson);
                const content = JSON.stringify(json);
                this.setState({content : content});
            } else{
                this.setState({content: <h1>Nothing to see here, just jedi business</h1>})
            }
        }
        this.setState({loading : false});
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
                    {loading}
                    {this.state.content}
                </div>
            </div>
        )
    }
}
export default Sightings;