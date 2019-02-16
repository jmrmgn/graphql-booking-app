import React from 'react';
import PropTypes from 'prop-types';

import './Bookings.css';

import BookingsItem from './BookingsItem';

const bookingsList = props => {
   const { bookings, onCancelBooking } = props;

   return (
      <ul className="bookings__list">
         {
            bookings.map(booking => {
               return (
                  <React.Fragment key={booking._id}>
                     <BookingsItem
                        booking={booking}
                        onCancelBooking={onCancelBooking}
                     />
                  </React.Fragment>
               )
            })
         }
      </ul>
   );
};

bookingsList.propTypes = {
   bookings: PropTypes.array.isRequired
};

export default bookingsList;
