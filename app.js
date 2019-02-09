const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const Event = require('./models/Event');

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

      input EventInput {
         title: String!
         description: String!
         price: Float!
         date: String!
      }

      type RootQuery {
         events: [Event!]!
      }

      type RootMutation {
         createEvent(eventInput: EventInput): Event
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
      createEvent: (args) => {
         const { title, description, price } = args.eventInput;
         const event = new Event({ title, description, price, date: new Date(args.eventInput.date) });

         return event
            .save()
            .then(result => {
               console.log(result);
               return {...result._doc};
            })
            .catch(err => {
               console.log(err);
               throw err;
            });

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
