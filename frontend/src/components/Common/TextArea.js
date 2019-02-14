import React from 'react';
import PropTypes from 'prop-types';

const textArea = props => {
   const { label, name, value, onChange } = props;

   return (
      <div className="form-control">
         <label htmlFor={name}>{label}</label>
         <textarea name={name} onChange={onChange} value={value} />
      </div>
   );
};

textArea.propTypes = {
   label: PropTypes.string.isRequired,
   name: PropTypes.string.isRequired,
   value: PropTypes.string,
   onChange: PropTypes.func.isRequired
};

export default textArea;