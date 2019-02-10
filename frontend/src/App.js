import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import MainNavigation from './components/Navigation/MainNavigation';
import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';

class App extends Component {
   render() {
      return (
         <div className="App">
            <Router>
               <React.Fragment>
                  <MainNavigation />
                  <main className="main-content">
                     <Switch>
                        <Route path="/auth" component={Auth} />
                        <Route path="/events" component={Events} />
                        <Route path="/bookings" component={Bookings} />
                     </Switch>
                  </main>
               </React.Fragment>
            </Router>
         </div>
      );
   }
}

export default App;