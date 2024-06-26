import React from "react";

const StartEnd = (props) => {
  const btn = {
    display: "block",
    padding: "21px",
    margin: "7px",
    minWidth: "max-content",
    textAlign: "center",
    width: "333px",
    alignSelf: "center",
  };
  return (
    <div
      className="container-main"
      style={{ borderTop: "none", marginTop: "0px" }}
    >
      {!props.elStarted ? (
        <>
          {/* */}
          {!props.elEnded ? (
            <>
              <div className="container-item">
                <button className="btn font-btn" type="submit" style={btn}>
                  Start-Event {props.elEnded ? "Again" : null}
                </button>
              </div>
            </>
          ) : (
            <div className="container-item">
              <center>
                <p>Re-deploy the contract to start election again.</p>
              </center>
            </div>
          )}
          {props.elEnded ? (
            <div className="container-item">
              <center>
                <p>The election ended.</p>
              </center>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="container-item fix-container">
            <center>
              <h1>The election started.</h1>
            </center>
          </div>
          <div className="container-item fix-container">
            <button
              className="btn"
              type="button"
              onClick={props.endElFn}
              style={btn}
            >
              End
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StartEnd;
