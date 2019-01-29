import gql from "graphql-tag";
import { FRAGMENT_RATE } from "../Rates/RatesQueries";

export const SET_RATE = gql`
  mutation SetRate($handler: String!, $rateId: Int, $newRate: String) {
    setRate(handler: $handler, rateId: $rateId, newRate: $newRate) {
      ...FragmentRate
    }
  }
  ${FRAGMENT_RATE}
`;
