import React, { useState } from "react";

export default function Admin() {
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState({ name: "", roll: "", course: "", file: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.roll && form.course && form.file) {
      const newCert = {
        id: Date.now(),
        ...form,
        fileUrl: URL.createObjectURL(form.file),
      };
      setCertificates([...certificates, newCert]);
      setForm({ name: "", roll: "", course: "", file: null });
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleSubmit} className="card">
        <input type="text" name="name" placeholder="Student Name" value={form.name} onChange={handleChange} required /><br />
        <input type="text" name="roll" placeholder="Roll Number" value={form.roll} onChange={handleChange} required /><br />
        <input type="text" name="course" placeholder="Course" value={form.course} onChange={handleChange} required /><br />
        <input type="file" name="file" onChange={handleChange} required /><br />
        <button type="submit">Upload Certificate</button>
      </form>

      <h3>Uploaded Certificates</h3>
      {certificates.map(cert => (
        <div key={cert.id} className="card">
          <p><strong>{cert.name}</strong> ({cert.roll}) - {cert.course}</p>
          <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer">View Certificate</a>
        </div>
      ))}
    </div>
  );
}
