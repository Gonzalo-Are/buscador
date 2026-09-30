import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 


const RIVAL_RIDDLE_ANSWER = "anillo";
const GOOGLE_DRIVE_LINK = "https://drive.google.com/drive/folders/1QXdDx6wrfgMJcVx1VeKH0MQ3DCf0A29u?usp=sharing";

export default function MisionNivel4() {
  const [file, setFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null); // Guarda la foto global
  const [loading, setLoading] = useState(true);

  const [riddleInput, setRiddleInput] = useState('');
  const [riddleFeedback, setRiddleFeedback] = useState('');
  const [isUnlockedFinal, setIsUnlockedFinal] = useState(false);

  // 1. Obtener la última foto subida globalmente
  const fetchLatestPhoto = async () => {
    try {
      const { data, error } = await supabase
        .from('fotos_mision')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setCurrentPhoto(data[0]);
      } else {
        setCurrentPhoto(null);
      }
    } catch (err) {
      console.error('Error al consultar la base de datos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPhoto();

    // 2. Escuchar cambios globales en tiempo real (INSERTS y UPDATES en fotos_mision)
    const channel = supabase
      .channel('global_mision_photos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fotos_mision' },
        () => {
          fetchLatestPhoto(); // Recargar la foto en vivo cuando alguien suba o cambie estado
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPhotoPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUploadToSupabase = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `mision4/${fileName}`;

      // Subir archivo a Storage
      const { error: uploadError } = await supabase.storage
        .from('misiones')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('misiones')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Insertar nuevo registro global
      const { error: insertError } = await supabase
        .from('fotos_mision')
        .insert([{ image_url: publicUrl, status: 'pendiente' }]);

      if (insertError) throw insertError;

      setFile(null);
      setPhotoPreview(null);
      await fetchLatestPhoto();
    } catch (error) {
      alert('Error al subir la imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRiddleVerify = (e) => {
    e.preventDefault();
    if (!riddleInput.trim()) return;

    if (riddleInput.trim().toUpperCase() === RIVAL_RIDDLE_ANSWER.toUpperCase()) {
      setIsUnlockedFinal(true);
      setRiddleFeedback('Ganaste bb');
    } else {
      setRiddleFeedback('upsi');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center p-4 font-bold">
        Cargandou
      </div>
    );
  }

  const currentStatus = currentPhoto ? currentPhoto.status : null;
  const displayImage = photoPreview || (currentPhoto ? currentPhoto.image_url : null);

  return (
    <div className="min-h-screen text-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-300 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-black">Llegaste alfinal amor</h1>
          <p className="text-xs text-black font-semibold">Tienes que ir a esta coordenada : 29.888574924517993, -97.93077088989138 . Y tomarte una foto</p>
        </div>

        {currentStatus !== 'aprobada' ? (
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-300 text-center">
            <div className="text-4xl">📸</div>
            <h2 className="font-black text-sm uppercase text-black"></h2>
            
            {displayImage && (
              <img 
                src={displayImage} 
                alt="Vista previa" 
                className="w-full h-48 object-cover rounded-xl border-2 border-slate-300 shadow-inner" 
              />
            )}

            {/* Si no hay ninguna foto registrada o la última fue rechazada, se permite subir */}
            {(!currentPhoto || currentStatus === 'rechazada') && (
              <>
                {currentStatus === 'rechazada' && (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200 space-y-1 my-2">
                    <p className="text-xs font-bold text-red-700">Foto rechazada bb, tienes que tomarte una verdadera foti alla</p>
                    <p className="text-[11px] text-red-600"></p>
                  </div>
                )}

                <label className="block w-full py-3 bg-slate-200 hover:bg-slate-300 text-black font-bold rounded-xl cursor-pointer transition text-xs uppercase border border-slate-400">
                  {file ? "Cambiar foto seleccionada" : "Seleccionar foto"}
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>

                {file && (
                  <button
                    type="button"
                    onClick={handleUploadToSupabase}
                    disabled={uploading}
                    className="w-full py-3 bg-black hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-md cursor-pointer disabled:bg-slate-400"
                  >
                    {uploading ? "...." : "Enviar Foto"}
                  </button>
                )}
              </>
            )}

            {/* Estado Pendiente: Bloqueado para todos los PC */}
            {currentStatus === 'pendiente' && (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                <p className="text-xs font-bold text-amber-700">Foto enviada y en revisión.</p>
                <p className="text-[11px] text-amber-600">Yo vere si te la apruebo o no linda</p>
              </div>
            )}
          </div>
        ) : (
          /* Acertijo Final (Habilitado globalmente cuando status === 'aprobada') */
          <div className="space-y-5">
            <div className="bg-slate-100 p-5 rounded-2xl border border-slate-300 text-center space-y-3">
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                Aprobadi hermosa
              </span>
              <h2 className="font-black text-base text-black pt-2">Acertijo Final</h2>
              <p className="text-xs text-black font-semibold italic bg-white p-3 rounded-xl border border-slate-300">
                "Es duro y redondo y se mete hasta el fondo, ¿Qué es?"
              </p>
            </div>

            <form onSubmit={handleRiddleVerify} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-300">
              <input 
                type="text"
                
                value={riddleInput}
                onChange={(e) => setRiddleInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border-2 border-slate-400 focus:border-black text-black text-center font-mono font-bold focus:outline-none cursor-text uppercase"
              />

              {!isUnlockedFinal ? (
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-black hover:bg-slate-800 text-white font-bold rounded-xl transition duration-200 shadow-md cursor-pointer"
                >
                  Comprobar
                </button>
              ) : (
                <a 
                  href={GOOGLE_DRIVE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center shadow-md transition"
                >
                  🎬
                </a>
              )}
            </form>

            {riddleFeedback && (
              <p className={`text-center font-black text-sm ${isUnlockedFinal ? 'text-emerald-600' : 'text-red-600'}`}>
                {riddleFeedback}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}