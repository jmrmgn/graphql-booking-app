import React, { Component } from 'react';
import axios from 'axios';

import './Auth.css';
import AuthContext from '../context/auth-context';

class Auth extends Component {
   state = {
      email: '',
      password: '',
      isLogin: true
   };

   static contextType = AuthContext;

   toggleHandler = () => this.setState({ isLogin: !this.state.isLogin });

   onSubmit = async e => {
      e.preventDefault();
      const { email, password, isLogin } = this.state;

      try {
         let reqQuery = {
            query: `
               query Login($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                     userId
                     token
                     tokenExpiration
                  }
               }
            `,
            variables: { email, password }
         };

         if (!isLogin) {
            reqQuery = {
               query: `
                  mutation CreateUser($email: String!, $password: String!) {
                     createUser(userInput: { email: $email, password: $password }) {
                        _id
                        email
                     }
                  }
               `,
               variables: { email, password }
            };
         }

         const res = await axios.post('http://localhost:8000/graphql', reqQuery);

         if (isLogin) {
            if (res.data.data.login.token) {
               const { token, userId, tokenExpiration } = res.data.data.login;
               
               this.context.login(token, userId, tokenExpiration);
            }
         }
         
      }
      catch (error) {  
         console.log(error);
      }
   }

   onChange = e => this.setState({ [e.target.name]: e.target.value });

   render() {
      const { isLogin } = this.state;
      return <form className="auth-form" onSubmit={this.onSubmit}>
         <div className="form-control">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" onChange={this.onChange} />
         </div>
         <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={this.onChange} />
         </div>
         <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={this.toggleHandler}>Switch to {isLogin ? "Signup" : "Login" }</button>
         </div>
      </form>
   }
}

export default Auth;