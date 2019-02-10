import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';

class App extends Component {
   render() {
      return (
         <div className="App">
            <Router>
               <Switch>
                  <Route path="/auth" component={Auth} />
                  <Route path="/events" component={Events} />
                  <Route path="/bookings" component={Bookings} />
               </Switch>
            </Router>
         </div>
      );
   }
}

export default App;