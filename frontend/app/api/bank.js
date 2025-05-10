const BASE_URL = "http://localhost:8000/api/banks/";

export async function getBanks() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Error al obtener los bancos");

    const data = await res.json();

    // ✅ Si viene como array directo (por Redis)
    if (Array.isArray(data)) {
      return data;
    }

    // 🧠 Por si vuelve a usarse paginación
    if (Array.isArray(data.results)) {
      const allBanks = [...data.results];
      let nextUrl = data.next;

      while (nextUrl) {
        const res = await fetch(nextUrl);
        if (!res.ok) break;
        const nextData = await res.json();
        allBanks.push(...(nextData.results || []));
        nextUrl = nextData.next;
      }

      return allBanks;
    }

    return [];
  } catch (error) {
    console.error("❌ Error cargando bancos:", error);
    return [];
  }
}

export async function createBank(bank) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bank),
  });
  if (!res.ok) throw new Error("Error al crear el banco");
  return res.json();
}

export async function updateBank(id, updatedData) {
  const res = await fetch(`${BASE_URL}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Error al actualizar el banco");
  return res.json();
}

export async function deleteBank(id) {
  const res = await fetch(`${BASE_URL}${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar el banco");
}
