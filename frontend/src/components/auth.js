import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/auth.css";

const Auth = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useCookies(["spirit-token"]);

  useEffect(() => {
    console.log(token);
    if (token["spirit-token"] && token["spirit-token"] !== undefined) {
      // checking for cookie
      console.log("redirecting");
      window.location.href = "/map";
    }
  }, [token]);

  const login = () => {
    fetch("http://127.0.0.1:8000/auth/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: password }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log("Auth response:", response);
        if (response.token) {
          setToken("spirit-token", response.token);
        } else {
          console.log("No token for this user!");
          toast("Nepareizs lietotāja vārds vai parole!"); // show warning
        }
      })
      .catch((error) => console.log(error));
  };

  const register = () => {
    fetch("http://127.0.0.1:8000/api/users/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: password }),
    })
      .then((response) => {
        login();
      })
      .catch((error) => console.log(error));
  };

  const loginClicked = () => {
    register(); // tries to register the user, if registered, logs it in
  };

  return (
    <div>
      <header className="header">
        <h1>Ielogojies vai reģistrējies</h1>
      </header>
      <div className="body">
        <label htmlFor="username" className="text">
          Lietotājvārds
        </label>
        <input
          className="userInput"
          id="username"
          type="text"
          placeholder="Lietotājvārds"
          value={userName}
          onChange={(evt) => {
            setUserName(evt.target.value);
          }}
        />
        <br />
        <label htmlFor="password" className="text">
          Parole
        </label>
        <input
          className="userInput"
          id="password"
          type="password"
          placeholder="Parole"
          value={password}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        />
        <br />
        <ToastContainer />

        <button onClick={loginClicked}>Ielogoties</button>
      </div>
    </div>
  );
};

export default Auth;
