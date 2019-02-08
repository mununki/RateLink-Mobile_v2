import React from "react";
import UserCard from "../UserCard";

class Tellers extends React.Component {
  render() {
    const { tellers, onlyTellers } = this.props;

    return (
      tellers.length > 0 &&
      tellers.map(teller => (
        <UserCard
          key={teller.id}
          user={teller}
          onlyTellers={onlyTellers}
          isTeller={true}
        />
      ))
    );
  }
}

export default Tellers;
