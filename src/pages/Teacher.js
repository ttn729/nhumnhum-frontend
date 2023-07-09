import React, { useState, useEffect } from "react";
import axios from "axios";
import '../App.css';

const Teacher = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    prompt: "",
    type: "",
    collection: "",
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({
    prompt: "",
    type: "",
  });
  const [collapsedGroups, setCollapsedGroups] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, []);


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
      prompt: questionToEdit.prompt,
      type: questionToEdit.type,
    });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditedQuestion({ prompt: "", type: "" });
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
      setEditedQuestion({ prompt: "", type: "" });
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

  const handleAddQuestion = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/questions/",
        newQuestion
      );
      console.log("Question added:", data);
      setNewQuestion({ prompt: "", type: "", collection: "" });
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

  const toggleGroupCollapse = (collection) => {
    setCollapsedGroups((prevState) => ({
      ...prevState,
      [collection]: !prevState[collection],
    }));
  };

  return (
    <div className="App">
      <h1>Questions Teacher View</h1>

      <div>
        <h2>Add a Question</h2>
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
          Prompt:
          <input
            type="text"
            name="prompt"
            value={newQuestion.prompt}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={newQuestion.type}
            onChange={handleInputChange}
          />
        </label>

        <button onClick={handleAddQuestion}>Add Question</button>
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
          <h2
            onClick={() => toggleGroupCollapse(collection)}
            style={{ cursor: "pointer" }}
          >
            {collection}
          </h2>
          {!collapsedGroups[collection] && (
            <ul>
              {group.map((question) => (
                <li key={question.id}>
                  {editingQuestion === question.id ? (
                    <>
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
                      <input
                        type="text"
                        name="type"
                        value={editedQuestion.type}
                        onChange={(e) =>
                          setEditedQuestion((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                      />
                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <h3>{question.prompt}</h3>
                      <p>{question.type}</p>
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
}

export default Teacher;
