import React, { useEffect, useState } from "react";

import { useCookies } from "react-cookie";

import "../css/question.css";

const Question = (props) => {
  const [answers, setAnswers] = useState([]);
  const [token] = useCookies(["spirit-token"]); // used to access the token!!!
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [user] = useState();

  useEffect(() => {
    // getting the answer list!
    if (props.question !== undefined) {
      fetch("http://127.0.0.1:8000/api/answers/getQuestionAnswers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({ question: props.question.id }),
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          // pass the response objects to state
          console.log("Answers: ", response.result);
          setAnswers(response.result);
        })
        .catch((error) => console.log(error));
    }
  }, [props.question, token]);

  const clickAnswerQuestion = () => {};

  const selectAnswer = (event) => {
    console.log(event.target.value);
    setSelectedAnswer(event.target.value);
  };

  console.log("Answer the question!!!", props.question);
  if (props.question !== undefined && answers !== []) {
    return (
      <div className="container">
        <div className="header">{props.question.text}</div>
        {answers.map((answer) => {
          console.log("Mapping questions, ", answer.text);
          return (
            <div className="answerContainer" onChange={selectAnswer}>
              <input type="radio" name="choiceButton" value={answer.id}></input>
              <div className="answer">{answer.text}</div>
            </div>
          );
        })}
        <button onClick={clickAnswerQuestion}>OK</button>
      </div>
    );
  } else {
    return null;
  }
};

export default Question;
