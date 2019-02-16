import React from 'react';
import PropTypes from 'prop-types';

const bookingsItem = props => {
   const { onCancelBooking } = props;
   const { _id, event: { title, date, price} } = props.booking;

   return(
      <li className='bookings__item'>
         <div className="bookings__item-data">
            <h1>{title}</h1>
            <p>$ {price} - {new Date(date).toLocaleString()}</p>
         </div>
         <div className="bookings__item-actions">
            <button className="btn" onClick={onCancelBooking.bind(this, _id)}>Cancel</button>
         </div>
      </li>
   );
};

bookingsItem.propTypes = {
   booking: PropTypes.object.isRequired,
   onCancelBooking: PropTypes.func.isRequired
};

export default bookingsItem;