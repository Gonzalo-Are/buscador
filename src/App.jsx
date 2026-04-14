import { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";


function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  

  

  const messages = [
    "La mejor polola del mundo ❤️",
    "Mi persona favorita 💕",
    "Te quiero demasiado 🫶",
    "Eres todo para mí 💖",
    "Contigo, cada día es especial 🌟",
    "Eres mi alegría diaria 😊",
    ,"Gracias por ser tú, mi amor 💗"
  ];

  // IMPORTANTE: Asegúrate de que estas fotos existan en tu carpeta /public
  const photos = [
    { src: "/uno.jpeg", tags: "amor nosotros juntos salida" },
    { src: "/dos.jpeg", tags: "cita comida restaurante rico" },
    { src: "/tres.jpeg", tags: "viaje playa vacaciones sol" },
    { src: "/cuatro.jpeg", tags: "sonrisa linda hermosa" },
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setPlaceholderText(messages[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);



  const filteredImages = photos.filter(photo =>
    photo.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <>
      <div className="min-h-screen flex items-start justify-center pt-40">

        <form 
          className="w-full max-w-2xl mx-auto mt-10 px-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchTerm.trim()) {
              window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, "_blank");
            }
          }}
        > 
          <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            
            <input 
              type="search" 
              id="search" 
              className="block w-full p-4 ps-12 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-pink-500 focus:border-pink-500 shadow-sm outline-none transition-all" 
              placeholder={placeholderText} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required 
            />
            
            <button 
              type="submit" 
              className="text-white absolute end-2.5 bottom-2.5 bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
      

      {/* <div className="grid grid-cols-4 gap-3">

        <img class="h-68 w-126 md:object-contain  ..." src="/uno.jpeg" />

        <img class="h-68 w-126 md:object-contain  ..." src="/dos.jpeg" />

        <img class="h-68 w-126 md:object-contain  ..." src="/tres.jpeg" />

        <img class="h-68 w-126 md:object-contain  ..." src="/cuatro.jpeg" />

        <img class="h-68 w-126 md:object-contain  ..." src="/cinco.jpeg" />

        <img class="h-68 w-126 md:object-contain  ..." src="/seis.jpeg" />

        <img class="h-68 w-126 md:object-contain  ..." src="/siete.jpeg" />

        <img class="h-68 w-126 md:object-contain  ..." src="/ocho.jpeg" />
      
      </div> */}
    </>

  );
}


export default App;