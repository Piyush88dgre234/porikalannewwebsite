
import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-white shadow-md sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Wisdom Coaching</h1>
        <nav className="space-x-6 hidden md:flex">
          <a href="#about" className="hover:text-blue-600 transition">About</a>
          <a href="#courses" className="hover:text-blue-600 transition">Courses</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
        </nav>
      </header>

      <section className="grid md:grid-cols-2 gap-8 items-center px-8 py-20 bg-gradient-to-r from-blue-50 to-white">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Unlock Your Potential with <span className="text-blue-600">Wisdom Coaching</span>
          </h2>
          <p className="text-lg text-gray-700">
            Join us to excel in academics and competitive exams with expert guidance.
          </p>
          <button className="px-6 py-3 rounded-2xl bg-blue-600 text-white shadow hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
        <div className="flex justify-center">
          <img src="/hero.jpg" alt="Wisdom Coaching" className="rounded-2xl shadow-lg max-h-96 object-cover" />
        </div>
      </section>

      <section id="about" className="px-8 py-20 text-center">
        <h3 className="text-3xl font-semibold mb-6">About Us</h3>
        <p className="max-w-2xl mx-auto text-gray-600">
          Wisdom Coaching Center is committed to shaping bright futures by providing
          quality education and personalized mentorship.
        </p>
      </section>

      <section id="courses" className="px-8 py-20 bg-gray-100 text-center">
        <h3 className="text-3xl font-semibold mb-6">Our Courses</h3>
        <p className="max-w-2xl mx-auto text-gray-600">
          Explore our range of courses tailored for school and competitive exam preparation.
        </p>
      </section>

      <section id="contact" className="px-8 py-20 text-center">
        <h3 className="text-3xl font-semibold mb-6">Contact Us</h3>
        <p className="text-gray-700">Phone: 789658787</p>
        <p className="text-gray-700">Address: Wisdom Coaching Center</p>
      </section>

      <footer className="p-6 bg-white shadow-inner text-center">
        <p className="text-gray-500">© 2025 Wisdom Coaching Center. All rights reserved.</p>
      </footer>
    </div>
  );
}
