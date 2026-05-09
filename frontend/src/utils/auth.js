// src/utils/auth.js

export function getUser() {
  return JSON.parse(localStorage.getItem("govconnect_user"));
}

export function getToken() {
  return localStorage.getItem("govconnect_token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("govconnect_token");
}

export function isAdmin() {
  const user = getUser();
  return user?.role === "admin";
}

export function logout() {
  localStorage.removeItem("govconnect_token");
  localStorage.removeItem("govconnect_user");
}