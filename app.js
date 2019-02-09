const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const Event = require('./models/Event');
const User = require('./models/User');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
   schema: buildSchema(`
      type Event {
         _id: ID!
         title: String!
         description: String!
         price: Float!
         date: String!
      }

      type User {
         _id: ID!
         email: String!
         password: String
      }

      input EventInput {
         title: String!
         description: String!
         price: Float!
         date: String!
      }

      input UserInput {
         email: String!
         password: String!
      }

      type RootQuery {
         events: [Event!]!
      }

      type RootMutation {
         createEvent(eventInput: EventInput): Event
         createUser(userInput: UserInput): User
      }

      schema {
         query: RootQuery
         mutation: RootMutation
      }
   `),
   rootValue: {
      events: async () => {
         try {
            const events = await Event.find();
            return events;
         }
         catch (error) {
            console.log(error);
         }

      },
      createEvent: async args => {
         const { title, description, price } = args.eventInput;
         const dummyID = '5c5eb6a56875042ee4ae2233';
         const event = new Event({ title, description, price, date: new Date(args.eventInput.date), creator: dummyID });

         try {
            await event.save();
            const user = await User.findById(dummyID);

            if (!user) {
               // No user found
               throw new Error('User not found');
            }
            else {
               user.createdEvents.push(event);
               await user.save();

               return event;
            }
         }
         catch (error) {
            return error;
         }
      },
      createUser: async (args) => {
         const { email, password } = args.userInput;
         try {
            const user = await User.findOne({ email });

            if (user) {
               // User exist
               throw new Error('User exist already');
            }
            else {
               const hashPw = await bcrypt.hash(password, 12);
               const newUser = new User({ email, password: hashPw });
               await newUser.save();
   
               const userData = { email, password: null };
               return userData;
            }
         }
         catch (error) {
            return error;
         }
      }
   },
   graphiql: true
}));

mongoose.connect(
   'mongodb://localhost/graphql-booking-app-dev',
   {
      useNewUrlParser: true
   }
)
.then(() => {
   console.log('Connected to database');
   app.listen(3000, () => {
      console.log('Server running at port 3000')
   });
})
.catch(err => console.log(err));
