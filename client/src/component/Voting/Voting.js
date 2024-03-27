import React, { Component } from "react";
import { Link } from "react-router-dom";

import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";

import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";

import "./Voting.css";

export default class Voting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      candidateCount: undefined,
      candidates: [],
      isElStarted: false,
      isElEnded: false,
      currentVoter: {
        address: undefined,
        name: null,
        phone: null,
        hasVoted: false,
        isVerified: false,
        isRegistered: false,
      },
    };
  }
  componentDidMount = async () => {

    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {

      const web3 = await getWeb3();


      const accounts = await web3.eth.getAccounts();


      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );


      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });


      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });


      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });


      for (let i = 1; i <= this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i - 1)
          .call();
        this.state.candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
        });
      }
      this.setState({ candidates: this.state.candidates });

      const voter = await this.state.ElectionInstance.methods
        .voterDetails(this.state.account)
        .call();
      this.setState({
        currentVoter: {
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
        },
      });


      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
    } catch (error) {

      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  renderCandidates = (candidate) => {
    const castVote = async (id) => {
      await this.state.ElectionInstance.methods
        .vote(id)
        .send({ from: this.state.account, gas: 1000000 });
      window.location.reload();
    };
    const confirmVote = (id, header) => {
      var r = window.confirm(
        "Vote for " + header + " with Id " + id + ".\nAre you sure?"
      );
      if (r === true) {
        castVote(id);
      }
    };
    return (
      <div className="card-ctn-hero">
        <div className="candidate-info">
          <h2 className="name-cd">
            {candidate.header} <small className="cd-number">#{candidate.id}</small>
          </h2>
          <p className="slogan slogan-hero">{candidate.slogan}</p>
        </div>
        <div className="vote-btn-container">

          <div>
            <button
              onClick={() => confirmVote(candidate.id, candidate.header)}
              className="button-hero"
              disabled={
                !this.state.currentVoter.isRegistered ||
                !this.state.currentVoter.isVerified ||
                this.state.currentVoter.hasVoted
              }
            >
              Vote
            </button>
          </div>

        </div>
      </div>
    );
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }

    return (
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
        <div>
          {!this.state.isElStarted && !this.state.isElEnded ? (
            <NotInit />
          ) : this.state.isElStarted && !this.state.isElEnded ? (
            <>
              {this.state.currentVoter.isRegistered ? (
                this.state.currentVoter.isVerified ? (
                  this.state.currentVoter.hasVoted ? (
                    <div className="container-item success">
                      <div>
                        <strong>You've casted your vote.</strong>
                        <p />
                        <center>
                          <Link
                            to="/Results"
                            style={{
                              color: "black",
                              textDecoration: "underline",
                            }}
                          >
                            See Results
                          </Link>
                        </center>
                      </div>
                    </div>
                  ) : (
                    <div className="container-item info">
                      <center>Go ahead and cast your vote.</center>
                    </div>
                  )
                ) : (
                  <div className="container-item attention">
                    <center>Please wait for admin to verify.</center>
                  </div>
                )
              ) : (
                <>
                  <div className="container-item attention">
                    <center>
                      <p>You're not registered. Please register first.</p>
                      <br />
                      <Link
                        to="/Registration"
                        style={{ color: "black", textDecoration: "underline" }}
                      >
                        Registration Page
                      </Link>
                    </center>
                  </div>
                </>
              )}
              <div className="container-main">
                <h3 className="title-hero"> Candidates</h3>
                {this.state.candidates.length < 1 ? (
                  <div className="container-item attention">
                    <center>Not one to vote for.</center>
                  </div>
                ) : (
                  <>

                    <div className="card-container">
                      {this.state.candidates.map(this.renderCandidates)}
                    </div>

                  </>
                )}
              </div>
            </>
          ) : !this.state.isElStarted && this.state.isElEnded ? (
            <>
              <div className="container-item attention">
                <center>
                  <h3>The Election ended.</h3>
                  <br />
                  <Link
                    to="/Results"
                    style={{ color: "#2495ff", textDecoration: "none" }}
                  >
                    See results
                  </Link>
                </center>
              </div>
            </>
          ) : null}
        </div>
      </>
    );
  }
}
