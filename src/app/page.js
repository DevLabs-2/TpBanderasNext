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
  const [puntaje, setPuntaje] = useState(0);
  const [timer, setTimer] = useState(0);

  //timer
  useEffect(() => {
    if (!loading && timer > 0) {
        const interval = setInterval(() => {
            setTimer(timer - 1);
        }, 1000);
        return () => clearInterval(interval);
    } else if (timer === 0) {
        processInputValue(false); 
    }
}, [loading]);

  //fetch
  const fetchData = async () => {
    await fetch(urlApi)
      .then(response => response.json())
      .then(data => {
        setPaises(data.data)
      })
      .catch(error => console.log('error: ' + error))
  }
  useEffect(() => {fetchData();}, [])
 
  //load y draw inicial
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
    if(value) {
      let acierto =  value.toLowerCase().replaceAll(" ", "") === banderaSeleccionada.name.toLowerCase().replaceAll(" ", "")
      if(acierto){
        setPuntaje(puntaje + 10)
      }
      else{
        setPuntaje(puntaje - 1)
      }
    }
    else{
      setPuntaje(puntaje - 1)
    }
    setTimer(0);
    drawRandom();
  };
  
  useEffect(() => {
    console.log(puntaje)
  }, [puntaje])

  const paragraphStyle = {
    fontFamily: "'Arial', sans-serif",
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    background: 'linear-gradient(45deg, #1e90ff, #ff6347)',
    padding: '10px 20px',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    margin: '20px auto',
    width: 'fit-content',
  };

  return (
    <>
      <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        <p style={paragraphStyle}>{puntaje}</p>
        {banderaSeleccionada !== null && <Image src={banderaSeleccionada.flag} width={300} height={200} objectFit={"fill"} alt="flag" style={{border:"1px solid black"}}></Image>}
        <form onSubmit={handleSubmit} style={{height: "100%", backgroundColor: '#fff', borderRadius: '10px', padding: '20px', width: '300px', margin: '0 auto', display:"flex", flexDirection:"column", alignItems:"center"}}>
          <label>
            <p>{timer}s</p>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </label>
          <br></br>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </>
  );
}
