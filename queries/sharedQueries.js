import gql from "graphql-tag";

export const ME = gql`
  query {
    me {
      ok
      data {
        id
        email
        nickname
        profile {
          profile_name
          company
          job_boolean
          image
        }
      }
      error
    }
  }
`;
