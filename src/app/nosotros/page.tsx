"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Image from "next/image";

// Datos editables: Cambia texto e imágenes aquí
const pageData = {
  hero: {
    title: "Sobre J&Y Store",
    subtitle: "Comprometidos con la calidad y tu satisfacción desde 2025",
    description: "Descubre nuestra historia, valores y el equipo detrás de tu experiencia de compra.",
    image: "/images/placeholder.png", // Cambia a /images/nosotros/banner.jpg
  },
  historia: {
    title: "Nuestra Historia",
    text: "J&Y Store nació con la visión de ofrecer productos de alta calidad a precios accesibles. Fundada en 2025, hemos crecido gracias a nuestros clientes y nuestro compromiso con la innovación y el servicio excepcional.",
  },
  carrusel: {
    title: "Momentos que Nos Definen",
    items: [
      { image: "/images/placeholder.png", alt: "Tienda física", caption: "Nuestra primera tienda en la ciudad." }, // Cambia imágenes
      { image: "/images/placeholder.png", alt: "Equipo trabajando", caption: "Nuestro equipo colaborando para ti." },
      { image: "/images/placeholder.png", alt: "Clientes felices", caption: "Clientes satisfechos con nuestros productos." },
    ],
  },
  misionVision: {
    mision: {
      title: "Misión",
      text: "Proporcionar productos de calidad que mejoren la vida diaria de nuestros clientes, con un enfoque en la sostenibilidad y la innovación.",
      icon: "🎯", // Ícono simple; puedes usar SVG
    },
    vision: {
      title: "Visión",
      text: "Ser la tienda líder en el mercado, reconocida por nuestra excelencia en servicio y compromiso con la comunidad.",
      icon: "🔭",
    },
  },
  equipo: {
    title: "Nuestro Equipo",
    members: [
      { name: "-Nombre-", role: "Fundador", image: "/images/placeholder.png" }, // Cambia imágenes
      { name: "-Nombre-", role: "Encargado de Ventas", image: "/images/placeholder.png" },
      { name: "-Nombre-", role: "Encargado de Inventario", image: "/images/placeholder.png" },
    ],
  },
  contacto: {
    title: "Contáctanos",
    text: "Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.",
    email: "contacto@jystore.com",
    phone: "+56 9 1234 5678",
  },
};

export default function NosotrosPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % pageData.carrusel.items.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + pageData.carrusel.items.length) % pageData.carrusel.items.length);

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-r from-gray-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg mb-8">
            <Image
              src={pageData.hero.image}
              alt="Banner de J&Y Store"
              fill
              className="object-cover"
              onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
            />
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/70 to-indigo-600/70 flex items-center justify-center">
              <div className="text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{pageData.hero.title}</h1>
                <p className="text-lg md:text-xl mb-2">{pageData.hero.subtitle}</p>
                <p className="text-sm md:text-base opacity-90">{pageData.hero.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="px-4 md:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{pageData.historia.title}</h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">{pageData.historia.text}</p>
        </div>
      </section>

      {/* Carrusel */}
      <section className="px-4 md:px-6 lg:px-8 py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">{pageData.carrusel.title}</h2>
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {pageData.carrusel.items.map((item, index) => (
                <div key={index} className="w-full shrink-0 relative h-64 md:h-80">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                    <p className="text-sm md:text-base">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Controles del Carrusel */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
              aria-label="Anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
              aria-label="Siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="px-4 md:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{pageData.misionVision.mision.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{pageData.misionVision.mision.title}</h3>
            <p className="text-gray-700">{pageData.misionVision.mision.text}</p>
          </div>
          <div className="text-center p-6 bg-linear-to-r from-green-50 to-teal-50 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{pageData.misionVision.vision.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{pageData.misionVision.vision.title}</h3>
            <p className="text-gray-700">{pageData.misionVision.vision.text}</p>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="px-4 md:px-6 lg:px-8 py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">{pageData.equipo.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pageData.equipo.members.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="px-4 md:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{pageData.contacto.title}</h2>
          <p className="text-base md:text-lg text-gray-700 mb-6">{pageData.contacto.text}</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-gray-600"><strong>Email:</strong> {pageData.contacto.email}</p>
            <p className="text-gray-600"><strong>Teléfono:</strong> {pageData.contacto.phone}</p>
          </div>
          {/* Formulario simple (opcional, para integridad) */}
          <form className="mt-8 max-w-md mx-auto space-y-4">
            <input type="text" placeholder="Tu nombre" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" placeholder="Tu email" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="Mensaje" rows={4} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">Enviar Mensaje</button>
          </form>
        </div>
      </section>

      <footer className="bg-gray-100 text-center py-3 md:py-4 text-xs md:text-sm text-gray-600 border-t">
        <p>&copy; 2025 J&Y Store. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}