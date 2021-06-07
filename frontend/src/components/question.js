import React, { useEffect, useState } from "react";

import "../css/question.css";

const Question = (props) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // getting the answer list!
    if (props.question !== undefined) {
      fetch("http://127.0.0.1:8000/api/answers/getQuestionAnswers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: props.question.id }),
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          // pass the response objects to state
            console.log("Answers: ", response.result)
          setAnswers(response.result);
        })
        .catch((error) => console.log(error));
    }
  }, [props.question]);

  console.log("Answer the question!!!", props.question);
  if (props.question !== undefined) {
    return (
      <div className="container">
        <div>{props.question.text}</div>
      </div>
    );
  } else {
    return null;
  }
};

export default Question;
