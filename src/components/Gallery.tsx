import React from "react";
import office from "../assets/images/institute-office.jpg";

export default function Gallery(): JSX.Element {
  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-10">Our Institute</h2>
      <div className="max-w-5xl mx-auto px-4">
        <img
          src={office}
          alt="Porikalan Computer Institute Office"
          className="w-full rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
        />
        <p className="text-center mt-6 text-lg text-gray-700">
          Welcome to <span className="font-semibold">Porikalan Computer Institute</span>, Rowriah Nefa Gate, Jorhat, Assam.
        </p>
      </div>
    </section>
  );
}
