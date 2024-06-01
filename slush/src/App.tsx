import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import SlushCalculator from './components/WeatherPage';

function App() {
  return (
        <Router>
            <SlushCalculator />
        </Router>
  );
}

export default App
