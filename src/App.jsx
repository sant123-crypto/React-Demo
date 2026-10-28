import { useState } from 'react'
import { nanoid } from 'nanoid'
import './App.css'

function Icon({ name }) {
  const paths = {
    add: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></>,
    close: <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    undo: <><path d="M3 7v6h6" /><path d="M3.5 13a9 9 0 1 0 2.1-6.2L3 10" /></>,
    delete: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 14H6L5 6" /><path d="M10 11v5" /><path d="M14 11v5" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      className="todo-icon"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  )
}

function App() {
  const [todo, addTodo] = useState("");
  const [todoList, addTodoList] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState("");

  const handleTodoChange = (e) => { // Arrow function
    addTodo(e.target.value)
  }

  const handleButtonClick = () => {
    const title = todo.trim();
    if (!title) return;

    addTodoList((currentTodoList) => [...currentTodoList, {
      id: nanoid(),
      title,
      isCompleted: false
    }]);
    addTodo("")
  }

  const handleEditClick = (todoItem) => {
    setEditingTodoId(todoItem.id);
    setEditingTodoTitle(todoItem.title);
  }

  const handleSaveClick = (itemId) => {
    const title = editingTodoTitle.trim();
    if (!title) return;

    addTodoList((currentTodoList) => currentTodoList.map((todoItem) =>
      todoItem.id === itemId
        ? { ...todoItem, title }
        : todoItem
    ));
    setEditingTodoId(null);
    setEditingTodoTitle("");
  }

  const handleCancelClick = () => {
    setEditingTodoId(null);
    setEditingTodoTitle("");
  }

  const handleDeleteClick = (itemId) => {
    addTodoList((currentTodoList) => currentTodoList.filter((todoItem) => todoItem.id !== itemId));
    if (editingTodoId === itemId) {
      handleCancelClick();
    }
  }

  const handleMarkAsCompletedClick = (itemId) => {
    const newList = todoList.map((todoItem) => {
      return todoItem.id === itemId
        ? { ...todoItem, isCompleted: !todoItem.isCompleted }
        : todoItem;
    });
    addTodoList(newList);
  }

  const renderTaskTable = (title, items, emptyMessage) => (
    <section aria-label={title} className="todo-card">
      <div className="todo-card-heading">
        <h2>{title}</h2>
        <span className="todo-count">{items.length} {items.length === 1 ? 'task' : 'tasks'}</span>
      </div>
      <div className="todo-table-wrapper">
        <table className="todo-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Task</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0
              ? <tr>
                <td className="todo-empty" colSpan="3">
                  <span className="todo-empty-icon"><Icon name="check" /></span>
                  {emptyMessage}
                </td>
              </tr>
              : items.map((todoItem, index) => {
                const isEditing = editingTodoId === todoItem.id;

                return <tr className={todoItem.isCompleted ? 'todo-row is-completed' : 'todo-row'} key={todoItem.id}>
                  <td className="todo-number">{String(index + 1).padStart(2, '0')}</td>
                  <td className="todo-title-cell">
                    {isEditing
                      ? <input
                        aria-label="Edit task title"
                        autoFocus
                        className="todo-input todo-edit-input"
                        onChange={(event) => setEditingTodoTitle(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') handleSaveClick(todoItem.id);
                          if (event.key === 'Escape') handleCancelClick();
                        }}
                        type="text"
                        value={editingTodoTitle}
                      />
                      : todoItem.title}
                  </td>
                  <td>
                    <div className="todo-actions">
                      {isEditing
                        ? <>
                          <button
                            aria-label="Save task"
                            className="todo-icon-button action-save"
                            disabled={!editingTodoTitle.trim()}
                            onClick={() => handleSaveClick(todoItem.id)}
                            title="Save"
                            type="button"
                          >
                            <Icon name="save" />
                          </button>
                          <button
                            aria-label="Cancel editing"
                            className="todo-icon-button"
                            onClick={handleCancelClick}
                            title="Cancel"
                            type="button"
                          >
                            <Icon name="close" />
                          </button>
                        </>
                        : <button
                          aria-label={`Edit ${todoItem.title}`}
                          className="todo-icon-button"
                          onClick={() => handleEditClick(todoItem)}
                          title="Edit task"
                          type="button"
                        >
                          <Icon name="edit" />
                        </button>}
                      <button
                        aria-label={`${todoItem.isCompleted ? 'Reopen' : 'Complete'} ${todoItem.title}`}
                        className="todo-icon-button action-complete"
                        onClick={() => handleMarkAsCompletedClick(todoItem.id)}
                        title={todoItem.isCompleted ? 'Reopen task' : 'Complete task'}
                        type="button"
                      >
                        <Icon name={todoItem.isCompleted ? 'undo' : 'check'} />
                      </button>
                      <button
                        aria-label={`Delete ${todoItem.title}`}
                        className="todo-icon-button action-delete"
                        onClick={() => handleDeleteClick(todoItem.id)}
                        title="Delete task"
                        type="button"
                      >
                        <Icon name="delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              })}
          </tbody>
        </table>
      </div>
    </section>
  )

  const pendingTasks = todoList.filter((todoItem) => !todoItem.isCompleted)
  const completedTasks = todoList.filter((todoItem) => todoItem.isCompleted)

  return (
    <main className="todo-app">
      <header className="todo-header">
        <span className="todo-eyebrow">STAY ON TRACK</span>
        <h1>My Tasks</h1>
        <p>One step at a time. You’ve got this.</p>
      </header>

      <form
        className="todo-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleButtonClick();
        }}
      >
        <input
          aria-label="New task title"
          className="todo-input"
          onChange={handleTodoChange}
          placeholder="What needs to get done?"
          type="text"
          value={todo}
        />
        <button className="todo-button todo-button-primary" disabled={!todo.trim()} type="submit">
          <Icon name="add" />
          Add task
        </button>
      </form>

      {renderTaskTable('Pending todo', pendingTasks, 'No pending tasks. Add one above to get started.')}
      {renderTaskTable('Completed tasks', completedTasks, 'Completed tasks will appear here.')}
    </main>
  )
}

export default App
