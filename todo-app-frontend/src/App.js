import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    }, []);

    const addTask = () => {
        axios.post('http://localhost:5000/tasks', { title, completed: false })
            .then(response => setTasks([...tasks, response.data]))
            .catch(error => console.error(error));
        setTitle('');
    };

    const deleteTask = (id) => {
        axios.delete(`http://localhost:5000/tasks/${id}`)
            .then(() => setTasks(tasks.filter(task => task._id !== id)))
            .catch(error => console.error(error));
    };

    const startEditing = (task) => {
        setEditingTaskId(task._id);
        setEditingTitle(task.title);
    };

    const updateTask = (id) => {
        axios.put(`http://localhost:5000/tasks/${id}`, { title: editingTitle })
            .then(response => {
                setTasks(tasks.map(task => (task._id === id ? response.data : task)));
                setEditingTaskId(null);
                setEditingTitle('');
            })
            .catch(error => console.error(error));
    };

    return (
        <div className='container'>
            <h1>Todo List</h1>
            <div className='addclass'>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New Task"
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        {editingTaskId === task._id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                />
                                <button className='update-button' onClick={() => updateTask(task._id)}>Update</button>
                                <button className='cancel-button' onClick={() => setEditingTaskId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {task.title}
                                <button className='edit-button' onClick={() => startEditing(task)}>Edit</button>
                                <button onClick={() => deleteTask(task._id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
