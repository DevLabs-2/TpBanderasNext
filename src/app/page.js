"use client"
import Image from "next/image";
import styles from "../app/styles/page.module.css";
import { useEffect, useState } from "react"
export default function Home() {

  const urlApi = "https://countriesnow.space/api/v0.1/countries/flag/images";
  const [banderaSeleccionada, setbanderaSeleccionada] = useState(null);
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState({
    "respuesta": '',
  });
  
  const fetchData = async () => {
    await fetch(urlApi)
      .then(response => response.json())
      .then(data => {
        setPaises(data.data)
      })
      .catch(error => console.log('error: ' + error))
  }

  useEffect(() => {fetchData();}, [])
  useEffect(() => {
    if(paises.length > 0){
      setLoading(false)
    }
  },[paises]) 
  useEffect(() => {
    if(!loading){
      drawRandom()
    }
  }, [loading])
  
  const drawRandom = () => {
    const pais = paises[Math.floor(Math.random() * paises.length)];
    setbanderaSeleccionada(pais);
    
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    processInputValue(inputValue);
    setInputValue("")
  };

  const processInputValue = (value) => {
    console.log('Valor ingresado:', value);
  };
  
  return (
    <>
      <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        {banderaSeleccionada !== null && <Image src={banderaSeleccionada.flag} width={300} height={200}></Image>}
        <form onSubmit={handleSubmit} style={{height: "100%", backgroundColor: '#fff', borderRadius: '10px', padding: '20px', width: '300px', margin: '0 auto', display:"flex", flexDirection:"column", alignItems:"center"}}>
          <label>
            Ingresa algo:
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </label>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </>
  );
}
