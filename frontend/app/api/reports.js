export async function getReports() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/transaction/transactions/");
        if (!response.ok) {
            throw new Error("Error al obtener las transacciones");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getReports:", error);
        return null;
    }
}
