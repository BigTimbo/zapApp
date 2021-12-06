import './CSS/App.css';
import './CSS/normalize.css';
import Header from './components/Header';
import Footer from "./components/Footer";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Report from "./pages/Report";
import Sightings from "./pages/Sightings";

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * The app constructs the header and footer components and has the BrowserRouter that allows the navigation to mount the correct components.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
  return (
    <div className="App">
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/Report" element={<Report />} />
                <Route path="/Sightings" element={<Sightings />} />
            </Routes>
        </Router>
        <Footer />
    </div>
  );
}

export default App;