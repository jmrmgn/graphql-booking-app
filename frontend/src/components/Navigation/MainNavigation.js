import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import './MainNavigation.css';
import AuthContext from '../../context/auth-context';

const mainNavigation = props => {
   return (
      <AuthContext.Consumer>
         {
            ({ token }) => {
               return (
                  <header className="main-navigation">
                     <div className="main-navigation__logo">
                        <Link to="/"><h1>Easy Event</h1></Link>
                     </div>
                     <nav className="main_navigation__items">
                        <ul>
                           { !token && <li><NavLink to="/auth">Authenticate</NavLink></li> }
                           <li><NavLink to="/events">Events</NavLink></li>
                           {
                              token &&
                                 <React.Fragment>
                                    <li><NavLink to="/bookings">Bookings</NavLink></li>
                                    <li>
                                       <button>Logout</button>
                                    </li>
                                 </React.Fragment>
                           }
                        </ul>
                     </nav>
                  </header>
               )
            }
         }
      </AuthContext.Consumer>
   );
};

export default mainNavigation;