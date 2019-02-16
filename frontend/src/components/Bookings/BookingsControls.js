import React from 'react';
import PropTypes from 'prop-types';

import './Bookings.css';

const bookingsControls = ({ onChange, type }) => {
   return (
      <div className="bookings-controls">
         <button
            onClick={onChange.bind(this, 'list')}
            className={type === 'list' ? 'active' : ''}
         >
            List
         </button>
         <button
            onClick={onChange.bind(this, 'chart')}
            className={type === 'chart' ? 'active' : ''}
         >
            Chart
         </button>
      </div>
   );
}

bookingsControls.propTypes = {
   onChange: PropTypes.func.isRequired,
   type: PropTypes.string.isRequired
};

export default bookingsControls;