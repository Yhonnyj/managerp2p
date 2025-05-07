export async function getFinanceDashboardData(filtros = {}) {
    const token = localStorage.getItem("accessToken");
  
    const params = new URLSearchParams(filtros).toString();
    const url = `http://127.0.0.1:8000/api/finance/dashboard/?${params}`;
  
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("❌ Error al obtener datos de finanzas");
    }
  
    return res.json();
  }
  