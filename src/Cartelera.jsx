import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Asegúrate de que esta ruta apunte exactamente a tu archivo de configuración de Supabase
import { supabase } from './supabaseClient'; 

export default function Cartelera() {
  const [lista, setLista] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Película');
  const [prioridad, setPrioridad] = useState('Alta');
  const [agregadoPor, setAgregadoPor] = useState('Cristiano Ronaldo');
  const [cargando, setCargando] = useState(true);

  // Cargar películas desde Supabase
  const cargarPeliculas = async () => {
    try {
      const { data, error } = await supabase
        .from('lista_peliculas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLista(data || []);
    } catch (err) {
      console.error("Error al cargar cartelera:", err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPeliculas();
  }, []);

  // Agregar nueva recomendación a la BD
  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    try {
      const { error } = await supabase
        .from('lista_peliculas')
        .insert([{ titulo: titulo.trim(), tipo, prioridad, agregado_por: agregadoPor }]);

      if (error) throw error;
      
      setTitulo('');
      cargarPeliculas();
    } catch (err) {
      alert("Error al guardar en Supabase: " + err.message);
    }
  };

  // Marcar como visto / pendiente
  const marcarComoVista = async (id, estadoActual) => {
    try {
      const { error } = await supabase
        .from('lista_peliculas')
        .update({ visto: !estadoActual })
        .eq('id', id);

      if (error) throw error;
      cargarPeliculas();
    } catch (err) {
      console.error("Error al actualizar estado:", err.message);
    }
  };

  // Eliminar elemento de la lista
  const eliminarPelicula = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar este elemento de la lista?")) return;
    try {
      const { error } = await supabase
        .from('lista_peliculas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      cargarPeliculas();
    } catch (err) {
      console.error("Error al eliminar:", err.message);
    }
  };

  return (
    <div 
    // CAMBIAMOS: 'bg-cover bg-center' POR 'bg-contain bg-repeat'
    className="min-h-screen text-gray-800 p-4 md:p-8 flex flex-col items-center bg-contain bg-repeat "
  >
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-pink-100">
        
        {/* Encabezado con React Router */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-pink-600">La verdadera lista que necesitabamos</h1>
          </div>
          <Link 
            to="/" 
            className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-500 px-3 py-1.5 rounded-xl transition-all cursor-pointer no-underline block"
          >
            Volver
          </Link>
        </div>

        {/* Formulario de Ingreso */}
        <form onSubmit={manejarEnvio} className="bg-pink-50/50 border border-pink-100 p-4 rounded-xl space-y-3 mb-6">
          <div className="text-xs font-bold text-pink-500 uppercase tracking-wider">Añadir pelicula</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Título:</label>
              <input 
                type="text" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
                required 
                className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-pink-400" 
                placeholder="wachita rica" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Formato:</label>
              <select 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value)} 
                className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg"
              >
                <option value="Película">Peli</option>
                <option value="Serie">Serie</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Prioridad:</label>
              <select 
                value={prioridad} 
                onChange={(e) => setPrioridad(e.target.value)} 
                className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg"
              >
                <option value="Alta">Alta</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">¿Quién la agrega?:</label>
              <select 
                value={agregadoPor} 
                onChange={(e) => setAgregadoPor(e.target.value)} 
                className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg font-semibold"
              >
                <option value="Cristiano Ronaldo">Tu bb</option>
                <option value="Lucho Díaz">Mi bb</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-xl text-xs transition-colors mt-2 shadow-sm cursor-pointer"
          >
            Agregar
          </button>
        </form>

        {/* Listado de Contenido */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lista</div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {cargando ? (
              <p className="text-xs text-gray-400 text-center py-6">Cargando </p>
            ) : lista.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">La lista vacia</p>
            ) : (
              lista.map(item => (
                <div 
                  key={item.id} 
                  className={`flex justify-between items-center p-3 rounded-xl border transition-all ${item.visto ? 'bg-gray-50/60 border-gray-200 opacity-60' : 'bg-white border-gray-100 hover:shadow-sm'}`}
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => marcarComoVista(item.id, item.visto)} 
                      className="text-lg focus:outline-none cursor-pointer transition-transform active:scale-95"
                    >
                      {item.visto ? '✅' : '⬜'}
                    </button>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase text-[10px] block">{item.tipo}</span>
                      <span className={`font-bold text-sm text-gray-800 ${item.visto ? 'line-through text-gray-400' : ''}`}>{item.titulo}</span>
                      
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] font-medium text-gray-400">
                        <span>Por:</span> 
                        {item.agregado_por === 'Cristiano Ronaldo' 
                          ? <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Dios</span>
                          : <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Diosa</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {item.prioridad === 'Alta' 
                      ? <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] px-2 py-0.5 rounded-full font-bold">Alta </span>
                      : <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] px-2 py-0.5 rounded-full font-bold">Baja </span>}
                    <button 
                      onClick={() => eliminarPelicula(item.id)} 
                      className="text-gray-300 hover:text-red-500 text-xs font-bold transition-colors cursor-pointer p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}