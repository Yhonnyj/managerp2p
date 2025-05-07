import { mutate } from "swr";

const BASE_URL = "http://localhost:8000/api/banks/";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ✅ Crear nueva transacción y refrescar vista
export async function createBankTransaction(bankId, transactionData) {
  const res = await fetch(`${BASE_URL}${bankId}/transactions/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("❌ Error al crear transacción:", errorData);
    throw new Error("No se pudo crear la transacción bancaria");
  }

  await mutate("banks");
  return res.json();
}

// ✅ Obtener transacciones reales desde backend
export async function fetchBankTransactions(bankId) {
  const res = await fetch(`${BASE_URL}${bankId}/transactions/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("❌ Error al obtener transacciones:", errorData);
    throw new Error("No se pudieron obtener las transacciones");
  }

  return res.json();
}

// ✅ Eliminar transacción y refrescar bancos
export async function deleteBankTransaction(bankId, transactionId) {
  const res = await fetch(`${BASE_URL}${bankId}/transactions/${transactionId}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("❌ Error al eliminar transacción:", errorData);
    throw new Error("No se pudo eliminar la transacción");
  }

  await mutate("banks");
  return true;
}

// ✅ Actualizar banco y refrescar
export async function updateBank(bankId, updatedData) {
  const res = await fetch(`${BASE_URL}${bankId}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("❌ Error al actualizar banco:", errorData);
    throw new Error("No se pudo actualizar el banco");
  }

  await mutate("banks");
  return res.json();
}

// ✅ NUEVO: Actualizar transacción individual
export async function updateTransaction(bankId, transaction) {
  const res = await fetch(`${BASE_URL}${bankId}/transactions/${transaction.id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(transaction),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Error desconocido");
    console.error("❌ Error al actualizar transacción:", errorText);
    throw new Error("No se pudo actualizar la transacción");
  }

  await mutate(`transactions-${bankId}`);
  await mutate("banks"); // también refresca lista principal
  return res.json();
}
