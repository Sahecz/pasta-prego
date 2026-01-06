import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Utensils, CheckCircle, MapPin } from 'lucide-react'

export const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-white animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src="./public/images/hero-pasta.webp"
          alt="Delicious Pasta"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-6xl md:text-8xl text-white font-bold mb-4 drop-shadow-lg tracking-tight">
            Pasta <span className="text-brand-orange italic">Prè-gō</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-lg mb-8 font-light">
            Sabor italiano auténtico, ingredientes frescos y pasión en cada plato. Directo a tu puerta.
          </p>
          <Link to="/menu" className="bg-brand-orange text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-bold cursor-pointer px-10 py-4 text-lg animate-bounce flex items-center gap-2">
            Hacer Pedido
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      {/* Highlights */}
      <div className="py-16 px-4 md:px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Utensils className="text-brand-orange" size={32} />, title: "Artesanal", desc: "Pasta fresca hecha a mano diariamente." },
          { icon: <CheckCircle className="text-brand-orange" size={32} />, title: "Calidad", desc: "Ingredientes importados de Italia." },
          { icon: <MapPin className="text-brand-orange" size={32} />, title: "Rápido", desc: "Entrega veloz en toda la ciudad." },
        ].map((feature, idx) => (
          <div key={idx} className="bg-gray-50 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              {feature.icon}
            </div>
            <h3 className="font-serif text-2xl text-brand-dark mb-2">{feature.title}</h3>
            <p className="text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
