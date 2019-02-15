import React from 'react';

import '../../pages/Event.css';

const eventDetail = props => {
   const { onBookEvent } = props;
   const { _id, title, price, date } = props.event;

   return (
      <form onSubmit={onBookEvent.bind(this, _id)}>
         <h1>{title}</h1>
         <h2>${price} - {new Date(date).toLocaleDateString()}</h2>
         <button type="submit" className="btn">Book now</button>
      </form>
      
   );
};

export default eventDetail;