import { useEffect, useState } from "react";
import { supabase } from './supabaseClient';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajeDeHoy, setMensajeDeHoy] = useState(null);
  const [butterflies, setButterflies] = useState([]);
  const [corazones, setCorazones] = useState(0);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  
  // Estados nuevos para el control de fotos dinámicas
  const [fotosFondo, setFotosFondo] = useState([]);
  const [cargandoFotoId, setCargandoFotoId] = useState(null);
  const [isPanelFotosOpen, setIsPanelFotosOpen] = useState(false);

  const messages = [
    "La mejor polola del mundo ❤️", "Mi persona favorita 💕", "Te quiero demasiado 🫶",
    "Eres todo para mí 💖", "Contigo, cada día es especial 🌟", "Eres mi alegría diaria 😊",
    "Gracias por ser tú, mi amor 💗", "Te extraño bb 🥺", "Te quiero abrazar y no soltar🥺",
    "Estoy loco por ti💖 ", "Cada dia que pasa me enamoro mas 💗", "Ya quiero darte mil besitos 🥰",
    "Me cambiaste la vida amor 💕", "Contigo, todo es mejor 💖"
  ];

  // 1. Cargar corazones globales desde Supabase
  useEffect(() => {
    const obtenerCorazones = async () => {
      const { data } = await supabase
        .from('global_stats')
        .select('count')
        .eq('name', 'hearts')
        .maybeSingle();
      
      if (data) setCorazones(data.count);
    };
    obtenerCorazones();
  }, []);

  // 2. Cargar mensaje del día
  useEffect(() => {
    const cargarMensaje = async () => {
      const hoy = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_messages') 
        .select('*')
        .eq('created_at', hoy)
        .maybeSingle(); 
      if (data) setMensajeDeHoy(data);
    };
    cargarMensaje();
  }, []);

  // 3. Cargar las fotos del fondo desde la Base de Datos (Mantiene tu orden exacto)
  useEffect(() => {
    const cargarFotosFondo = async () => {
      const { data, error } = await supabase
        .from('fotos_pantalla')
        .select('*')
        .order('posicion', { ascending: true });

      if (error) {
        console.error("Error cargando fotos:", error.message);
      } else if (data && data.length > 0) {
        setFotosFondo(data);
      } else {
        // Respaldo local con tu orden exacto si la BD está vacía al inicio
        setFotosFondo([
          { id: 1, posicion: 1, url_imagen: '/seis.jpeg' },
          { id: 2, posicion: 2, url_imagen: '/cinco.jpeg' },
          { id: 3, posicion: 3, url_imagen: '/tres.jpeg' },
          { id: 4, posicion: 4, url_imagen: '/cuatro.jpeg' },
          { id: 5, posicion: 5, url_imagen: '/uno.jpeg' },
          { id: 6, posicion: 6, url_imagen: '/dos.jpeg' },
          { id: 7, posicion: 7, url_imagen: '/siete.jpeg' },
          { id: 8, posicion: 8, url_imagen: '/ocho.jpeg' },
        ]);
      }
    };
    cargarFotosFondo();
  }, []);

  // 4. Función para subir y cambiar una foto de fondo en el Storage y BD
  const cambiarFotoFondo = async (e, fotoId, posicion) => {
    const file = e.target.files[0];
    if (!file) return;

    setCargandoFotoId(fotoId);

    try {
      // Nombre único para el archivo usando la posición y timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `fondo_${posicion}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // A. Subir la imagen al Bucket de Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('fotos-fondo')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // B. Obtener la URL pública de la imagen recién subida
      const { data: urlData } = supabase.storage
        .from('fotos-fondo')
        .getPublicUrl(filePath);

      const nuevaUrl = urlData.publicUrl;

      // C. Actualizar el registro en la tabla de la Base de Datos
      const { error: updateError } = await supabase
        .from('fotos_pantalla')
        .update({ url_imagen: nuevaUrl })
        .eq('id', fotoId);

      if (updateError) throw updateError;

      // D. Actualizar el estado dinámico en tiempo real
      setFotosFondo(prev => prev.map(f => f.id === fotoId ? { ...f, url_imagen: nuevaUrl } : f));

    } catch (error) {
      console.error("Error al cambiar la foto:", error.message);
      alert("No se pudo subir la imagen. Revisa los logs de la consola.");
    } finally {
      setCargandoFotoId(null);
    }
  };

  // 5. Guardar nuevo mensaje diario
  const guardarMensaje = async () => {
    if (!mensaje.trim()) return;
    const { error } = await supabase
      .from('daily_messages')
      .insert([{ content: mensaje }]);

    if (error) {
      if (error.code === '23505') alert("upsi, ya hay mensaje hoy");
      else console.error("Error:", error.message);
    } else {
      setMensajeDeHoy({ content: mensaje });
    }
  };

  // 6. Lógica de Corazón (Persistencia + Mariposas)
  const manejarClickCorazon = async () => {
    setCorazones(prev => prev + 1);
    await supabase.rpc('increment_hearts');

    const getCoord = (unit) => (Math.floor(Math.random() * 90) - 45) + unit;
    const randomCoords = {
      x1: getCoord("vw"), y1: getCoord("vh"),
      x2: getCoord("vw"), y2: getCoord("vh"),
    };
    const newId = Date.now();
    setButterflies(prev => [...prev, { id: newId, coords: randomCoords }]);

    setTimeout(() => {
      setButterflies(prev => prev.filter(b => b.id !== newId));
    }, 32000);
  };

  // 7. Placeholder dinámico del buscador
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setPlaceholderText(messages[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // 8. Timer de cuenta regresiva
  useEffect(() => {
    const targetDate = new Date("2026-07-15T20:30:00-04:00").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      const timerElement = document.getElementById("countdown-timer");
      const messageElement = document.getElementById("arrival-message");

      if (distance < 0) {
        clearInterval(timer);
        if (timerElement) timerElement.classList.add("hidden");
        if (messageElement) messageElement.classList.remove("hidden");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (timerElement) {
        timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
    return () => clearInterval(timer); 
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* BOTÓN CORAZÓN (Arriba Derecha) */}
      <div className="absolute top-5 right-5 flex gap-3 z-50">
        <button 
          onClick={manejarClickCorazon}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full text-white hover:scale-110 active:scale-95 transition-all shadow-lg group"
        >
          <span className="text-xl group-hover:animate-pulse">❤️</span>
          <span className="font-bold text-gray-800">{corazones}</span>
        </button>
      </div>

      {/* MARIPOSAS EN PANTALLA */}
      {butterflies.map((butterfly) => (
        <div key={butterfly.id} className="butterfly" style={{ "--x1": butterfly.coords.x1, "--y1": butterfly.coords.y1, "--x2": butterfly.coords.x2, "--y2": butterfly.coords.y2 }}>
          <div className="wing left"></div>
          <div className="wing right"></div>
        </div>
      ))}

      <div className="absolute inset-0 grid grid-cols-4 gap-3 -z-10 ">
        {fotosFondo.map((foto) => (
          <div key={foto.id} className="relative w-full h-full overflow-hidden">
            <img 
              className={`h-full w-full object-cover transition-opacity duration-300 ${cargandoFotoId === foto.id ? 'opacity-30' : 'opacity-100'}`} 
              src={foto.url_imagen} 
              alt={`Foto ${foto.posicion}`} 
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 animate-fly-plane">
          <img src="/pngtree-image-with-airplane-theme-3-message-travel-man-vector-png-image_8792442.jpg" className="h-30 w-auto" alt="Avioncito" />
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-start pt-40 z-10">
        <form className="w-full max-w-2xl mx-auto px-4" action="https://www.google.com/search" method="GET" target="_blank"> 
          <div className="relative">
            <input type="search" name="q" className="block w-full p-4 ps-12 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-pink-500 shadow-sm outline-none" placeholder={placeholderText} required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-pink-600 hover:bg-pink-700 font-medium rounded-lg text-sm px-4 py-2">Buscar</button>
          </div>
        </form>

        <div className="mt-6 w-full max-w-lg text-center bg-white/75 p-4 rounded-2xl shadow-lg border border-white/20 mx-4">
          <h2 className="text-gray-700 font-medium mb-1 text-sm uppercase tracking-wider">Días para ver a mi novio</h2>
          <div id="countdown-timer" className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">00d 00h 00m 00s</div>
          <div id="arrival-message" className="hidden text-xl font-bold text-pink-600 animate-bounce mt-2">Agarrate wacha que voy llegando así</div>
        </div>
      
        {!isLetterOpen && (
          <div className="flex justify-center mt-8">
            <button onClick={() => setIsLetterOpen(true)} className="bg-white/30 backdrop-blur-md border border-white/50 px-6 py-3 rounded-full text-white font-bold hover:bg-white/50 transition-all shadow-xl hover:scale-110 active:scale-95">📩</button>
          </div>
        )}

        <div className="w-full max-w-md mx-auto mt-10 px-4 mb-10"> 
          <div className="bg-[#FFC4E1] rounded-[20px] p-6 shadow-xl border-none">
            <h3 className="text-white font-bold mb-4 text-center flex items-center justify-center gap-2"><span>✨</span> Mensaje de Hoy <span>✨</span></h3>
            {mensajeDeHoy ? (
              <div className="text-center py-6 animate-fade-in w-full overflow-hidden">
                <p className="text-white text-xl italic font-serif break-all whitespace-pre-wrap max-w-full">
                  {mensajeDeHoy.content}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <textarea className="w-full p-4 rounded-2xl bg-black/10 text-white placeholder-white/70 outline-none border border-white/20 resize-none" placeholder="El que escribe primero ganaaa" rows="3" value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
                <button onClick={guardarMensaje} className="w-full py-3 bg-white text-[#e6007e] rounded-xl font-bold shadow-md active:scale-95">Guardar</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLetterOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-[#fdf6e3] w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 md:p-12 rounded-sm shadow-2xl border-l-[20px] border-pink-200">
            <button onClick={() => setIsLetterOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 text-2xl">✖</button>
            <div className="font-serif text-gray-800 space-y-6">
              <h2 className="text-3xl font-bold text-pink-600 mb-8 italic">Mi amor,</h2>
              <p className="leading-relaxed text-lg">Te escribo esta cartita para decirte todo lo que te quiero, han pasado muchos meses desde la ultima vez que te vi, y para ser sincero, mi amor y cariño que siento por ti no ha disminiuido nada, literalmente sube cada dia mas. Es impresionante para mi como estas en mi cabeza constantemente y las cosas que provocas en mi, de verdad que no lo entenderias todo lo que yo siento por ti, es mucho mucho mucho muchooooooooooo. Ya queda poquito bb, ya nos vamos a ver y prometo estar pegado a ti como un chicle y hacerte la persona mas feliz del mundo, porque te lo mereces corazon.</p>
              <p className="leading-relaxed text-lg">Siempre te quize escribir una carta, obviamente esta no es la primera, por que esta la estoy escribiendo en un pc, pero cuando llegue para tus brazos te dare una a tu manito solo para ti. Escribo esto por que queria decirte lo mucho que te quiero, enverdad las palabras se quedan cortas, y esta pagina que hice para ti es algo muy lindo que empezo todo como una idea mala en mi cabeza pero termino siendo algo hermoso (como tu) y que cada vez que lo veo sonrio, onda era para ti y termino tambien siendo para mi. Gracias por todo amorcito.</p>
              <div className="pt-10 text-right">
                <p className="italic text-xl">Con todo mi amor,</p>
                <p className="font-bold text-2xl text-pink-600 mt-2">Tu bb ❤️</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 left-5 z-[100]">
        <button 
          onClick={() => setIsPanelFotosOpen(!isPanelFotosOpen)}
          className="bg-white/80 backdrop-blur-md border border-white/40 p-3 rounded-full shadow-2xl text-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Cambiar fotos de fondo"
        >
          🖼️
        </button>

        {isPanelFotosOpen && (
          <div className="absolute bottom-14 left-0 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-200 w-64 text-gray-800">
            <h4 className="font-bold text-sm mb-2 text-center text-gray-700">Elige el número de foto a cambiar:</h4>
            
            <div className="grid grid-cols-4 gap-2">
              {fotosFondo.map((foto) => (
                <label 
                  key={foto.id} 
                  className={`flex items-center justify-center h-10 w-10 font-bold rounded-lg border cursor-pointer transition-all ${
                    cargandoFotoId === foto.id 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed animate-pulse" 
                      : "bg-pink-50 hover:bg-pink-200 border-pink-200 text-pink-600 active:scale-90"
                  }`}
                >
                  {cargandoFotoId === foto.id ? "⏳" : foto.posicion}
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={cargandoFotoId !== null}
                    onChange={(e) => {
                      cambiarFotoFondo(e, foto.id, foto.posicion);
                      setIsPanelFotosOpen(false); // Cierra el menú al clickear
                    }} 
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;