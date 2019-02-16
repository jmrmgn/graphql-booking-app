import React from 'react';
import PropTypes from 'prop-types';

import '../../pages/Event.css';

const eventItem = props => {
   const { userId, onDetail } = props;
   const { _id, title, price, date, creator } = props.event;

   return (
      <li className="events__list-item">
         <div>
            <h1>{title}</h1>
            <h2>${price} - {new Date(date).toLocaleDateString()}</h2>
         </div>
         <div>
            {
               (userId === creator._id)
                  ? <p>Your the owner of this event</p>
                  : <button className="btn" onClick={onDetail.bind(this, _id)}>View details</button>
            }
         </div>
      </li>
   );
};

eventItem.propTypes = {
   userId: PropTypes.string,
   onDetail: PropTypes.func.isRequired,
   event: PropTypes.object.isRequired
};

export default eventItem;