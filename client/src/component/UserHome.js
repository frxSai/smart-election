import React from "react";

function UserHome(props) {
  return (
    <div>
      <div className="container-main">
        <div className="container-list title">
          <h3 className="title-hero"><ion-icon name="globe-outline"></ion-icon> {props.el.electionTitle}</h3>
          <br />
          <h1><center>{props.el.organizationTitle}</center></h1>
          <table style={{ marginTop: "21px" }}>
            <tr>
              <th>admin</th>
              <td>
                {props.el.adminName} ({props.el.adminTitle})
              </td>
            </tr>
            <tr className="td-hero">
              <th>contact</th>
              <td style={{ textTransform: "none" }}>{props.el.adminEmail}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
