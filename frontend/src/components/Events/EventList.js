import React from 'react';
import '../../pages/Event.css';

import EventItem from './EventItem';

const eventList = props => {
   const { events, authUserId, onViewDetail } = props;

   const eventsList = events.map(event => {
      return (
         <EventItem key={event._id}
            event={event}
            userId={authUserId}
            onDetail={onViewDetail}
         />
      );
   })

   return (
      <ul className="events__list">
         {eventsList}
      </ul>
   );
};

export default eventList;
