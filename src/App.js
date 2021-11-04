import './CSS/App.css';
import './CSS/normalize.css';
import Header from './components/Header';
import Footer from "./components/Footer";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Report from "./pages/Report";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="App">
        <Router basename={'zapapp'}>
            <Header />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/About" exact component={About} />
                <Route path="/Report" exact component={Report} />
                <Route path="/Contact" exact component={Contact} />
            </Switch>
        </Router>
        <Footer />
    </div>
  );
}

export default App;
