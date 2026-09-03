"use client";

import { useEffect } from "react";
import api from "@/lib/api";

export default function DashboardPage() {
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");

        console.log("Current User:", response.data);
      } catch (error) {
        console.error("Failed to get current user:", error);
      }
    };

    getCurrentUser();
  }, []);

  return <div>Dashboard</div>;
}