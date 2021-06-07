import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const Auth = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useCookies(['spirit-token']);

  useEffect(() => {
    console.log(token);
      if (token["spirit-token"]) { // checking for cookie
        console.log("redirecting")
      window.location.href = "/map";
    }
  }, [token]);

  const loginClicked = () => {
    fetch("http://127.0.0.1:8000/auth/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: password }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response.token);
        setToken("spirit-token",response.token); // adding the token to cookies, with name 'spirit-token'
      })
      .catch((error) => console.log(error));
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

      <button onClick={loginClicked}>Login</button>
    </div>
  );
};

export default Auth;
