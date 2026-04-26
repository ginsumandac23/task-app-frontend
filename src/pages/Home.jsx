import { useEffect, useState } from "react";
import api from "../api";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

import TaskCard from "../components/TaskCard";
import TaskTabs from "../components/TaskTab";

export default function Home() {

const [tasks, setTasks] = useState([]);
const [title, setTitle] = useState("");
const [activeTab, setActiveTab] = useState("all");
const [showModal, setShowModal] = useState(false);
const [category, setCategory] = useState("others");
const [priority, setPriority] = useState("medium");
const [selectedTask, setSelectedTask] = useState(null);
const [showConfirm, setShowConfirm] = useState(false);

const [editModal, setEditModal] = useState(false);
const [editTask, setEditTask] = useState(null);

const [editTitle, setEditTitle] = useState("");
const [editCategory, setEditCategory] = useState("others");
const [editPriority, setEditPriority] = useState("medium");

const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [taskToDelete, setTaskToDelete] = useState(null);

const { user } = useUser();

const fetchTasks = async () => {
  try {
    let url = "/tasks";

    if (activeTab === "active") url = "/tasks/active";
    if (activeTab === "completed") url = "/tasks/completed";

    const res = await api.get(url);
    setTasks(res.data);

  } catch (err) {
    console.log(err);
    toast.error("Failed to fetch tasks");
  }
};

useEffect(() => {
  fetchTasks();
}, [activeTab]);


const handleOpenModal = () => {
  if (!title.trim()) {
    toast.error("Task cannot be empty");
    return;
  }

  setShowModal(true);
};

const handleOpenEdit = (task) => {
  setEditTask(task);
  setEditTitle(task.title);
  setEditCategory(task.category);
  setEditPriority(task.priority);
  setEditModal(true);
};


const handleUpdateTask = async () => {
  try {
    await api.patch(`/tasks/${editTask._id}`, {
      title: editTitle,
      category: editCategory,
      priority: editPriority
    });

    toast.success("Task updated");

    setEditModal(false);
    setEditTask(null);

    fetchTasks();

  } catch (err) {
    toast.error("Failed to update task");
  }
};


const handleComplete = async (id) => {
  try {
    await api.patch(`/tasks/complete/${id}`);
    fetchTasks();
    toast.success("Task completed");
  } catch (err) {
    toast.error("Error updating task");
  }
};

const handleConfirmAdd = async () => {
  try {
    await api.post("/tasks", {
      title,
      category,
      priority
    });

    toast.success("Task added");

    // reset
    setTitle("");
    setCategory("others");
    setPriority("medium");
    setShowModal(false);

    fetchTasks();

  } catch (err) {
    toast.error("Failed to add task");
  }
};


const handleDelete = (task) => {
  setTaskToDelete(task);
  setShowDeleteConfirm(true);
};

const confirmDeleteTask = async () => {
  try {
    await api.delete(`/tasks/${taskToDelete._id}`);

    toast.success("Task deleted");

    // 🔥 REMOVE from UI immediately
    setTasks((prev) =>
      prev.filter((t) => t._id !== taskToDelete._id)
    );

    // cleanup
    if (selectedTask?._id === taskToDelete._id) {
      setSelectedTask(null);
    }

    setShowDeleteConfirm(false);
    setTaskToDelete(null);

  } catch (err) {
    toast.error("Failed to delete task");
  }
};





  return (
  <>
    <div className="container mt-5">
      <h1 className="pb-3">Hello, {user?.firstName || "User"}</h1>

      <div className="task-addForm pt-5">
        <p className="text-uppercase fs-6">New Task</p>

        <div className="search-wrapper">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="search-input rounded-3"
          />

          <button className="add-btn" onClick={handleOpenModal}>
            <i className="bi bi-plus"></i> Add Task
          </button>
        </div>
      </div>

      <TaskTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="task-card-container pt-5">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            setShowConfirm={setShowConfirm}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>

    {/* MODAL OUTSIDE MAIN CONTAINER */}
    {showModal && (
      <div className="modal-backdrop-custom">
        <div className="modal-card p-4">

          <h5 className="mb-3">Task Details</h5>

          <p className="mb-3">
            <strong>Task:</strong> {title}
          </p>

          <label>Category</label>
          <select
            className="form-select mb-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="planning">Planning</option>
            <option value="others">Others</option>
          </select>

          <label>Priority</label>
          <select
            className="form-select mb-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleConfirmAdd}
            >
              Create Task
            </button>
          </div>

        </div>
      </div>
    )}

    {showConfirm && selectedTask && (
      <div className="modal-backdrop-custom">

        <div className="modal-card p-4">

          <h5>Complete Task?</h5>

          <p>
            Are you sure you want to complete:
            <strong> {selectedTask.title} </strong>?
          </p>

          <div className="d-flex justify-content-end gap-2">

            <button
              className="btn btn-secondary"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>

            <button
              className="btn btn-success"
              onClick={async () => {
                await handleComplete(selectedTask._id);
                setShowConfirm(false);
                setSelectedTask(null);
              }}
            >
              Yes, Complete
            </button>

          </div>

        </div>

      </div>
    )}

    {editModal && editTask && (
      <div className="modal-backdrop-custom">

        <div className="modal-card p-4">

          <h5 className="mb-3">Edit Task</h5>

          {/* Title */}
          <label>Title</label>
          <input
            type="text"
            className="form-control mb-3"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          {/* Category */}
          <label>Category</label>
          <select
            className="form-select mb-3"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="planning">Planning</option>
            <option value="others">Others</option>
          </select>

          {/* Priority */}
          <label>Priority</label>
          <select
            className="form-select mb-3"
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2">

            <button
              className="btn btn-secondary"
              onClick={() => setEditModal(false)}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleUpdateTask}
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>
    )}


    {showDeleteConfirm && taskToDelete && (
      <div className="modal-backdrop-custom">

        <div className="modal-card p-4">

          <h5>Delete Task?</h5>

          <p>
            Are you sure you want to delete:
            <strong> {taskToDelete.title} </strong>?
          </p>

          <div className="d-flex justify-content-end gap-2">

            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowDeleteConfirm(false);
                setTaskToDelete(null);
              }}
            >
              Cancel
            </button>

            <button
              className="btn btn-danger"
              onClick={confirmDeleteTask}
            >
              Yes, Delete
            </button>

          </div>

        </div>

      </div>
    )}


  </>
);


}