import React from 'react';

import './Modal.css';

const modal = props => {
   const { title, onCancel } = props;
   return (
      <div className="modal">
         <header className="modal__header">
            <h1>{title}</h1>
         </header>
         <section className="modal__content">
            {props.children}
         </section>
         <section className="modal__actions">
            <button className="btn" onClick={onCancel}>Cancel</button>
            <button className="btn">Confirm</button>
         </section>
      </div>
   );
};

export default modal;