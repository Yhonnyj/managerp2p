const API_URL = "http://127.0.0.1:8000/api/transaction/transactions/";

// ✅ Obtener todas las transacciones desde Django
export async function getTransactions() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener transacciones");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error al obtener transacciones:", error);
    return [];
  }
}

// ✅ Agregar una nueva transacción con ID del cliente ya existente
export async function addTransaction(transactionData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error en la API:", errorData);
      throw new Error(
        `Error al agregar transacción: ${errorData.detail || "Desconocido"}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error al agregar transacción:", error);
    return null;
  }
}
