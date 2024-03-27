import React from "react";

function UserHome(props) {
  return (
    <div>
      <div className="container-main">
        <div className="container-list title">
          <h3 className="title-hero"> {props.el.electionTitle}</h3>
          <br />
          <h1><center>{props.el.organizationTitle}</center></h1>

        </div>
      </div>
    </div>
  );
}

export default UserHome;
