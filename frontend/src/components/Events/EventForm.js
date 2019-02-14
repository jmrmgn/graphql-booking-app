import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextInput from '../Common/TextInput';
import TextArea from '../Common/TextArea';

class EventForm extends Component {

   render() {
      const { eventData: { title, price, date, description }, onSubmit, onChange } = this.props;

      return (
         <form onSubmit={onSubmit}>
            <TextInput
               label="Title"
               name="title"
               value={title}
               onChange={onChange}
            />
            <TextInput
               label="Price"
               type="number"
               name="price"
               value={price}
               onChange={onChange}
            />
            <TextInput
               label="Date"
               type="datetime-local"
               name="date"
               value={date}
               onChange={onChange}
            />
            <TextArea
               label="Description"
               name="description"
               value={description}
               onChange={onChange}
            />
            <button className="btn">
               Submit
            </button>
         </form>
      );
   }
}

EventForm.propTypes = {
   onSubmit: PropTypes.func.isRequired,
   onChange: PropTypes.func.isRequired
};

export default EventForm;