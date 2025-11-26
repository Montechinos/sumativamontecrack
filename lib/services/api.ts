const API_URL = "https://3000-firebase-sumativamontecrack-1764015105321.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev/tasks"; // ← CAMBIA ESTO A TU API REAL

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
