import React, { Component } from 'react';
import axios from 'axios';

import AuthContext from '../context/auth-context';

import BookingsList from '../components/Bookings/BookingsList';
import BookingsControls from '../components/Bookings/BookingsControls';
import BookingsChart from '../components/Bookings/BookingsChart';

class Bookings extends Component {
   state = {
      isLoading: false,
      bookings: [],
      outputType: 'list'
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
                       price
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
               mutation CancelBooking($id: ID!) {
                  cancelBooking(bookingId: $id) {
                     title
                     description
                  }
               }
            `,
            variables: {
               id: bookingId
            }
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

   onChangeOutput = outputType => {
      this.setState({ outputType });
   };
   
   render() {
      const { isLoading, bookings, outputType } = this.state;
      let content = <span>Loading...</span>;

      if (!isLoading) {
         if (bookings.length > 0) {
            content = (
               <React.Fragment>
                  <BookingsControls
                     onChange={this.onChangeOutput}
                     type={outputType}
                  />
                  <div>
                     {
                        (outputType === 'list')
                           ? <BookingsList bookings={bookings} onCancelBooking={this.onCancelBooking} />
                           : <BookingsChart bookings={bookings} />
                     }
                  </div>
               </React.Fragment>
            );
         }
         else {
            content = <span>No bookings yet.</span>;
         }
      }
      
      return (
         <div>
            {content}
         </div>
      )
   }
}

export default Bookings;