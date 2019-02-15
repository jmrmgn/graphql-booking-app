import React, { Component } from 'react';
import axios from 'axios';

import AuthContext from '../context/auth-context';

class Bookings extends Component {
   state = {
      isLoading: false,
      bookings: []
   };

   static contextType = AuthContext;

   componentDidMount() {
      this.fetchBookings();
   }

   async fetchBookings() {
      try {
         this.setState({ isLoading: true });
         const reqQuery = {
            query: `
               query {
                  bookings {
                     _id
                     event {
                       title
                       date
                     }
                     user {
                       email
                     }
                     createdAt
                  }
               }
            `
         };
   
         const res = await axios.post('http://localhost:8000/graphql', reqQuery, {
            headers: { Authorization: "Bearer " + this.context.token }
         });
   
         this.setState({
            bookings: res.data.data.bookings,
            isLoading: false
         });
      }
      catch (error) {
         console.log(error);
         this.setState({ isLoading: false });
      }
   }
   
   render() {
      const { isLoading, bookings } = this.state;

      return (
         <div>
            {
               isLoading
                  ? <span>Loading...</span>
                  : bookings.map(booking => {
                     return (
                        <ul key={booking._id}>
                           <li>{booking.event.title} - {new Date(booking.event.date).toLocaleString()}</li>
                        </ul>
                     )
                  })
            }
         </div>
      )
   }
}

export default Bookings;