const BASE_URL = "http://localhost:8000/api/banks/";

export async function getBanks() {
  const allBanks = [];
  let nextUrl = BASE_URL;

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl);
      if (!res.ok) throw new Error("Error al obtener los bancos");

      const data = await res.json();
      if (Array.isArray(data.results)) {
        allBanks.push(...data.results);
        nextUrl = data.next;
      } else {
        break;
      }
    }
    return allBanks;
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
