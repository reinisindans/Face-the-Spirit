import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          toast("Wrong username or password!"); // show warning
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
      <label htmlFor="username">Username</label>
      <br />
      <input
        id="username"
        type="text"
        placeholder="username"
        value={userName}
        onChange={(evt) => {
          setUserName(evt.target.value);
        }}
      />
      <br />
      <label htmlFor="password">Password</label>
      <br />
      <input
        id="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(evt) => {
          setPassword(evt.target.value);
        }}
      />
      <br />
      <ToastContainer />

      <button onClick={loginClicked}>Login</button>
    </div>
  );
};

export default Auth;
