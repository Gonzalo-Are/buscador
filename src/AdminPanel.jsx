import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Ajusta la ruta según la ubicación de tu cliente de Supabase

export default function AdminPanel() {
  const [photos, setPhotos] = useState([]);

  // Consultar todas las fotos registradas
  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('fotos_mision')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
  };

  useEffect(() => {
    fetchPhotos();

    // Escuchar cambios en vivo para ver cuando alguien sube una foto
    const channel = supabase
      .channel('admin_photos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fotos_mision' },
        () => fetchPhotos()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Cambiar estado con los botones
  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('fotos_mision')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar el estado: ' + error.message);
    } else {
      fetchPhotos();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold border-b border-slate-700 pb-3">
          🛡️ Panel Secreto de Administración
        </h1>

        {photos.length === 0 ? (
          <p className="text-slate-400 text-sm">No hay ninguna foto registrada todavía.</p>
        ) : (
          <div className="space-y-4">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between"
              >
                <img 
                  src={photo.image_url} 
                  alt="Misión" 
                  className="w-full sm:w-32 h-32 object-cover rounded-lg border border-slate-600"
                />

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <p className="text-xs text-slate-400">ID: {photo.id}</p>
                  <p className="text-xs text-slate-400">
                    Fecha: {new Date(photo.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold">
                    Estado:{' '}
                    <span className={
                      photo.status === 'aprobada' ? 'text-emerald-400 font-bold' :
                      photo.status === 'rechazada' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'
                    }>
                      {photo.status.toUpperCase()}
                    </span>
                  </p>
                </div>

                {/* AQUÍ ESTÁN LOS BOTONES */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleUpdateStatus(photo.id, 'aprobada')}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow"
                  >
                    Aprobar 🟢
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(photo.id, 'rechazada')}
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow"
                  >
                    Rechazar 🔴
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}