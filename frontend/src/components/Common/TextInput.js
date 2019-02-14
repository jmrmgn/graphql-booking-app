import React from 'react';
import PropTypes from 'prop-types';

const textInput = props => {
   const { label, type, name, value, onChange } = props;

   return (
      <div className="form-control">
         <label htmlFor={name}>{label}</label>
         <input type={type} name={name} onChange={onChange} value={value} />
      </div>
   );
};

textInput.propTypes = {
   label: PropTypes.string.isRequired,
   type: PropTypes.string.isRequired,
   name: PropTypes.string.isRequired,
   value: PropTypes.string,
   onChange: PropTypes.func.isRequired
};

textInput.defaultProps = {
   type: "text",
   value: ""
};

export default textInput;