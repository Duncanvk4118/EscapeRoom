import { MapPin, Search, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Zoeken naar: ${searchQuery}`);
    // Hier later logica toevoegen voor filteren of een API call maken
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
          <div className="flex items-center space-x-2">
            <User className="text-orange-600 w-6 h-6" />
            <h1 className="font-bold text-xl text-orange-600">Escape the Hell</h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
            <Link to="/" className="hover:text-orange-500 transition">Home</Link>
            <Link to="#" className="hover:text-orange-500 transition">Thema’s</Link>
            <Link to="#" className="hover:text-orange-500 transition">Boek nu</Link>
            <Link to="/login" className="hover:text-orange-500 transition">Login</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-orange-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <nav className="flex flex-col space-y-2 px-4 py-4 font-medium text-gray-700">
              <Link to="/" className="hover:text-orange-500 transition" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="#" className="hover:text-orange-500 transition" onClick={() => setIsMenuOpen(false)}>Thema’s</Link>
              <Link to="#" className="hover:text-orange-500 transition" onClick={() => setIsMenuOpen(false)}>Boek nu</Link>
              <Link to="/login" className="hover:text-orange-500 transition" onClick={() => setIsMenuOpen(false)}>Login</Link>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section
        className="relative flex flex-col justify-center items-center text-center text-white px-6 py-24 md:py-40"
        style={{
          backgroundImage:
            "url('https://www.actionworld.ch/wp-content/uploads/actionworld-escaperooms.jpg')",
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
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-full flex items-center shadow-lg overflow-hidden max-w-md mx-auto w-full"
          >
            <input
              type="text"
              placeholder="Zoek op plaats of thema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-5 py-3 text-gray-800 focus:outline-none text-sm md:text-base"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-400 p-3 md:p-4 rounded-full text-white transition"
            >
              <Search className="w-3 h-3 md:w-5 md:h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* KAART + INFO */}
      <section className="w-full bg-gray-50 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
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

          <div className="flex-1 w-full">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <iframe
                title="Escape Room Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.6626754101513!2d4.8951676!3d52.3702157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c27a1b7b47%3A0x9e1a0f7c6d9dfdd5!2sAmsterdam!5e0!3m2!1snl!2snl!4v1696781234567!5m2!1snl!2snl"
                allowFullScreen
                loading="lazy"
                className="w-full h-[350px] block"
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
