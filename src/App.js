import './CSS/App.css';
import Header from './components/Header';
import Footer from "./components/Footer";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';


function App() {
  return (
    <div className="App">
        <Router>
            <Header />
            <Switch>
                <Route path="/" exact component={Home} />
            </Switch>
        </Router>
        <Footer />
    </div>
  );
}

export default App;
