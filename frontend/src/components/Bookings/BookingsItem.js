import React from 'react';
import PropTypes from 'prop-types';

const bookingsItem = props => {
   const { onCancelBooking } = props;
   const { _id, event: { title, date} } = props.booking;

   return(
      <li className='bookings__item'>
         <div className="bookings__item-data">
            {title} - {new Date(date).toLocaleString()}
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