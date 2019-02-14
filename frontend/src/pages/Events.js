import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Event.css';

class Events extends Component {
   state = {
      creating: false
   };

   onCreateHandler = () => this.setState({ creating: true });

   onCancelHandler = () => this.setState({ creating: false });

   render() {
      const { creating } = this.state;

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
                        <h1>Sample content for modal sample...</h1>
                     </Modal>
                  </React.Fragment>
               )
            }
            
            <div className="events-control">
               <p>Share your own events!</p>
               <button className="btn" onClick={this.onCreateHandler}>Create event</button>
            </div>
         </React.Fragment>
      )
   }
}

export default Events;