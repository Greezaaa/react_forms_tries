import React, { useState, useCallback } from "react";
import { prefixOptions } from './prefixOptions.js';
function Form() {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswerChange = useCallback(
    (event) => {
      const fieldName = event.target.name;
      const fieldValue = event.target.value;
      setAnswers({ ...answers, [fieldName]: fieldValue });
    },
    [answers]
  );

  const handleSubmit = useCallback(() => {
    if (page < 3) {
      setPage((page) => page + 1);
    } 
    // else if (page === 3) {
    //   setShowResult(false);
    // } 
    else {
      setShowResult(true);
    }
  }, [page]);

  const handleSaveData = useCallback(() => {
    localStorage.setItem("formAnswers", JSON.stringify(answers));
    setAnswers({});
    setPage(0);
    setShowResult(false);
  }, [answers]);

  const validateName = useCallback(() => {
    const name = answers.name || "";
    return name.length >= 3 && !/\d/.test(name);
  }, [answers.name]);

  const validateEmail = useCallback(() => {
    const email = answers.email || "";
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }, [answers.email]);

const validatePhone = useCallback(() => {
    const phone = answers.phone || "";
    const isValidPrefix = prefixOptions.some(
      (option) => option.value === answers.phonePrefix
    )

    return isValidPrefix && phone !== "";
})

  const question = [
    {
      label: "What is your name?",
      name: "name",
      validator: validateName,
    },
    {
      label: "What is your email address?",
      name: "email",
      validator: validateEmail,
    },
    {
      label: "What is your phone number?",
      name: "phone",
      options: prefixOptions,
      validator: validatePhone,
    },
    {
      label: "Select what kind of page you want?",
      name: "pageChoice",
      options: [
        { value: "newPage", label: "New page" },
        { value: "renewPage", label: "Renew my old page" },
      ],
    },
  ];

  const currentQuestion = question[page] || {};
  const isCurrentValid = currentQuestion.validator
    ? currentQuestion.validator()
    : true;

  return (
    <>
    <p>{page}</p>
      {page < question.length && (
        <>
          <h2>{currentQuestion.label}</h2>
          {currentQuestion.name === "phone" && (
            <>
              <select
                name="phonePrefix"
                value={answers.phonePrefix || ""}
                onChange={handleAnswerChange}
                required
              >
                <option value="">Select prefix</option>
                {currentQuestion.options.map((option, index) => (
                  <option key={`${option.value}-${index}`} value={option.value}>
                    {option.label + "(" + option.value+ ")"}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="phone"
                value={answers.phone || ""}
                onChange={handleAnswerChange}
                required
              />
            </>
          )}
          {currentQuestion.name !== "phone" &&
            currentQuestion.name !== "pageChoice" && (
              <input
                type={currentQuestion.name === "email" ? "email" : "text"}
                name={currentQuestion.name}
                value={answers[currentQuestion.name] || ""}
                onChange={handleAnswerChange}
                required
              />
            )}
          {currentQuestion.name === "pageChoice" && (
            <select
              name="pageChoice"
              value={answers.pageChoice || ""}
              onChange={handleAnswerChange}
            >
              <option value="">Select a page type</option>
              {currentQuestion.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {!isCurrentValid && (
            <p style={{ color: "red" }}>Please enter a valid value</p>
          )}
          <br />
          {page > 0 && (
            <button onClick={() => setPage((page) => page - 1)}>Previous</button>
          )}
          {page < 4 && (
            <button
              onClick={handleSubmit}
              disabled={!isCurrentValid || !answers[currentQuestion.name]}
            >
              {page === 3 ? "Save data" : "Next"}
            </button>
          )}
        </>
      )}
      {showResult && (
        <div>
          <h2>Form results:</h2>
          <p>Name: {answers.name}</p>
          <p>Email: {answers.email}</p>
          <p>
            Phone: {answers.phonePrefix} {answers.phone}
          </p>
          <p>Page type: {answers.pageChoice}</p>
          <br />
          <button onClick={() => setPage((page) => page - 1)}>Modify data</button>
          <button onClick={handleSaveData}>Save to local storage</button>
        </div>
      )}
    </>
  );
}

export default Form;