import React, { Component } from 'react';
import axios from 'axios';

import AuthContext from '../context/auth-context';

import BookingsList from '../components/Bookings/BookingsList';

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

   onCancelBooking = async bookingId => {
      try {
         const reqQuery = {
            query: `
               mutation {
                  cancelBooking(bookingId: "${bookingId}") {
                     title
                     description
                  }
               }
            `
         };

         await axios.post('http://localhost:8000/graphql', reqQuery, {
            headers: { Authorization: "Bearer " + this.context.token }
         });
   
         this.setState(prevState => {
            const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId);
            return { bookings: updatedBookings };
         });
      }
      catch (error) {
         console.log(error);
      }
   };
   
   render() {
      const { isLoading, bookings } = this.state;

      return (
         <div>
            {
               isLoading
                  ? <span>Loading...</span>
                  : <BookingsList bookings={bookings} onCancelBooking={this.onCancelBooking} />
            }
         </div>
      )
   }
}

export default Bookings;