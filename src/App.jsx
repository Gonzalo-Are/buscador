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
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [opacidadSplash, setOpacidadSplash] = useState("opacity-100");
  
  // Estados nuevos para el control de fotos dinámicas
  const [fotosFondo, setFotosFondo] = useState([]);
  const [cargandoFotoId, setCargandoFotoId] = useState(null);
  const [isPanelFotosOpen, setIsPanelFotosOpen] = useState(false);


  // fomulario wacho

    // Estados para la Trivia Diaria Interactiva
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("jugar"); // "jugar" o "crear"
  const [preguntaDelHoy, setPreguntaDelHoy] = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [triviaFeedback, setTriviaFeedback] = useState("");

  // Estado para el formulario de nueva pregunta
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [opcionesNuevas, setOpcionesNuevas] = useState(["", "", "", ""]);
  const [correctaNueva, setCorrectaNueva] = useState(0);
  const [autorNueva, setAutorNueva] = useState("Mi bb");

  // aca terminar formu


  const messages = [
    "La mejor polola del mundo ❤️", "Mi persona favorita 💕", "Te quiero demasiado 🫶",
    "Eres todo para mí 💖", "Contigo, cada día es especial 🌟", "Eres mi alegría diaria 😊",
    "Gracias por ser tú, mi amor 💗", "Te extraño bb 🥺", "Te quiero abrazar y no soltar🥺",
    "Estoy loco por ti💖 ", "Cada dia que pasa me enamoro mas 💗", "Ya quiero darte mil besitos 🥰",
    "Me cambiaste la vida amor 💕", "Contigo, todo es mejor 💖","Apoyo a Jim y a Pam"
  ];


  // formu 


  // Cargar la pregunta de trivia correspondiente a hoy
useEffect(() => {
  const cargarTrivia = async () => {
    const hoyStr = new Date().toISOString().split('T')[0];
    
    // A. Intentar buscar en Supabase primero
    const { data, error } = await supabase
      .from('trivia_preguntas')
      .select('*')
      .eq('fecha_publicacion', hoyStr)
      .maybeSingle();

    if (data) {
      setPreguntaDelHoy(data);
    } else {
      // B. Respaldo local si la tabla está vacía o no hay fecha asignada
      const poolPreguntas = [
        {
          id: 101,
          pregunta: "Si me quedo atrapado en el universo de una de estas series, ¿cual elijo?",
          opciones: ["Un show mas", "Hora de Aventura", "Gravity Falls", "Phineas y Ferb"],
          correcta: 3,
          autor: "Tu bb"
        },
        {
          id: 102,
          pregunta: "Quien me gusta mas de todos estos?",
          opciones: ["Myke Towers", "Ozuna", "Bad Bunny", "Anuel AA"],
          correcta: 1,
          autor: "Tu bb"
        },
        {
          id: 103,
          pregunta: "Que me gusta mas de todos estos?",
          opciones: ["Piscola", "Vino blanco con kem(bebida de piña)", "Fernet con coca", "Whisky con Coca"],
          correcta: 1,
          autor: "Tu bb"
        }
      ];

      // Seleccionar una fija basada en el día del mes para que no cambie al recargar
      const diaDelMes = new Date().getDate();
      const indice = diaDelMes % poolPreguntas.length;
      setPreguntaDelHoy(poolPreguntas[indice]);
    }
  };
  cargarTrivia();
  
  // Recuperar si ya había respondido hoy para mantener el feedback
  const respondidaHoy = localStorage.getItem(`trivia_respondida_${new Date().toISOString().split('T')[0]}`);
  if (respondidaHoy) {
    setRespuestaSeleccionada(parseInt(respondidaHoy));
    setTriviaFeedback("¡Ya respondiste esta pregunta hoy! ✨");
  }
}, []);


// formu termina

















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

  // Temporizador de 4 segundos para desvanecer la foto de bienvenida
useEffect(() => {
  // A los 3.5 segundos empieza a desvanecerse (dura 500ms la transición)
  const timerOpacidad = setTimeout(() => {
    setOpacidadSplash("opacity-0 pointer-events-none");
  }, 3500);

  // A los 4 segundos se elimina por completo de la pantalla
  const timerRemover = setTimeout(() => {
    setMostrarSplash(false);
  }, 4000);

  return () => {
    clearTimeout(timerOpacidad);
    clearTimeout(timerRemover);
  };
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



  // formu 

  // Manejar la respuesta del usuario
const manejarRespuestaTrivia = (indiceOpcion) => {
  if (respuestaSeleccionada !== null) return; // Bloquear si ya respondió

  setRespuestaSeleccionada(indiceOpcion);
  const hoyStr = new Date().toISOString().split('T')[0];
  localStorage.setItem(`trivia_respondida_${hoyStr}`, indiceOpcion);

  if (indiceOpcion === preguntaDelHoy.correcta) {
    setTriviaFeedback("CORREEEECTOOOOOU");
    // Disparar ráfaga de mariposas reutilizando tu función de corazones
    for(let i=0; i<5; i++) {
      setTimeout(manejarClickCorazon, i * 300);
    }
  } else {
    setTriviaFeedback("Upsi");
  }
};

// Guardar nueva pregunta creada por ella en Supabase
const guardarNuevaPregunta = async (e) => {
  e.preventDefault();
  if (!nuevaPregunta.trim() || opcionesNuevas.some(o => !o.trim())) {
    alert("Por favor completa la pregunta y las 4 opciones.");
    return;
  }

  try {
    // 1. Buscar la última fecha registrada en la BD para agendar al día siguiente
    const { data: ultimas } = await supabase
      .from('trivia_preguntas')
      .select('fecha_publicacion')
      .order('fecha_publicacion', { ascending: false })
      .limit(1);

    let nuevaFecha = new Date();
    if (ultimas && ultimas.length > 0) {
      nuevaFecha = new Date(ultimas[0].fecha_publicacion);
      nuevaFecha.setDate(nuevaFecha.getDate() + 1); // Día siguiente
    } else {
      nuevaFecha.setDate(nuevaFecha.getDate() + 1); // Mañana si está vacía
    }

    const fechaStr = nuevaFecha.toISOString().split('T')[0];

    // 2. Insertar en Supabase
    const { error } = await supabase
      .from('trivia_preguntas')
      .insert([{
        pregunta: nuevaPregunta,
        opciones: opcionesNuevas,
        correcta: correctaNueva,
        fecha_publicacion: fechaStr,
        autor: autorNueva
      }]);

    if (error) throw error;

    alert(`Pregunta guardada , Quedó programada para el día: ${fechaStr} 🎉`);
    
    // Limpiar formulario y cerrar panel
    setNuevaPregunta("");
    setOpcionesNuevas(["", "", "", ""]);
    setIsTriviaOpen(false);

  } catch (error) {
    console.error("Error guardando pregunta:", error.message);
    alert("No se pudo conectar a la base de datos de trivia, revisa si creaste la tabla.");
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
        
        {/* PANTALLA DE BIENVENIDA (SPLASH SCREEN) 
{mostrarSplash && (
  <div className={`fixed inset-0 z-[300] bg-black flex items-center justify-center transition-opacity duration-500 ease-in-out ${opacidadSplash}`}>
    <img 
      src="/intro-1582038150.jpg" // Puse la foto "seis" de ejemplo, cámbiala por la que tú quieras que parpadee al inicio
      alt="Bienvenida" 
      className="w-full h-full object-cover md:w-auto md:h-[80vh] md:rounded-2xl shadow-2xl"
    />
  </div>
)}
*/}



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
              <p className="leading-relaxed text-lg">Como esta mi bebota, la mas linda del universo para mis ojitos, quiero decirte que gracias por todo onda, me despierto todos los dias escuchando tu voz y de verdad es una felicidad que no puedo descrbir, es lo mejor que me paso en mi vida bb, de verdad gracias por hacer a este niño que ahora esta un poco vieji(mentira) el mas feliz del mundo. Espero hacerte sentir lo mismo corazon. </p>
              <p className="leading-relaxed text-lg">Aunque nuestro tiempo pegaditos fue poco, ese tiempo basto para dejarme loco y totalmente enomarado de ti, nos dimos besitos solo 3 dias y dios sigo muerto hasta el dia de hoy, nunca pense que fuera posible hasta que llego alguien llamada Maithe, que fuera 4 años menor que yo y que me tuviera tan enganchado, lo que siento dia a dia no lo senti nunca, de verdad bb, lo que he echo este tiempo para estar contigo no se compara con nada que he echo en mi vida. Yo miro para atras y te veo a lo lejos y soy capaz de hacer todo para estar contigo. Me encanta hacerte cositas, me divierto mucho y me encanta ver tu reaccion, yo vine a tu vida bb para hacerte reir y espero que lo este haciendo bien, te quiero mucho. 

              </p>
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


        {/* BOTÓN FLOTANTE TRIVIA DIARIA (Abajo a la derecha) */}
<div className="fixed bottom-5 right-5 z-[100]">
  <button 
    onClick={() => setIsTriviaOpen(!isTriviaOpen)}
    className="bg-white/80 backdrop-blur-md border border-white/40 p-3 rounded-full shadow-2xl text-xl hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center h-12 w-12"
    title="Trivia del Día"
  >
    🧠
  </button>

  {/* PANEL PRINCIPAL DE TRIVIA */}
  {isTriviaOpen && (
    <div className="absolute bottom-14 right-0 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-gray-200 w-80 md:w-96 text-gray-800 animate-fade-in">
      
      {/* PESTAÑAS (TABS) */}
      <div className="flex border-b border-gray-200 mb-4 text-sm font-bold">
        <button 
          onClick={() => setActiveTab("jugar")}
          className={`flex-1 pb-2 text-center transition-colors ${activeTab === "jugar" ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-400"}`}
        >
          Responder
        </button>
        <button 
          onClick={() => setActiveTab("crear")}
          className={`flex-1 pb-2 text-center transition-colors ${activeTab === "crear" ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-400"}`}
        >
          Añadir Pregunta
        </button>
      </div>

      {/* CONTENIDO PESTAÑA: JUGAR */}
      {activeTab === "jugar" && (
        <div className="space-y-4">
          {preguntaDelHoy ? (
            <>
              <div className="text-xs font-semibold text-pink-500  tracking-wider">
                Pregunta de hoy (Por: {preguntaDelHoy.autor})
              </div>
              <h4 className="font-bold text-gray-800 text-base leading-snug">{preguntaDelHoy.pregunta}</h4>
              
              <div className="flex flex-col gap-2">
                {preguntaDelHoy.opciones.map((opcion, index) => {
                  // Lógica de colores tras responder
                  let colorBoton = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-pink-50 hover:border-pink-200";
                  if (respuestaSeleccionada !== null) {
                    if (index === preguntaDelHoy.correcta) colorBoton = "bg-green-100 border-green-400 text-green-700 font-bold";
                    else if (respuestaSeleccionada === index) colorBoton = "bg-red-100 border-red-400 text-red-700";
                    else colorBoton = "bg-gray-100 border-gray-200 text-gray-400 opacity-60";
                  }

                  return (
                    <button
                      key={index}
                      disabled={respuestaSeleccionada !== null}
                      onClick={() => manejarRespuestaTrivia(index)}
                      className={`w-full p-3 text-left text-sm rounded-xl border transition-all ${colorBoton}`}
                    >
                      {opcion}
                    </button>
                  );
                })}
              </div>

              {triviaFeedback && (
                <div className="text-center text-sm font-bold text-pink-600 bg-pink-50 p-2 rounded-xl animate-pulse mt-2">
                  {triviaFeedback}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center py-4 text-sm">Cargandoouuu</p>
          )}
        </div>
      )}

      {/* CONTENIDO PESTAÑA: CREAR */}
      {activeTab === "crear" && (
        <form onSubmit={guardarNuevaPregunta} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Escribe la pregunta:</label>
            <input 
              type="text" 
              required
              value={nuevaPregunta}
              onChange={(e) => setNuevaPregunta(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-pink-400 text-sm"
              placeholder="Te quiero bb linda"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-600">Opciones linda, el que tenga el circulo marcado es el correcto</label>
            {opcionesNuevas.map((opcion, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="correctaRadio" 
                  checked={correctaNueva === idx}
                  onChange={() => setCorrectaNueva(idx)}
                  className="accent-pink-500 h-4 w-4 cursor-pointer"
                />
                <input 
                  type="text" 
                  required
                  value={opcion}
                  onChange={(e) => {
                    const copia = [...opcionesNuevas];
                    copia[idx] = e.target.value;
                    setOpcionesNuevas(copia);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none text-xs"
                  placeholder={`Opción ${idx + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-600 mb-1">Quien?</label>
              <select 
                value={autorNueva} 
                onChange={(e) => setAutorNueva(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-lg bg-white text-xs"
              >
                <option value="Mi bb">Mi bb</option>
                <option value="Tu bb">Tu bb</option>
              </select>
            </div>
            <button 
              type="submit"
              className="flex-1 mt-5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Guardar Pregunta
            </button>
          </div>
        </form>
      )}

    </div>
  )}
</div>










    </div>
  );
}

export default App;