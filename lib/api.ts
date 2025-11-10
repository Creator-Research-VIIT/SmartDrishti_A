const API_BASE_URL = "http://localhost:5000"; // backend base URL

// ==========================================
// Authentication APIs
// ==========================================

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return await res.json();
};

export const signup = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Signup failed");
  }

  return await res.json();
};

export const getCurrentUser = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to get user");
  return await res.json();
};

// ==========================================
// Project APIs
// ==========================================

export const getProjects = async (token: string, difficulty?: string) => {
  const url = difficulty 
    ? `${API_BASE_URL}/api/projects?difficulty=${difficulty}`
    : `${API_BASE_URL}/api/projects`;

  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch projects");
  return await res.json();
};

export const createProject = async (token: string, projectData: any) => {
  const res = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!res.ok) throw new Error("Failed to create project");
  return await res.json();
};

// ==========================================
// Progress APIs
// ==========================================

export const markProjectComplete = async (token: string, projectId: string) => {
  const res = await fetch(`${API_BASE_URL}/api/progress/${projectId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to mark project complete");
  return await res.json();
};

export const getMyProgress = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/api/progress/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch progress");
  return await res.json();
};

// ==========================================
// User Management APIs (Admin)
// ==========================================

export const getAllUsers = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
};

export const unlockDifficulty = async (token: string, userId: string, difficulty: string) => {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}/unlock`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ difficulty }),
  });

  if (!res.ok) throw new Error("Failed to unlock difficulty");
  return await res.json();
};

// ==========================================
// Legacy/Old APIs (Keep for backward compatibility)
// ==========================================

// 🔹 Test backend connection
export const testConnection = async () => {
  const res = await fetch(`${API_BASE_URL}/api/test`);
  if (!res.ok) throw new Error("Failed to connect to backend");
  return await res.json();
};

// 🔹 Fetch all templates
export const getTemplates = async () => {
  const res = await fetch(`${API_BASE_URL}/api/templates`);
  if (!res.ok) throw new Error("Failed to fetch templates");
  return await res.json();
};

// 🔹 Add a new template
export const addTemplate = async (templateData: any) => {
  const res = await fetch(`${API_BASE_URL}/api/templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(templateData),
  });
  if (!res.ok) throw new Error("Failed to add template");
  return await res.json();
};

// 🔹 Fetch devices
export const getDevices = async () => {
  const res = await fetch(`${API_BASE_URL}/api/devices`);
  if (!res.ok) throw new Error("Failed to fetch devices");
  return await res.json();
};
