import React, { Component } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import Navbar from "./Navbar/Navigation";
import NavbarAdmin from "./Navbar/NavigationAdmin";
import UserHome from "./UserHome";
import StartEnd from "./StartEnd";
import ElectionStatus from "./ElectionStatus";

import getWeb3 from "../getWeb3";
import Election from "../contracts/Election.json";

import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      elStarted: false,
      elEnded: false,
      elDetails: {},
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

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ elStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ elEnded: end });

      const electionDetails = await this.state.ElectionInstance.methods
        .getElectionDetails()
        .call();

      this.setState({
        elDetails: {
          adminName: electionDetails.adminName,
          adminEmail: electionDetails.adminEmail,
          adminTitle: electionDetails.adminTitle,
          electionTitle: electionDetails.electionTitle,
          organizationTitle: electionDetails.organizationTitle,
        },
      });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  endElection = async () => {
    await this.state.ElectionInstance.methods
      .endElection()
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };
  registerElection = async (data) => {
    await this.state.ElectionInstance.methods
      .setElectionDetails(
        data.adminFName.toLowerCase() + " " + data.adminLName.toLowerCase(),
        data.adminEmail.toLowerCase(),
        data.adminTitle.toLowerCase(),
        data.electionTitle.toLowerCase(),
        data.organizationTitle.toLowerCase()
      )
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          <Navbar />
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }
    return (
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
        <div className="container-main">
          <div className="container-item center-items info">
            Your Account: {this.state.account}
          </div>
        </div>
        {this.state.isAdmin ? (
          <>
            <this.renderAdminHome />
          </>
        ) : this.state.elStarted ? (
          <>
            <UserHome el={this.state.elDetails} />
          </>
        ) : !this.state.isElStarted && this.state.isElEnded ? (
          <>
            <div className="container-item attention">
              <center>
                <h3>The Election ended.</h3>
              </center>
            </div>
          </>
        ) : null}
      </>
    );
  }

  renderAdminHome = () => {
    const EMsg = (props) => {
      return <span style={{ color: "tomato" }}>{props.msg}</span>;
    };

    const AdminHome = () => {
      const {
        handleSubmit,
        register,
        formState: { errors },
      } = useForm();

      const onSubmit = (data) => {
        this.registerElection(data);
      };

      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!this.state.elStarted & !this.state.elEnded ? (
              <div className="container-main">
                {/* about-admin */}
                <div className="about-admin">
                  <h3 className="title-hero"><ion-icon name="shield-half-outline"></ion-icon> About-Admin</h3>
                  <div className="container-item center-items">
                    <div>
                      <label className="label-home">
                        AKA{" "}
                        {errors.adminFName && <EMsg msg="*required" />}
                        <div className="field">
                          <input
                            className="input-home"
                            type="text"
                            placeholder="First Name"
                            {...register("adminFName", {
                              required: true,
                            })}
                          />
                        </div>
                        <div className="field">
                          <input
                            className="input-home"
                            type="text"
                            placeholder="Last Name"
                            {...register("adminLName")}
                          />
                        </div>
                      </label>

                      <label className="label-home">
                        E-mail{" "}
                        {errors.adminEmail && (
                          <EMsg msg={errors.adminEmail.message} />
                        )}
                        <div className="field">
                          <input
                            className="input-home"
                            placeholder="eg. you@example.com"
                            name="adminEmail"
                            {...register("adminEmail", {
                              required: "*Required",
                              pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                message: "*Invalid",
                              },
                            })}
                          />
                        </div>
                      </label>

                      <label className="label-home">
                        Role{" "}
                        {errors.adminTitle && <EMsg msg="*required" />}
                        <div className="field">
                          <input
                            className="input-home"
                            type="text"
                            placeholder="eg. HR Head "
                            {...register("adminTitle", {
                              required: true,
                            })}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                {/* about-election */}
                <div className="about-election">
                  <h3 className="title-hero"><ion-icon name="reader-outline"></ion-icon> About-Event</h3>
                  <div className="container-item center-items">
                    <div>
                      <label className="label-home">
                        Event{" "}
                        {errors.electionTitle && <EMsg msg="*required" />}
                        <div className="field">
                          <input
                            className="input-home"
                            type="text"
                            placeholder="eg. School Election"
                            {...register("electionTitle", {
                              required: true,
                            })}
                          />
                        </div>
                      </label>
                      <label className="label-home">
                        Organization Name{" "}
                        {errors.organizationName && <EMsg msg="*required" />}
                        <div className="field">
                          <input
                            className="input-home"
                            type="text"
                            placeholder="eg. Lifeline Academy"
                            {...register("organizationTitle", {
                              required: true,
                            })}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : this.state.elStarted ? (
              <UserHome el={this.state.elDetails} />
            ) : null}
            <StartEnd
              elStarted={this.state.elStarted}
              elEnded={this.state.elEnded}
              endElFn={this.endElection}
            />
            <ElectionStatus
              elStarted={this.state.elStarted}
              elEnded={this.state.elEnded}
            />
          </form>
        </div>
      );
    };
    return <AdminHome />;
  };
}
