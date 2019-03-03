import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import withData from "../lib/apollo";

const query = gql`
  query FindTodos {
  	todos {
      text
      done
      user {
        name
      }
    }
  }
`

let Index = ({data: {loading, error, todos}}) => {

    if (error) return (
        <div>Error! {error.message}</div>
    );

    if (loading) return (
        <div>Loading...</div>
    );

    return (
        <div>
            {todos.map(todo => (
                <div key={todo.user.name}>
                    <h1>{todo.text}</h1>
                    <p>Done: {(todo.done)? "yes" : "no"}</p>
                    <p>User: {todo.user.name}</p>
                </div>
            ))}
        </div>
    );

};

Index = graphql(query)(Index);
Index = withData(Index);

export default Index;