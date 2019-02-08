import React from "react";
import UserCard from "../UserCard";

class Readers extends React.Component {
  render() {
    const { readers } = this.props;

    return (
      readers.length > 0 &&
      readers.map(reader => (
        <UserCard key={reader.id} user={reader} isReader={true} />
      ))
    );
  }
}

export default Readers;
