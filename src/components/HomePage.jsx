import React, { useState, useEffect } from "react";
import axios from "axios";
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
    const [expandedTodoId, setExpandedTodoId] = useState(null);
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
  
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
      setTitleError(""); // Reset title error when title is changed
    };
  
    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
      setDescriptionError(""); // Reset description error when description is changed
    };
  
    const handleDateChange = (event) => {
      setDate(event.target.value);
    };
  
    const handleCompletedChange = (event) => {
      setCompleted(event.target.checked);
    };
  
    const handleAddTodo = async () => {
      try {
        if (!title.trim()) {
          setTitleError("Please enter a title");
          return;
        }
  
        if (!description.trim()) {
          setDescriptionError("Please enter a description");
          return;
        }
  
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
  
    const updateTodo = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
  
        const updatedTodo = {
          title: update.title,
          description: update.description,
          completed: update.completed // You might want to keep the completed status unchanged
        };
  
        await axios.put(`http://127.0.0.1:8000/todos/${update.id}/`, updatedTodo, config);
        
        // If you want to update UI after update, you can handle it here
  
        // Close the modal after successful update
        closeModal()
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [isModalOpen]);
  
    // Function to toggle expanded state for a todo
    const toggleExpandTodo = (id) => {
      setExpandedTodoId((prevId) => (prevId === id ? null : id));
    };
  
  return (
    <div className="container">
          <button
          style={{float:"right"}}
                className="btn btn-danger ms-2"
                onClick={() =>{localStorage.removeItem('refreshToken');window.location.reload()}}
              >
                logout
              </button>
      <h1 className="mt-5 mb-4">Todo List</h1>
     
      <div className="row mb-3">
      <div className="row mb-3">
        <div className="col-md-6">
          <label>Title:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter title"
            value={title}
            onChange={handleTitleChange}
          />
          {titleError && <div className="text-danger">{titleError}</div>}
        </div>
        <div className="col-md-6">
          <label>Description:</label>
          <textarea
            className="form-control"
            placeholder="Enter description"
            value={description}
            onChange={handleDescriptionChange}
          />
          {descriptionError && <div className="text-danger">{descriptionError}</div>}
        </div>
      </div>
</div>
<center>
<button className="btn btn-primary mb-3" onClick={handleAddTodo} style={{width:"300px"}}>
    Add Todo
</button>
</center>

      <ul className="list-group">
      {todos.map((todo, index) => (
                    <li key={index} className="list-group-item">
                        <div style={{ cursor: 'pointer' ,margin:"3px"}} onMouseEnter={() => toggleExpandTodo(todo.id)} 
                        onMouseLeave={() => toggleExpandTodo(todo.id)}>
                            <h5>{todo.title}</h5>
                            <p style={{float:"right",marginTop:"-30px"}}>Date: {todo.created_at}</p>
                            {expandedTodoId === todo.id && ( // Render details if expanded
                                <div>
                                    <p>{todo.description}</p>
                                    <p>{todo.completed ? "Completed" : " Not completed"}</p>
                                   
                                    <div>
                                        <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>Delete</button>
                                        <button className="btn btn-secondary ms-2" onClick={() => { openModal(); setUpdate(todo); }}>Edit</button>
                                    </div>
                                </div>
                            )}
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
            <textarea
              type="text"
              className="form-control"
              value={update.description}
              onChange={(e) =>
                setUpdate({ ...update, description: e.target.value })
              }
            />
          </div>
          <div className="mt-2">
        <label htmlFor="modal-date" className="form-label">Completed:</label>
        <input
            type="checkbox"
            className="form-check-input"
            id="modal-date"
            checked={update.completed}
            onChange={(e) => setUpdate({ ...update, completed: e.target.checked })}
        />
        </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HomePage;
