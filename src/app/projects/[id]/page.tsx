"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
ArrowLeft,
FolderKanban,
Trash2,
Pencil,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import api from "@/lib/api";

type Project = {
id: string;
organization_id: string;
name: string;
description: string | null;
};

export default function ProjectDetailsPage() {
const params = useParams();
const router = useRouter();

const projectId = params.id as string;

const [project, setProject] = useState<Project | null>(null);
const [loading, setLoading] = useState(true);
const [deleting, setDeleting] = useState(false);

const fetchProject = async () => {
try {
setLoading(true);


  const response = await api.get(
    `/projects/${projectId}`
  );

  setProject(response.data);
} catch (error: any) {
  console.error("Failed to fetch project:", error);

  if (error?.response?.status === 404) {
    toast.error("Project not found");
  } else if (error?.response?.status === 401) {
    toast.error("Please login again.");
  } else {
    toast.error(
      error?.response?.data?.detail ||
        "Failed to load project."
    );
  }
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchProject();
}, [projectId]);

const handleDelete = async () => {
const confirmed = window.confirm(
"Are you sure you want to delete this project?"
);


if (!confirmed) {
  return;
}

try {
  setDeleting(true);

  await api.delete(`/projects/${projectId}`);

  toast.success("Project deleted successfully!");

  router.push("/projects");
} catch (error: any) {
  console.error("Failed to delete project:", error);

  toast.error(
    error?.response?.data?.detail ||
      "Failed to delete project."
  );
} finally {
  setDeleting(false);
}

};

if (loading) {
return ( <div className="min-h-screen flex items-center justify-center bg-slate-50"> <p className="text-sm text-slate-500">
Loading project... </p> </div>
);
}

if (!project) {
return ( <div className="min-h-screen flex items-center justify-center bg-slate-50"> <div className="text-center">

```
      <h2 className="text-lg font-semibold text-slate-900">
        Project not found
      </h2>

      <Link
        href="/projects"
        className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

    </div>
  </div>
);


}

return ( <div className="min-h-screen bg-slate-50"> <Toaster position="top-right" />

  {/* Header */}
  <div className="bg-white border-b border-slate-200">
    <div className="max-w-5xl mx-auto px-6 py-5">

      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

    </div>
  </div>

  {/* Main */}
  <main className="max-w-5xl mx-auto px-6 py-8">

    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

      {/* Project Heading */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-4">

          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <FolderKanban className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {project.name}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Project Details
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <button
            disabled
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900">
          Description
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {project.description ||
            "No description provided for this project."}
        </p>
      </div>

      {/* Project Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-400">
            Project ID
          </p>

          <p className="mt-1 text-sm font-medium text-slate-800 break-all">
            {project.id}
          </p>
        </div>

        <div className="border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-400">
            Organization ID
          </p>

          <p className="mt-1 text-sm font-medium text-slate-800 break-all">
            {project.organization_id}
          </p>
        </div>

      </div>

      {/* Future Tasks Section */}
      <div className="mt-8 border-t border-slate-200 pt-6">

        <h2 className="text-lg font-semibold text-slate-900">
          Tasks
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tasks for this project will appear here.
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-500">
            Task management will be added next.
          </p>
        </div>

      </div>

    </div>

  </main>
</div>
);
}
