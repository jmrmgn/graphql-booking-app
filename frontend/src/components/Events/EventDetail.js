import React from 'react';
import PropTypes from 'prop-types';

import '../../pages/Event.css';

const eventDetail = props => {
   const { onBookEvent, token, onClose } = props;
   const { title, price, date } = props.event;
   
   return (
      <form onSubmit={onBookEvent}>
         <h1>{title}</h1>
         <h2>${price} - {new Date(date).toLocaleDateString()}</h2>
         {
            token
               ? <button type="submit" className="btn">Book now</button>
               : <button type="button" className="btn" onClick={onClose}>Close</button>
         }
      </form>
   );
};

eventDetail.propTypes = {
   event: PropTypes.object.isRequired,
   onBookEvent: PropTypes.func.isRequired,
   token: PropTypes.string,
   onClose: PropTypes.func.isRequired
};

export default eventDetail;