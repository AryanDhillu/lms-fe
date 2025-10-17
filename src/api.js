import { API_BASE_URL } from './config';

async function handleResponse(res) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || (typeof data === 'object' ? JSON.stringify(data) : (data || `HTTP ${res.status}`));
    // Helpful console for debugging 400s from API
    console.error('API request failed:', {
      status: res.status,
      statusText: res.statusText,
      body: data
    });
    throw new Error(message);
  }
  return data;
}

export async function registerUser({ name, email, password, role }) {
  const res = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  return handleResponse(res);
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include'
  });
  return handleResponse(res);
}

export async function getCourses() {
  const res = await fetch(`${API_BASE_URL}/api/courses`);
  return handleResponse(res);
}

export async function createCourse({ title, description, duration, price, rating }, token) {
  const res = await fetch(`${API_BASE_URL}/api/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, description, duration, price, rating })
  })
  return handleResponse(res)
}

export async function enrollCourse(courseId, token) {
  const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/enroll`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return handleResponse(res)
}

export async function getMyCourses(token) {
  const res = await fetch(`${API_BASE_URL}/api/courses/my-courses`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(res)
}

export async function getCourseStudents(courseId, token) {
  const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/students`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(res)
}

export async function createAssignment(payload, token) {
  // payload: { courseId, title, questions: [{ questionText, options: [], correctAnswer }], dueDate? }
  const res = await fetch(`${API_BASE_URL}/api/assignments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  return handleResponse(res)
}

export async function getCourseAssignments(courseId, token) {
  const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/assignments`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(res)
}

export async function submitAssignment(assignmentId, payload, token) {
  // payload: { answers: [{ questionText, selectedAnswer }] }
  const res = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  return handleResponse(res)
}

// Teacher view: list assignments for a course including submission counts
export async function getAssignmentsTeacherView(courseId, token) {
  const res = await fetch(`${API_BASE_URL}/api/assignments/course/${courseId}/teacher-view`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(res)
}

export async function getAssignmentSubmissions(assignmentId, token) {
  const res = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}/submissions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(res)
}

export async function updateCourse(courseId, payload, token) {
  const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  return handleResponse(res)
}

// Course feedback from student
export async function submitCourseFeedback(courseId, payload, token) {
  // payload: { rating?: number(1-5), feedback: string }
  const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  return handleResponse(res)
}
