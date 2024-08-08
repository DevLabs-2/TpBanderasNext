"use client"
import Image from "next/image";
import styles from "../app/styles/page.module.css";
import { useEffect, useState, useRef } from "react"
import hintImg from "../../public/hint.png"
export default function Home() {

  const urlApi = "https://countriesnow.space/api/v0.1/countries/flag/images";
  const [banderaSeleccionada, setbanderaSeleccionada] = useState(null);
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [puntaje, setPuntaje] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  //timer
  
  const [time, setTime] = useState(0); 
  const intervalRef = useRef(null); 
  const startTimeRef = useRef(0); 

  const startStopwatch = () => { 
      startTimeRef.current = Date.now() - time * 100; 
      intervalRef.current = setInterval(() => { 
          setTime(Math.floor((Date.now() - startTimeRef.current) / 1000)); 
      }, 1000); 
  }; 

  const resetStopwatch = () => { 
      clearInterval(intervalRef.current); 
      setTime(0); 
  }; 

  useEffect(() => {
    if(time >= 15){
      processInputValue(false);
    }
  },[time])

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
    startStopwatch();
    setShowHint(false);
  }

  //logica del juego
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
    drawRandom();
  };
  
  useEffect(() => {
    console.log(puntaje)
  }, [puntaje])

  //pistas

  const blockString = (str) => {
    var returnStr = hint;
    if(!showHint){
      const numberOfBlockedChars = Math.floor(str.length * 0.6);
      var result = str.split('');
      for (let index = 0; index <= numberOfBlockedChars; index++) {
        let indexOfBlocked = Math.floor(Math.random() * str.length)
        if(result[indexOfBlocked] !== " "){
          result[indexOfBlocked] = "#";
        }
        else{
          index--;
        }
      }
      returnStr = result.join('');
    }
    return returnStr;
  }

  const handleHint = () => {
    setHint(blockString(banderaSeleccionada.name));
    setShowHint(true);
  }

  return (
    <>
      <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        <p className={styles.styledContainer} style={{width: '4rem', height: '2rem', }}>{puntaje}</p>
        {showHint && <p>{hint}</p>}
        {banderaSeleccionada !== null && <Image src={banderaSeleccionada.flag} width={300} height={200} objectFit={"fill"} alt="flag" style={{border:"1px solid black"}}></Image>}
        <form onSubmit={handleSubmit} style={{height: "100%", backgroundColor: '#fff', borderRadius: '10px', padding: '20px', width: '300px', margin: '0 auto', display:"flex", flexDirection:"column", alignItems:"center"}}>
          <label style={{width:'15rem'}}>
            <p style={{textAlign: "center"}}>{time}s</p>
            <div style={{width:'100%', display: 'flex', justifyContent:'space-around'}}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="button" className={styles.styledContainer} onClick={handleHint}>❔</button>
            </div>
          </label>
          <br></br>
          <button type="submit" className={styles.button}>Enviar</button>
        </form>
      </div>
    </>
  );
}
