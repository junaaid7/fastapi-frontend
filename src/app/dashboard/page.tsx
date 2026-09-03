"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
Building2,
CheckCircle2,
LogOut,
Mail,
User,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import api from "@/lib/api";

type UserData = {
id: string;
name: string;
email: string;
organization_id: string;
};

export default function DashboardPage() {
const router = useRouter();

const [user, setUser] = useState<UserData | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");

      setUser(response.data);

      console.log("Current User:", response.data);
    } catch (error: any) {
      console.error("Failed to get current user:", error);

      const statusCode = error?.response?.status;

      if (statusCode === 401) {
        localStorage.removeItem("access_token");
        router.push("/login");
        return;
      }

      toast.error("Failed to load user information");
    } finally {
      setLoading(false);
    }
  };

  getCurrentUser();
}, [router]);

const handleLogout = () => {
localStorage.removeItem("access_token");


toast.success("Logged out successfully");

router.push("/login");


};

if (loading) {
return ( <div className="min-h-screen flex items-center justify-center bg-slate-50"> <p className="text-sm text-slate-500">
Loading dashboard... </p> </div>
);
}

if (!user) {
return null;
}

return ( <div className="min-h-screen bg-slate-50"> <Toaster position="top-right" />

  {/* Navbar */}
  <nav className="bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

      <div>
        <h1 className="text-lg font-bold text-slate-900">
          Project Manager
        </h1>

        <p className="text-xs text-slate-500">
          Multi-Tenant Workspace
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 transition"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>

    </div>
  </nav>

  {/* Main */}
  <main className="max-w-7xl mx-auto px-6 py-8">

    {/* Welcome */}
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {user.name}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Here is your workspace information.
        </p>
      </div>

    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

      {/* User */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              User
            </p>

            <p className="font-semibold text-slate-900">
              {user.name}
            </p>
          </div>

        </div>
      </div>

      {/* Email */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Mail className="h-5 w-5 text-green-600" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              Email
            </p>

            <p className="font-semibold text-slate-900 truncate">
              {user.email}
            </p>
          </div>

        </div>
      </div>

      {/* Organization */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-purple-600" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              Organization ID
            </p>

            <p className="font-semibold text-slate-900 text-sm truncate">
              {user.organization_id}
            </p>
          </div>

        </div>
      </div>

    </div>

    {/* Workspace */}
    <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-600" />

        <h3 className="text-lg font-semibold text-slate-900">
          Authentication & Organization
        </h3>
      </div>

      <div className="mt-4 space-y-3 text-sm text-slate-600">

        <p>
          ✅ You are successfully authenticated.
        </p>

        <p>
          ✅ Your JWT token is being used for protected requests.
        </p>

        <p>
          ✅ Your account is connected to an organization.
        </p>

      </div>

    </div>

  </main>
</div>


);
}
