const API_BASE_URL = "http://127.0.0.1:8000/api/finance-categories/";

export async function getCategories() {
  const token = localStorage.getItem("accessToken"); // ✅ corregido: usamos "accessToken"

  const res = await fetch(API_BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ se envía correctamente
    },
  });

  if (!res.ok) {
    throw new Error("Error al cargar categorías");
  }

  return await res.json();
}
