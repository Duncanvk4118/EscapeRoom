import { MapPin, Search } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
          <div className="flex items-center space-x-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/483/483947.png"
              alt="Logo"
              className="w-8 h-8"
            />
            <h1 className="font-bold text-xl text-orange-600">Escape the Hell</h1>
          </div>

          <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
            <a href="#" className="hover:text-orange-500 transition">Home</a>
            <a href="#" className="hover:text-orange-500 transition">Thema’s</a>
            <a href="#" className="hover:text-orange-500 transition">Boek nu</a>
            <a href="#" className="hover:text-orange-500 transition">Contact</a>
          </nav>

          <button className="md:hidden text-gray-700 hover:text-orange-500">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        className="relative flex flex-col justify-center items-center text-center text-white px-6 py-24 md:py-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Ontsnap uit de hel als je durft 🔥
          </h2>
          <p className="text-base md:text-lg text-gray-200 mb-10">
            Werk samen, los raadsels op en vind de uitgang voordat de tijd om is.
            Een unieke escaperoomervaring vol spanning en mysterie.
          </p>

          {/* ZOEKVELD */}
          <div className="bg-white rounded-full flex items-center shadow-lg overflow-hidden max-w-md mx-auto w-full">
            <input
              type="text"
              placeholder="Zoek op plaats of thema..."
              className="flex-1 px-5 py-3 text-gray-800 focus:outline-none text-sm md:text-base"
            />
            <button className="bg-orange-500 hover:bg-orange-400 p-3 md:p-4 rounded-full text-white mr-2 transition">
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* KAART + INFO */}
      <section className="w-full bg-gray-50 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Tekstblok */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center md:justify-start">
              <MapPin className="text-orange-500 mr-2 w-6 h-6" /> Vind onze locatie
            </h3>
            <p className="text-gray-600 mb-3">
              Ontdek waar onze escaperoom zich bevindt. Gebruik de kaart hiernaast
              om de ingang te vinden — maar pas op, niets is wat het lijkt...
            </p>
            <p className="text-gray-600">
              We hebben meerdere kamers verspreid over Nederland. Meer locaties
              worden binnenkort toegevoegd!
            </p>
          </div>

          {/* Kaartblok */}
          <div className="flex-1 w-full">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <iframe
                title="Escape Room Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.6626754101513!2d4.8951676!3d52.3702157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c27a1b7b47%3A0x9e1a0f7c6d9dfdd5!2sAmsterdam!5e0!3m2!1snl!2snl!4v1696781234567!5m2!1snl!2snl"
                width="100%"
                height="350"
                allowFullScreen=""
                loading="lazy"
                className="block"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 bg-gray-900 text-gray-400 text-sm">
        © 2025 Escape the Hell — Dare to Escape?
      </footer>
    </div>
  );
}
