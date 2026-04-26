export default function TaskCard({
  task,
  selectedTask,
  setSelectedTask,
  setShowConfirm,
  onEdit,
  onDelete
}) {

  const isSelected = selectedTask?._id === task._id;

  return (
    <div
      className={`task-card p-4 position-relative mb-3 border rounded-4 ${
        task.completed ? "bg-completed" : ""
      }`}
    >

      {/* Tags */}
      <div className="taskTags d-flex gap-2">
        <span className={`task-prio task-prio-${task.priority}`}>
          {task.priority}
        </span>

        <span className={`task-category category-${task.category}`}>
          {task.category}
        </span>
      </div>

      {/* Checkbox */}
      <div className="form-check text-start">
        <input
          type="checkbox"
          className="form-check-input fs-5"
          checked={task.completed || isSelected}
          disabled={task.completed}
          onChange={() =>
            setSelectedTask(isSelected ? null : task)
          }
        />

        <label
          className={`form-check-label fs-5 ${
            task.completed ? "text-decoration-line-through text-muted" : ""
          }`}
        >
          {task.title}
        </label>
      </div>

      {/* ACTION BUTTONS */}
      {isSelected && !task.completed && (
        <div className="task-actions position-absolute top-0 end-0 m-2 d-flex gap-2">

          <button
            className="btn btn-sm btn-warning"
            onClick={() => onEdit(task)}
          >
            Update
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(task)}
          >
            Delete
          </button>

          <button
            className="btn btn-sm btn-success"
            onClick={() => setShowConfirm(true)}
          >
            Complete
          </button>

        </div>
      )}

    </div>
  );
}