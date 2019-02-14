import React from 'react';

import './Modal.css';

const modal = props => {
   const { title } = props;
   return (
      <div className="modal">
         <header className="modal__header">
            <h1>{title}</h1>
         </header>
         <section className="modal__content">
            {props.children}
         </section>
      </div>
   );
};

export default modal;