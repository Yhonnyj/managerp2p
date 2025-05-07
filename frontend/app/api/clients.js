const API_BASE_URL = "http://127.0.0.1:8000/api/transaction/clientes/full/";

// 🔥 Obtener todos los clientes
export async function getClients() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Error al obtener clientes");
        return await response.json();
    } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
        return [];
    }
}

// 🔥 Crear un nuevo cliente
export async function createClient(clientData) {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/transaction/clientes/crear/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Error en la API:", errorData);
            throw new Error(`Error al agregar cliente: ${errorData.detail || "Desconocido"}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error al agregar cliente:", error);
        return null;
    }
}

// ✅ Eliminar cliente
export async function deleteClient(clientId) {
    if (!clientId) return false; // Protección por si viene null o undefined
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/transaction/clientes/${clientId}/eliminar/`, {
        method: "DELETE",
      });
  
      if (response.status === 404) {
        alert("❌ Cliente no encontrado.");
        return false;
      }
  
      if (!response.ok) {
        alert("❌ Error inesperado al eliminar el cliente.");
        return false;
      }
  
      return true;
    } catch (error) {
      alert("❌ Error de conexión al eliminar cliente.");
      return false;
    }
  }
  