import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { Parsing } from "../components/Parsing";
import CollectionItem from "../components/CollectionItem";

const Teacher = () => {
  const validTypes = ["MC", "SA", "Rearrange", "Prompt", "Import"];
  const [questions, setQuestions] = useState([]);

  const [newQuestion, setNewQuestion] = useState({
    collection: "",
    question: "",
    type: "MC",
    op1: "",
    op2: "",
    op3: "",
    op4: "",
    prompt: "",
    answer: "",
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({
    question: "",
    prompt: "",
    op1: "",
    op2: "",
    op3: "",
    op4: "",
    answer: "",
  });
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const [data, setData] = useState("");
  const [updateCollection, setUpdateCollection] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [data,updateCollection]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/questions/");
      setQuestions(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleEdit = (questionId) => {
    const questionToEdit = questions.find(
      (question) => question.id === questionId
    );
    setEditingQuestion(questionId);
    setEditedQuestion({
      question: questionToEdit.question,
      prompt: questionToEdit.prompt,
      op1: questionToEdit.op1,
      op2: questionToEdit.op2,
      op3: questionToEdit.op3,
      op4: questionToEdit.op4,
      answer: questionToEdit.answer,
    });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditedQuestion({
      question: "",
      prompt: "",
      op1: "",
      op2: "",
      op3: "",
      op4: "",
      answer: "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedQuestion = { id: editingQuestion, ...editedQuestion };
      await axios.put(
        `http://localhost:8000/questions/${editingQuestion}`,
        updatedQuestion
      );
      console.log("Question edited:", updatedQuestion);
      fetchQuestions();
      setEditingQuestion(null);
      setEditedQuestion({
        question: "",
        prompt: "",
        op1: "",
        op2: "",
        op3: "",
        op4: "",
        answer: "",
      });
    } catch (error) {
      console.error("Error editing question:", error);
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await axios.delete(`http://localhost:8000/questions/${questionId}`);
      console.log("Question deleted:", questionId);
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleBulkDelete = async (collection_name) => {
    try {
      await axios.delete(`http://localhost:8000/bulkDelete/${collection_name}`);
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/questions/",
        newQuestion
      );
      console.log("Question added:", data);

      setNewQuestion({
        collection: newQuestion.collection,
        question: "",
        type: newQuestion.type,
        op1: "",
        op2: "",
        op3: "",
        op4: "",
        prompt: "",
        answer: "",
      });

      fetchQuestions();
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };


  const allowAddQuestion = () => {
    // newQuestion.type === "MC"

    if (newQuestion.type === "SA" || newQuestion.type === "Rearrange") {
      return (
        newQuestion.collection === "" ||
        newQuestion.question === "" ||
        newQuestion.answer === ""
      );
    } else if (newQuestion.type === "Prompt") {
      return (
        newQuestion.collection === "" ||
        newQuestion.question === "" ||
        newQuestion.prompt === "" ||
        newQuestion.answer === ""
      );
    } else if (newQuestion.type === "MC") {
      return (
        newQuestion.collection === "" ||
        newQuestion.question === "" ||
        newQuestion.answer === "" ||
        newQuestion.op1 === "" ||
        newQuestion.op2 === "" ||
        newQuestion.op3 === "" ||
        newQuestion.op4 === ""
      );
    }
    return true;
  };

  return (
    <div className="App">
      <h1>Questions Teacher View</h1>

      <div>
        <h2>Add a Question</h2>
        <div>
          <label>
            Collection:
            <input
              type="text"
              name="collection"
              value={newQuestion.collection}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Type:
            <select
              name="type"
              value={newQuestion.type}
              onChange={handleInputChange}
            >
              {validTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        {newQuestion.type !== "Import" && (
          <label>
            Question:
            <input
              type="text"
              name="question"
              value={newQuestion.question}
              onChange={handleInputChange}
            />
          </label>
        )}
        <div>
          {newQuestion.type === "MC" && (
            <div>
              <label>
                op1:
                <input
                  type="text"
                  name="op1"
                  value={newQuestion.op1}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                op2:
                <input
                  type="text"
                  name="op2"
                  value={newQuestion.op2}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                op3:
                <input
                  type="text"
                  name="op3"
                  value={newQuestion.op3}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                op4:
                <input
                  type="text"
                  name="op4"
                  value={newQuestion.op4}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          )}
        </div>

        {newQuestion.type === "Prompt" && (
          <div>
            <label>
              Prompt:
              <input
                type="text"
                name="prompt"
                value={newQuestion.prompt}
                onChange={handleInputChange}
              />
            </label>
          </div>
        )}

        {newQuestion.type !== "Import" && (
          <div>
            <div>
              <label>
                Answer:
                <input
                  type="text"
                  name="answer"
                  value={newQuestion.answer}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <button onClick={handleAddQuestion} disabled={allowAddQuestion()}>
              Add Question
            </button>
          </div>
        )}

        {newQuestion.type === "Import" && (
          <Parsing collectionName={newQuestion.collection} setData={setData} />
        )}
      </div>

      {Object.entries(
        questions.reduce((groups, question) => {
          if (!groups[question.collection]) {
            groups[question.collection] = [];
          }
          groups[question.collection].push(question);
          return groups;
        }, {})
      ).map(([collection, group]) => (
        <div key={collection}>
          <div style={{ display: "flex", alignItems: "center" }}>

            <CollectionItem
              key={collection}
              collection={collection}
              handleBulkDelete={handleBulkDelete}
              setUpdateCollection={setUpdateCollection}
              updateCollection={updateCollection}
              setCollapsedGroups={setCollapsedGroups}
            />
          </div>
          {collapsedGroups[collection] && (
            <ul>
              {group.map((question) => (
                <li key={question.id}>
                  {editingQuestion === question.id ? (
                    <>
                      <div>
                        <label>
                          question:
                          <input
                            type="text"
                            name="question"
                            value={editedQuestion.question}
                            onChange={(e) =>
                              setEditedQuestion((prev) => ({
                                ...prev,
                                question: e.target.value,
                              }))
                            }
                          />
                        </label>
                      </div>

                      {question.type === "MC" && (
                        <div>
                          <label>
                            op1:
                            <input
                              type="text"
                              name="op1"
                              value={editedQuestion.op1}
                              onChange={(e) =>
                                setEditedQuestion((prev) => ({
                                  ...prev,
                                  op1: e.target.value,
                                }))
                              }
                            />
                          </label>

                          <label>
                            op2:
                            <input
                              type="text"
                              name="op2"
                              value={editedQuestion.op2}
                              onChange={(e) =>
                                setEditedQuestion((prev) => ({
                                  ...prev,
                                  op2: e.target.value,
                                }))
                              }
                            />
                          </label>

                          <label>
                            op3:
                            <input
                              type="text"
                              name="op3"
                              value={editedQuestion.op3}
                              onChange={(e) =>
                                setEditedQuestion((prev) => ({
                                  ...prev,
                                  op3: e.target.value,
                                }))
                              }
                            />
                          </label>
                          <label>
                            op4:
                            <input
                              type="text"
                              name="op4"
                              value={editedQuestion.op4}
                              onChange={(e) =>
                                setEditedQuestion((prev) => ({
                                  ...prev,
                                  op4: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </div>
                      )}

                      {question.type === "Prompt" && (
                        <div>
                          <label>
                            prompt
                            <input
                              type="text"
                              name="prompt"
                              value={editedQuestion.prompt}
                              onChange={(e) =>
                                setEditedQuestion((prev) => ({
                                  ...prev,
                                  prompt: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </div>
                      )}
                      <label>
                        answer:
                        <input
                          type="text"
                          name="answer"
                          value={editedQuestion.answer}
                          onChange={(e) =>
                            setEditedQuestion((prev) => ({
                              ...prev,
                              answer: e.target.value,
                            }))
                          }
                        />
                      </label>

                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <h3>
                        {question.type}: {question.question}
                      </h3>

                      {question.type === "MC" && (
                        <div>
                          <label>
                            op1:
                            <input
                              type="text"
                              name="op1"
                              value={question.op1}
                              disabled
                            />
                          </label>
                          <label>
                            op2:
                            <input
                              type="text"
                              name="op2"
                              value={question.op2}
                              disabled
                            />
                          </label>
                          <label>
                            op3:
                            <input
                              type="text"
                              name="op3"
                              value={question.op3}
                              disabled
                            />
                          </label>
                          <label>
                            op4:
                            <input
                              type="text"
                              name="op4"
                              value={question.op4}
                              disabled
                            />
                          </label>
                        </div>
                      )}

                      {question.type === "Prompt" && (
                        <label>
                          prompt:
                          <input
                            type="text"
                            name="prompt"
                            value={question.prompt}
                            disabled
                          />
                        </label>
                      )}

                      <div>
                        <label>
                          answer:
                          <input
                            type="text"
                            name="answer"
                            value={question.answer}
                            disabled
                          />
                        </label>
                      </div>

                      <button onClick={() => handleEdit(question.id)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(question.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Teacher;
