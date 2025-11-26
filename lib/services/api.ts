const API_URL = "https://tu-api.com/tasks"; // ← CAMBIA ESTO A TU API REAL

export async function getTasksAPI() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createTaskAPI(data: any) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTaskAPI(id: string, data: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTaskAPI(id: string) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
