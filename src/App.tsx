import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from './views/Login.jsx';
import Dashboard from './views/Dashboard';
import New from './views/New';
import About from './views/About';
import Signup from './views/Signup';
import Task from './views/Task';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/signup' component={Signup} />
        <Route path='/new' component={New} />
        <Route exact path='/dashboard' component={Dashboard} />
        <Route path='/dashboard/:name' component={Task} />
        <Route path='/about' component={About} />
        
      </Switch>
    </Router>
  );
}

export default App;
