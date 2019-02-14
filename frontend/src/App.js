import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

import AuthContext from './context/auth-context';

import MainNavigation from './components/Navigation/MainNavigation';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';

class App extends Component {
   state = {
      token: null,
      userId: null
   };

   login = (token, userId, tokenExpiration) => { this.setState({ token, userId }); }

   logout = () => this.setState({ token: null, userId: null })

   render() {
      const { token, userId } = this.state;

      return (
         <div className="App">
            <Router>
               <React.Fragment>
                  <AuthContext.Provider value={{ token, userId, login: this.login, logout: this.logout }} >
                     <MainNavigation />
                     <main className="main-content">
                        <Switch>
                           { token && <Redirect from="/auth" to="/events" /> }
                           { !token && <Redirect from="/bookings" to="/auth" /> }
                           <Route path="/" component={Home} exact />
                           <Route path="/auth" component={Auth} exact />
                           <Route path="/events" component={Events} exact />
                           <Route path="/bookings" component={Bookings} exact />
                        </Switch>
                     </main>
                  </AuthContext.Provider>
               </React.Fragment>
            </Router>
         </div>
      );
   }
}

export default App;