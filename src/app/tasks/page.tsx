"use client";

import { useEffect, useState } from "react";
import {
ClipboardList,
Plus,
X,
Trash2,
Clock3,
CheckCircle2,
Circle,
FolderKanban,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import api from "@/lib/api";

type Project = {
id: string;
name: string;
};

type Task = {
id: string;
organization_id: string;
project_id: string;
title: string;
description: string | null;
status: "todo" | "in_progress" | "done";
};

export default function TasksPage() {
const [tasks, setTasks] = useState<Task[]>([]);
const [projects, setProjects] = useState<Project[]>([]);

const [loading, setLoading] = useState(true);
const [creating, setCreating] = useState(false);

const [showCreateModal, setShowCreateModal] = useState(false);

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [projectId, setProjectId] = useState("");

const getProjects = async () => {
try {
const response = await api.get("/projects/");


  setProjects(response.data);

  if (response.data.length > 0) {
    setProjectId(response.data[0].id);
  }
} catch (error: any) {
  console.error("Failed to fetch projects:", error);

  toast.error(
    error?.response?.data?.detail ||
      "Failed to load projects."
  );
}


};

const getTasks = async () => {
try {
setLoading(true);

  const response = await api.get("/tasks/");

  setTasks(response.data);
} catch (error: any) {
  console.error("Failed to fetch tasks:", error);

  toast.error(
    error?.response?.data?.detail ||
      "Failed to load tasks."
  );
} finally {
  setLoading(false);
}


};

useEffect(() => {
const loadData = async () => {
await Promise.all([
getProjects(),
getTasks(),
]);
};

loadData();


}, []);

const handleCreateTask = async (
e: React.FormEvent<HTMLFormElement>
) => {
e.preventDefault();


if (!title.trim()) {
  toast.error("Task title is required");
  return;
}

if (title.trim().length < 2) {
  toast.error(
    "Task title must be at least 2 characters"
  );
  return;
}

if (!projectId) {
  toast.error("Please select a project");
  return;
}

try {
  setCreating(true);

  const response = await api.post("/tasks/", {
    project_id: projectId,
    title: title.trim(),
    description: description.trim() || null,
  });

  setTasks((currentTasks) => [
    response.data,
    ...currentTasks,
  ]);

  setTitle("");
  setDescription("");
  setShowCreateModal(false);

  toast.success("Task created successfully!");
} catch (error: any) {
  console.error("Failed to create task:", error);

  toast.error(
    error?.response?.data?.detail ||
      "Failed to create task."
  );
} finally {
  setCreating(false);
}


};

const handleDeleteTask = async (taskId: string) => {
const confirmed = window.confirm(
"Are you sure you want to delete this task?"
);


if (!confirmed) {
  return;
}

try {
  await api.delete(`/tasks/${taskId}`);

  setTasks((currentTasks) =>
    currentTasks.filter(
      (task) => task.id !== taskId
    )
  );

  toast.success("Task deleted successfully!");
} catch (error: any) {
  console.error("Failed to delete task:", error);

  toast.error(
    error?.response?.data?.detail ||
      "Failed to delete task."
  );
}


};

const getProjectName = (projectId: string) => {
const project = projects.find(
(item) => item.id === projectId
);


return project?.name || "Unknown Project";


};

const getStatusClasses = (status: Task["status"]) => {
if (status === "done") {
return "bg-green-50 text-green-700 border-green-200";
}


if (status === "in_progress") {
  return "bg-yellow-50 text-yellow-700 border-yellow-200";
}

return "bg-slate-50 text-slate-600 border-slate-200";


};

const getStatusLabel = (status: Task["status"]) => {
if (status === "in_progress") {
return "In Progress";
}

if (status === "done") {
  return "Done";
}

return "Todo";


};

const getStatusIcon = (status: Task["status"]) => {
if (status === "done") {
return <CheckCircle2 className="h-3.5 w-3.5" />;
}

if (status === "in_progress") {
  return <Clock3 className="h-3.5 w-3.5" />;
}

return <Circle className="h-3.5 w-3.5" />;


};

return ( <div className="min-h-screen bg-slate-50"> <Toaster position="top-right" />


  {/* Header */}
  <div className="bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Tasks
          </h1>

          <p className="text-sm text-slate-500">
            Manage tasks across your projects
          </p>
        </div>

      </div>

      <button
        onClick={() => setShowCreateModal(true)}
        disabled={projects.length === 0}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4" />
        Create Task
      </button>

    </div>
  </div>

  {/* Main */}
  <main className="max-w-7xl mx-auto px-6 py-8">

    {/* No projects */}
    {!loading && projects.length === 0 && (
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        You need to create a project before creating a task.
      </div>
    )}

    {/* Loading */}
    {loading && (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500">
          Loading tasks...
        </p>
      </div>
    )}

    {/* Empty State */}
    {!loading && tasks.length === 0 && (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center">

        <div className="mx-auto h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center">
          <ClipboardList className="h-7 w-7 text-blue-600" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          No tasks yet
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create your first task to start working.
        </p>

        <button
          onClick={() => setShowCreateModal(true)}
          disabled={projects.length === 0}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </button>

      </div>
    )}

    {/* Tasks */}
    {!loading && tasks.length > 0 && (
      <div className="space-y-4">

        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
          >

            <div className="flex items-start justify-between gap-4">

              {/* Task Info */}
              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-lg font-semibold text-slate-900">
                    {task.title}
                  </h2>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-full ${getStatusClasses(
                      task.status
                    )}`}
                  >
                    {getStatusIcon(task.status)}
                    {getStatusLabel(task.status)}
                  </span>

                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                  <FolderKanban className="h-4 w-4" />

                  <span>
                    {getProjectName(task.project_id)}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-600 leading-6">
                  {task.description ||
                    "No description provided."}
                </p>

              </div>

              {/* Delete */}
              <button
                onClick={() =>
                  handleDeleteTask(task.id)
                }
                className="shrink-0 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>

            </div>

          </div>
        ))}

      </div>
    )}

  </main>

  {/* Create Task Modal */}
  {showCreateModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Create Task
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Add a task to one of your projects.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleCreateTask}
          className="p-6 space-y-5"
        >

          {/* Project */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Project
            </label>

            <select
              value={projectId}
              onChange={(e) =>
                setProjectId(e.target.value)
              }
              className="w-full mt-1.5 px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            >
              <option value="">
                Select a project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Task Title
            </label>

            <input
              type="text"
              placeholder="Create homepage"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full mt-1.5 px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Describe what needs to be done..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full mt-1.5 px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setTitle("");
                setDescription("");
              }}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : "Create Task"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )}

</div>
);
}
