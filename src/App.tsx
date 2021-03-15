import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from './views/Login.jsx';
import Dashboard from './views/Dashboard';
import New from './views/New';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/new' component={New} />
        <Route path='/dashboard' component={Dashboard} />
      </Switch>
    </Router>
  );
}

export default App;
