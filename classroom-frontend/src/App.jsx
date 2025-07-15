// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentMainPage from "./pages/StudentMainPage";
import StudentManagePage from "./pages/StudentManagePage";
import TeacherMainPage from "./pages/TeacherMainPage";
import TeacherManagePage from "./pages/TeacherManagePage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/student/main" element={<StudentMainPage />} />
        <Route path="/student/manage" element={<StudentManagePage />} />
        <Route path="/teacher/main" element={<TeacherMainPage />} />
        <Route path="/teacher/manage" element={<TeacherManagePage />} />
      </Routes>
    </BrowserRouter>
  );
}
