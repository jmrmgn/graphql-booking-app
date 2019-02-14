import React, { Component } from 'react';
import axios from 'axios';

import './Event.css';

import AuthContext from '../context/auth-context';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

import EventForm from '../components/Events/EventForm';

class Events extends Component {
   state = {
      creating: false,
      events: [],
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
                    email
                  }
               }
            }
         `
      };

      const res = await axios.post('http://localhost:8000/graphql', reqQuery);

      this.setState({
         events: res.data.data.events
      });
   }

   onCreateHandler = () => this.setState({ creating: true });

   onCancelHandler = () => this.setState({ creating: false });

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

      await axios.post('http://localhost:8000/graphql', reqQuery, {
         headers: { Authorization: "Bearer " + token }
      });

      await this.fetchEvents();

      this.setState({
         creating: false,
         title: '',
         price: '',
         date: '',
         description: ''
      });

   };

   render() {
      const { title, price, date, description, creating, events } = this.state;
      const eventData = { title, price, date, description };

      const eventList = events.map(event => {
         return (
            <li key={event._id} className="events__list-item">
               {event.title}
            </li>
         );
      })

      return (
         <React.Fragment>
            {
               creating && (
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
            <ul className="events__list">{eventList}</ul>
            
         </React.Fragment>
      )
   }
}

export default Events;