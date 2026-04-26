export default function TaskTabs({ activeTab, setActiveTab }) {
  return (
    <div className="task-tabs d-flex gap-5 pt-5 pb-3 align-items-center">

      <a onClick={() => setActiveTab("all")}
        className={activeTab === "all" ? "active-tab" : ""}>
        All Task
      </a>

      <a onClick={() => setActiveTab("active")}
        className={activeTab === "active" ? "active-tab" : ""}>
        Active
      </a>

      <a onClick={() => setActiveTab("completed")}
        className={activeTab === "completed" ? "active-tab" : ""}>
        Completed
      </a>

    </div>
  );
}