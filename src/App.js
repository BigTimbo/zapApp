import './CSS/App.css';
import './CSS/normalize.css';
import Header from './components/Header';
import Footer from "./components/Footer";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Report from "./pages/Report";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="App">
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/Report" element={<Report />} />
                <Route path="/Contact" element={<Contact />} />
            </Routes>
        </Router>
        <Footer />
    </div>
  );
}

export default App;
