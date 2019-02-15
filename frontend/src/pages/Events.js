import React, { Component } from 'react';
import axios from 'axios';

import './Event.css';

import AuthContext from '../context/auth-context';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

import EventForm from '../components/Events/EventForm';
import EventList from '../components/Events/EventList';
import EventDetail from '../components/Events/EventDetail';

class Events extends Component {
   state = {
      creating: false,
      isLoading: false,
      events: [],
      selectedEvent: null,
      title: '',
      price: '',
      date: '',
      description: ''
   };

   componentDidMount() {
      this.fetchEvents();
   }

   static contextType = AuthContext;

   async fetchEvents() {
      try {
         this.setState({ isLoading: true });
         const reqQuery = {
            query: `
               query {
                  events {
                     _id
                     title
                     description
                     price
                     date
                     creator {
                        _id
                     }
                  }
               }
            `
         };
   
         const res = await axios.post('http://localhost:8000/graphql', reqQuery);
   
         this.setState({
            events: res.data.data.events,
            isLoading: false
         });
      }
      catch (error) {
         console.log(error);
         this.setState({ isLoading: false });
      }
   }

   onCreateHandler = () => this.setState({ creating: true });

   onCancelHandler = () => this.setState({ creating: false, selectedEvent: null });

   onChange = e => this.setState({ [e.target.name]: e.target.value });

   onSubmit = async e => {
      e.preventDefault();
      
      const eventData = {
         title: this.state.title,
         price: +this.state.price,
         date: this.state.date,
         description: this.state.description
      }

      const { title, price, date, description } = eventData;

      const token = this.context.token;
      
      const reqQuery = {
         query: `
            mutation {
               createEvent(eventInput: { title: "${title}", description: "${description}", price: ${price}, date: "${date}" }) {
                  _id
                  title
                  description
                  price
                  date
               }
            }
         `
      };

      const res = await axios.post('http://localhost:8000/graphql', reqQuery, {
         headers: { Authorization: "Bearer " + token }
      });

      this.setState(prevState => {
         const updatedEvents = [...prevState.events];
         const { _id, title, description, price, date } = res.data.data.createEvent;
         updatedEvents.push({
            _id: _id,
            title: title,
            description: description,
            price: price,
            date: date,
            creator: {
               _id: this.context.userId
            }
         });

         return { events: updatedEvents };
      });

      this.setState({
         creating: false,
         title: '',
         price: '',
         date: '',
         description: ''
      });

   };

   onShowDetail = eventId => {
      this.setState(prevState => {
         const selectedEvent = prevState.events.find(e => e._id === eventId);

         return { selectedEvent };
      });
   };

   onBookEvent = (eventId, e) => {
      e.preventDefault();
      console.log(eventId);
   };

   render() {
      const { creating, isLoading, title, price, date, description, events, selectedEvent } = this.state;
      const eventData = { title, price, date, description };

      return (
         <React.Fragment>
            {
               ( creating ) && (
                  <React.Fragment>
                     <Backdrop onCancel={this.onCancelHandler} />
                     <Modal
                        title="Add Event"
                        onCancel={this.onCancelHandler}
                     >
                        <EventForm
                           eventData={eventData}
                           onChange={this.onChange}
                           onSubmit={this.onSubmit}
                        />
                     </Modal>
                  </React.Fragment>
               )
            }
            {
               this.context.token &&
                  <div className="events-control">
                     <p>Share your own events!</p>
                     <button className="btn" onClick={this.onCreateHandler}>Create event</button>
                  </div>
            }
            {
               selectedEvent &&
                  <React.Fragment>
                     <Backdrop onCancel={this.onCancelHandler} />
                     <Modal
                        title="Book Event"
                        onCancel={this.onCancelHandler}
                     >
                        <EventDetail
                           event={selectedEvent}
                           onBookEvent={this.onBookEvent}
                        />
                     </Modal>
                  </React.Fragment>
            }
            {
               isLoading
                  ? <span>Loading...</span>
                  : <EventList
                     events={events}
                     authUserId={this.context.userId}
                     onViewDetail={this.onShowDetail}
                  />
            }
            
         </React.Fragment>
      )
   }
}

export default Events;