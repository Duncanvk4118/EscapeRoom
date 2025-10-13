import { MapPin, Search } from "lucide-react";
import {Link} from "react-router";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-xl text-orange-600">Escape the Hell</h1>
          </div>

          <nav className="hidden md:flex md:flex-row md:items-center md:justify-center space-x-6 font-medium text-gray-700 ">
            <Link to="/map" className="hover:text-orange-500 transition">Map</Link>
              <Link to="/scan" className="hover:text-orange-500 transition">Scannen</Link>
            <Link to="/leaderboard" className="hover:text-orange-500 transition">Leaderboard</Link>
            <Link to="/login" className="text-orange-500 outline outline-orange-500 hover:text-white hover:bg-orange-500 p-2 rounded-full transition">Login</Link>
          </nav>

          <button className="md:hidden text-gray-700 hover:text-orange-500">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>



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
