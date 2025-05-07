"use client";

import useSWR, { mutate } from "swr";
import { X, ImagePlus, Trash2 } from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ClientImagesSidebar({ isOpen, onClose, clientId }) {
  const inputRef = useRef();

  const { data, isLoading } = useSWR(
    isOpen && clientId ? [`imagenes-cliente`, clientId] : null,
    () => fetcher(`http://127.0.0.1:8000/api/transaction/clientes/${clientId}/imagenes/`),
    { revalidateOnFocus: false }
  );

  const images = data?.results || [];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("titulo", file.name);

    const uploading = toast.loading("Subiendo imagen...");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/transaction/clientes/${clientId}/subir-imagen/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir imagen");

      await mutate([`imagenes-cliente`, clientId]);
      toast.success("✅ Imagen subida correctamente", { id: uploading });
    } catch {
      toast.error("❌ Error al subir imagen", { id: uploading });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta imagen?")) return;

    const deleting = toast.loading("Eliminando imagen...");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/transaction/clientes/imagenes/${id}/eliminar/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo eliminar");

      await mutate([`imagenes-cliente`, clientId]);
      toast.success("✅ Imagen eliminada", { id: deleting });
    } catch {
      toast.error("❌ Error al eliminar imagen", { id: deleting });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}></div>

      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-gray-900 border-l border-gray-700 z-50 shadow-2xl animate-slideIn">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Documentos del Cliente</h2>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => inputRef.current?.click()}
              title="Subir imagen"
              className="text-gray-400 hover:text-white transition"
            >
              <ImagePlus className="w-6 h-6" />
            </button>

            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        {/* Contenedor de imágenes */}
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)] space-y-4">
          {isLoading ? (
            <p className="text-gray-400 text-center">Cargando imágenes...</p>
          ) : images.length > 0 ? (
            images.map((img) => (
              <div key={img.id} className="relative w-full group">
                {/* Ícono eliminar */}
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 bg-black/50 p-1 rounded hover:bg-red-600 transition z-10"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>

                <img
  src={img.imagen}
  alt={img.titulo || "Documento"}
  className="w-full h-48 object-cover rounded-lg border border-gray-700 shadow"
/>

              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-8">No hay imágenes disponibles.</p>
          )}
        </div>
      </div>
    </>
  );
}
