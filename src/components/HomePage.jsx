import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import {logout } from '../authService';

function HomePage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [update, setUpdate] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token available");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get("http://127.0.0.1:8000/todos/", config);

      setTodos(response.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleCompletedChange = (event) => {
    setCompleted(event.target.checked);
  };

  const handleAddTodo = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const newTodo = {
        title: title,
        description: description,
        completed: false,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/todos/",
        newTodo,
        config
      );

      setTodos([...todos, response.data]);

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`http://127.0.0.1:8000/todos/${id}/`, config);

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
          <button
          style={{float:"right"}}
                className="btn btn-danger ms-2"
                onClick={() =>{localStorage.removeItem('token');window.location.reload()}}
              >
                logout
              </button>
      <h1 className="mt-5 mb-4">Todo List</h1>
      <div className="mb-3">
        <label>Title:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="mb-3">
        <label>Description:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={handleAddTodo}>
        Add Todo
      </button>
      <ul className="list-group">
        {todos.map((todo, index) => (
          <li className="list-group-item d-flex justify-content-between" key={index}>
            <div>
              <h5>{todo.title}</h5>
              <p>{todo.description}</p>
              <p>Date: {todo.created_at}</p>
            </div>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleCompletedChange(todo.id)}
                className="form-check-input"
              />
              <label className="form-check-label ms-2">Completed</label>
              <button
                className="btn btn-danger ms-2"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => {
                  openModal();
                  setUpdate(todo);
                }}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Todo Modal */}
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Title:</label>
            <input
              type="text"
              className="form-control"
              value={update.title}
              onChange={(e) => setUpdate({ ...update, title: e.target.value })}
            />
          </div>
          <div className="mt-2">
            <label>Description:</label>
            <input
              type="text"
              className="form-control"
              value={update.description}
              onChange={(e) =>
                setUpdate({ ...update, description: e.target.value })
              }
            />
          </div>
          <div className="mt-2">
            <label>Date:</label>
            <input
              type="text"
              className="form-control"
              value={update.date}
              onChange={(e) => setUpdate({ ...update, date: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HomePage;
