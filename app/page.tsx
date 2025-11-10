"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authUtils } from "@/lib/auth";
import { storageUtils } from "@/lib/localStorage";
import { SAMPLE_PROJECTS } from "@/lib/seed-data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { testConnection } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("Checking backend connection...");

  useEffect(() => {
    // Initialize local storage users
    authUtils.initializeUsers();

    // Initialize local sample projects if empty
    if (storageUtils.getProjects().length === 0) {
      storageUtils.setProjects(SAMPLE_PROJECTS);
    }

    // Test backend connection
    testConnection()
      .then((res) => {
        console.log("✅ Backend Response:", res);
        setBackendStatus(res.message || "Backend connected ✅");
      })
      .catch((err) => {
        console.error("❌ Backend unreachable:", err);
        setBackendStatus("Backend not reachable ❌");
      })
      .finally(() => setIsLoading(false));

    // Auto redirect authenticated users
    if (authUtils.isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center flex-col space-y-4">
        <div className="h-14 w-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg">{backendStatus}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-gray-900 relative flex flex-col">
      <Header />

      {/* Main Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center py-24">
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-orange-500 via-pink-500 to-blue-500 bg-clip-text text-transparent leading-tight">
              Learn IoT Development the Smart Way
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Build your IoT skills through hands-on projects — from basic sensors to connected smart systems.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex flex-col sm:flex-row gap-5 justify-center mb-20"
          >
            <button
              onClick={() => router.push("/auth/login")}
              className="px-8 py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:scale-105"
            >
              🚀 Get Started
            </button>

            <button
              onClick={() => router.push("/projects")}
              className="px-8 py-3 text-lg font-semibold rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white hover:scale-105"
            >
              📁 View Projects
            </button>
          </motion.div>

          {/* Backend Status */}
          <div className="text-sm text-gray-500 italic mb-12">
            🌐 {backendStatus}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { number: "50+", label: "Hands-on Projects" },
              { number: "3", label: "Skill Levels" },
              { number: "∞", label: "Learning Potential" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 border p-8 rounded-xl shadow-sm"
              >
                <div className="text-4xl font-bold text-orange-500">{stat.number}</div>
                <div className="text-gray-700 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Background gradient blobs */}
      <div className="absolute -z-10 top-1/3 left-10 w-72 h-72 bg-gradient-to-br from-blue-300 to-cyan-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -z-10 bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-orange-300 to-pink-200 rounded-full blur-3xl opacity-40"></div>

      <Footer />
    </div>
  );
}
