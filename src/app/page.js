"use client"
import Image from "next/image";
import styles from "../app/styles/page.module.css";
import { useEffect, useState } from "react"
export default function Home() {

  const urlApi = "https://countriesnow.space/api/v0.1/countries/flag/images";
  const [banderaSeleccionada, setbanderaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    "respuesta": '',
});
  useEffect(() => {
    fetch(urlApi)
      .then(response => response.json())
      .then(data => {
        if(Array.isArray(data.data)) 
        {
          const paisSeleccionado = data.data[Math.random() * data.data.length];
          setbanderaSeleccionada(paisSeleccionado);
        }
        else {
          console.error("Data no es un array")
        }
      })
      .catch(error => console.log('error: ' + error))
  })

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
        "respuesta": ""
      });
    };

  //const revisarPais = ()
  
  return (
    <>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px', width: '300px', margin: '0 auto', textAlign: 'left' }}>
        <input type="text" name="respuestaIngresada" value={formData.respuesta} onChange={handleChange} placeholder="pais" />
        <button type="submit" style={{ backgroundColor: '#00bfff', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer', fontSize: '16px' }}>Enviar respuesta</button>
      </form>
    </>
  );
}
