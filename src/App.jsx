// Importing styles
import './App.css'

// Importing hooks and libraries
import { useState, useEffect, useRef } from 'react'
import Typewriter from 'typewriter-effect';
import { Analytics } from "@vercel/analytics/react"
import { themes } from './themes/themes';
import { quotes } from './quotes/quotes';
import { ContactUs } from './components/contactform/contactform';

// Importing images 
import clasuLogo from './assets/clasulogo.svg'
import luiska from './assets/luiska.svg'
import hanninen from './assets/hanninen.svg'
import pasi from './assets/pasi.svg'
import gymmoila from './assets/gymmoila.png'

function App() {

  // Color theme states
  const [themeBackground, setThemeBackground] = useState(themes[0].background)
  const [themeSecondary, setThemeSecondary] = useState(themes[0].secondary)
  const [themeFontColor, setThemeFontColor] = useState(themes[0].fontColor)
  const [themeSecondaryFontColor, setThemeSecondaryFontColor] = useState(themes[0].secondaryFontColor)

  // easter egg
  const [isFalling, setIsFalling] = useState(false)

  // sidebar states
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false)
  const [infoContainerOpen, setInfoContainerOpen] = useState(false)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  // Game states
  const [maxTime, setMaxTime] = useState(60)
  const [randomIndex, setRandomIndex] = useState(0)
  const [words, setWords] = useState(quotes[randomIndex].quote)
  const [author, setAuthor] = useState(quotes[randomIndex].author)
  const [charIndex, setCharIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(maxTime)
  const [mistakes, setMistakes] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [correctWrong, setCorrectWrong] = useState([])
  const [gameOver, setGameOver] = useState(false)

  const inputRef = useRef(null)
  const charRefs = useRef([])

  const clickNoise = new Audio('/pop2.mp3')

  const randomIndexGenerate = () => {
    setRandomIndex(Math.floor(Math.random() * quotes.length))
    console.log(randomIndex)
  }

  useEffect(() => {
    generateWords()
  }, [])

  useEffect(() => {
    if (words && (timeLeft <= 0 || charIndex >= words.length)) {
      setIsRunning(false);
      console.log('game over')
      setGameOver(true);
    }
  }, [timeLeft, charIndex, words]);

  const calculateWpm = () => {
    const timeElapsed = maxTime - timeLeft;
    if (timeElapsed > 0) {
      setWpm(Math.round((charIndex / timeElapsed) * (60 / 5)));
    } else {
      setWpm(0);
    }
  }

  useEffect(() => {
    calculateWpm()
  }, [timeLeft])

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        let correctChars = charIndex - mistakes;
        let totalTime = maxTime - timeLeft;

        let wpm = Math.ceil((correctChars / 5 / totalTime) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        setWpm(wpm);

        let accuracy = (100 - (mistakes / (charIndex - mistakes)) * 100).toFixed(0);
        setAccuracy(accuracy);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);


  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      if (charIndex > 0) {
        setCharIndex(charIndex - 1);
        correctWrong[charIndex - 1] = '';
        inputRef.current.value = '';
      }
    } else if (e.key === 'Enter') {
      resetgame()
    }
      
     else {
      const characters = charRefs.current;
      let currentChar = charRefs.current[charIndex];
      let typedChar = e.key;

      if (currentChar) {
        currentChar.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      }
      
      if (charIndex < characters.length && timeLeft > 0) {
        if (!isRunning) {
          setIsRunning(true)
        }
        
        if (typedChar === currentChar.textContent) {
          setCharIndex(charIndex + 1)
          correctWrong[charIndex] = 'correct'
        } else {
          setCharIndex(charIndex + 1)
          setMistakes(mistakes + 1)
          correctWrong[charIndex] = 'wrong'
        }
        
        if (charIndex === characters.length - 1) {
          setIsRunning(false)
          setWpm(0)
        }
      } else {
        setIsRunning(false)
        setWpm(0)
        
      }
    }
  }

  const resetgame = () => {
    setCharIndex(0)
    setMistakes(0)
    setWpm(0)
    setIsRunning(false)
    setCorrectWrong([])
    setMaxTime(60)
    setTimeLeft(maxTime)
    inputRef.current.focus()
  }

  const generateWords = () => {
    randomIndexGenerate()
    const quote = quotes[randomIndex]
    if (quote && quote.quote && quote.quote !== '-') {
      setWords(quote.quote)
      setAuthor(quote.author)
    } else {
      console.error('Invalid quote generated');
    }
    setCharIndex(0)
    setMistakes(0)
    setWpm(0)
    setTimeLeft(maxTime)
    setIsRunning(false)
    setCorrectWrong([])
    setGameOver(false)
    setMaxTime(60)
    inputRef.current.focus()
    clickNoise.play()
  }

  const easterEggFunction = () => {
    setIsFalling(true)
    setTimeout(() => {
      setIsFalling(false)
    }, 5000)
  }

  return (
    <main style={{ backgroundColor: themeBackground, color: themeFontColor  }}>

      <div className={isFalling ? 'easter-egg' : 'easter-egg-hide'}>
        <div><img className='hanninen-1' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-2' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-3' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-4' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-5' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-6' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-7' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-8' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-9' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-1' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-2' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-3' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-4' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-5' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-6' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-7' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-1' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-2' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-3' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-4' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-5' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-6' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-7' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-8' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-9' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-1' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-2' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-3' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-4' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-5' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-6' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-7' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-1' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-2' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-3' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-4' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-5' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-6' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-7' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-8' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-9' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-1' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-2' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-3' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-4' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-5' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-6' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-7' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-1' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-2' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-3' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-4' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-5' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-6' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-7' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-8' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-9' src={gymmoila} alt="" width={100}/></div>
        <div><img className='hanninen-1' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-2' src={luiska} alt="" width={100}/></div>
        <div><img className='hanninen-3' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-4' src={pasi} alt="" width={100}/></div>
        <div><img className='hanninen-5' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-6' src={hanninen} alt="" width={100}/></div>
        <div><img className='hanninen-7' src={gymmoila} alt="" width={100}/></div>

      </div>

      {/* Theme selector sidebar */}
      <div className={themeSelectorOpen ? 'theme-selector' : 'theme-selector-closed'} style={{ backgroundColor: themeSecondary}}>
        <svg
          onClick={() => setThemeSelectorOpen(!themeSelectorOpen)}
          className='return-arrow'
          fill={themeFontColor}
          style={{ cursor: 'pointer'}}
          width={20} height={20}
          viewBox="0 0 15 15" 
          xmlns="http://www.w3.org/2000/svg" 
          id="arrow">
          <path d="M8.29289 2.29289C8.68342 1.90237 9.31658 1.90237 9.70711 2.29289L14.2071 6.79289C14.5976 7.18342 14.5976 7.81658 14.2071 8.20711L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L11 8.5H1.5C0.947715 8.5 0.5 8.05228 0.5 7.5C0.5 6.94772 0.947715 6.5 1.5 6.5H11L8.29289 3.70711C7.90237 3.31658 7.90237 2.68342 8.29289 2.29289Z"/>
        </svg>
        <h1>Vaihda väriteemaa</h1>

        <div className='theme-selector-container' style={{ borderColor: themeFontColor}}>
          {themes.map((theme) => (
            <div key={theme.name} onClick={() => {
              setThemeBackground(theme.background)
              setThemeSecondary(theme.secondary)
              setThemeFontColor(theme.fontColor)
              setThemeSecondaryFontColor(theme.secondaryFontColor)
            }}>
              <div className='theme-box'>
                <p>{theme.index}. {theme.name}</p>
                <div className='theme-overview' style={{ backgroundColor: theme.background }}>
                  <div style={{ backgroundColor: theme.background }}></div>
                  <div style={{ backgroundColor: theme.secondary }}></div>
                  <div style={{ backgroundColor: theme.fontColor }}></div>
                </div>                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info sidebar */}
      <div className={infoContainerOpen ? 'info-container' : 'info-container-hide'} style={{ backgroundColor: themeSecondary}}>
          <svg
            onClick={() => setInfoContainerOpen(!infoContainerOpen)}
            className='return-arrow'
            fill={themeFontColor}
            style={{ cursor: 'pointer'}}
            width={20} height={20}
            viewBox="0 0 15 15" 
            xmlns="http://www.w3.org/2000/svg" 
            id="arrow">
            <path d="M8.29289 2.29289C8.68342 1.90237 9.31658 1.90237 9.70711 2.29289L14.2071 6.79289C14.5976 7.18342 14.5976 7.81658 14.2071 8.20711L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L11 8.5H1.5C0.947715 8.5 0.5 8.05228 0.5 7.5C0.5 6.94772 0.947715 6.5 1.5 6.5H11L8.29289 3.70711C7.90237 3.31658 7.90237 2.68342 8.29289 2.29289Z"/>
          </svg>
          <h1>Tietoa ClasuTyperista</h1>

          <p>
            ClasuTyperissa testaat kirjoitusnopeuttasi Clasun opettajien sanomien lausahdusten avulla!
            <hr style={{border: `1px solid ${themeFontColor}`}}/>
            Kyseessä on harrastelumielessä tehty koodausprojekti. Sen tarkoituksena ei ole loukata ketään clasun kunnioitettavista opettajista  &lt;3
            <hr style={{border: `1px solid ${themeFontColor}`}}/>
            Huom. Peli on vasta ensimmäisessä versiossaan, jonka vuoksi bugit saattavat olla yleisiä. Kiitos ymmärryksestä!
          </p>
      </div>

      {/* Contact sidebar */}
      <div className={contactOpen ? 'contact-container' : 'contact-container-hide'} style={{ backgroundColor: themeSecondary}}>
        <svg
          onClick={() => setContactOpen(!contactOpen)}
          className='return-arrow'
          fill={themeFontColor}
          style={{ cursor: 'pointer'}}
          width={20} height={20}
          viewBox="0 0 15 15" 
          xmlns="http://www.w3.org/2000/svg" 
          id="arrow">
          <path d="M8.29289 2.29289C8.68342 1.90237 9.31658 1.90237 9.70711 2.29289L14.2071 6.79289C14.5976 7.18342 14.5976 7.81658 14.2071 8.20711L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L11 8.5H1.5C0.947715 8.5 0.5 8.05228 0.5 7.5C0.5 6.94772 0.947715 6.5 1.5 6.5H11L8.29289 3.70711C7.90237 3.31658 7.90237 2.68342 8.29289 2.29289Z"/>
        </svg>

        <h1>Parannusehdotuksia? Lisää quoteja?</h1>
        <ContactUs style={{backgroundColor: themeBackground}} inputStyle={{color: themeFontColor, backgroundColor: themeSecondary}}/>
      </div>

      {/* Credits sidebar */}
      <div className={creditsOpen ? 'credits-open' : 'credits-hide'} style={{ backgroundColor: themeSecondary}}>
        <svg
          onClick={() => setCreditsOpen(!creditsOpen)}
          className='return-arrow'
          fill={themeFontColor}
          style={{ cursor: 'pointer'}}
          width={20} height={20}
          viewBox="0 0 15 15" 
          xmlns="http://www.w3.org/2000/svg" 
          id="arrow">
          <path d="M8.29289 2.29289C8.68342 1.90237 9.31658 1.90237 9.70711 2.29289L14.2071 6.79289C14.5976 7.18342 14.5976 7.81658 14.2071 8.20711L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L11 8.5H1.5C0.947715 8.5 0.5 8.05228 0.5 7.5C0.5 6.94772 0.947715 6.5 1.5 6.5H11L8.29289 3.70711C7.90237 3.31658 7.90237 2.68342 8.29289 2.29289Z"/>
        </svg>

        <h1>Credits</h1>
        
        <p>Made by: <br></br>Clasun Abi 2025</p>
        <hr style={{border: `1px solid ${themeFontColor}`}}/>
        <p>Erityismaininta Clarukselle, joihin on dokumentoitu opettajien lausahduksia</p>
        <hr style={{border: `1px solid ${themeFontColor}`}}/>
        <p>Inspiraationa toiminut: <a style={{color: themeFontColor}} target='_blank' href="https://monkeytype.com">https://monkeytype.com</a></p>
      </div>

      {/* Privacy sidebar */}
      <div className={privacyOpen ? 'privacy-open' : 'privacy-hide'} style={{ backgroundColor: themeSecondary}}>
        <svg
          onClick={() => setPrivacyOpen(!privacyOpen)}
          className='return-arrow'
          fill={themeFontColor}
          style={{ cursor: 'pointer'}}
          width={20} height={20}
          viewBox="0 0 15 15" 
          xmlns="http://www.w3.org/2000/svg" 
          id="arrow">
          <path d="M8.29289 2.29289C8.68342 1.90237 9.31658 1.90237 9.70711 2.29289L14.2071 6.79289C14.5976 7.18342 14.5976 7.81658 14.2071 8.20711L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L11 8.5H1.5C0.947715 8.5 0.5 8.05228 0.5 7.5C0.5 6.94772 0.947715 6.5 1.5 6.5H11L8.29289 3.70711C7.90237 3.31658 7.90237 2.68342 8.29289 2.29289Z"/>
        </svg>

        <h1>Yksityisyys</h1>

        <p>
          Tämä sivusto käyttää analytiikkatyökaluja kerätäkseen relevanttia informaatiota 
          vierailijoiden määrästä. Sivusto ei kerää vierailijoista arkaluontoista dataa. 
          Analytiikkatyökalu kerää seuraavat vierailijan tiedot: selain, käyttöjärjestelmä, maa sekä referoija.
        </p>
      </div>

      <header className='header'>
        <div className='header-logo'>
          <img onClick={easterEggFunction} src={clasuLogo} alt="cow" width={50}/>
          <h1>
            <Typewriter
              options={{
                strings: ['ClasuTyper.fi'],
                autoStart: true,
                loop: true,
                pauseFor: 5000,
              }}
            />
          </h1>
        </div>
        <div className='header-buttons'>
          <svg
            className='theme-selector-icon'
            onClick={() => setThemeSelectorOpen(!themeSelectorOpen)}
            width={20} 
            height={20} 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            aria-hidden="true" role="img"
            fill={themeFontColor} 
            preserveAspectRatio="xMidYMid meet">
              <path d="M44.55 10.526C18.234 10.526 0 31.58 0 42.106s5.263 18.42 15.79 18.42c10.526 0 15.789 2.632 15.789 10.527c0 10.526 7.895 18.42 18.421 18.42c34.21 0 50-18.42 50-36.841c0-31.58-23.87-42.106-55.45-42.106zm-7.024 10.527a6.58 6.58 0 1 1 0 13.158a6.58 6.58 0 0 1 0-13.158zm21.053 0a6.58 6.58 0 1 1 0 13.158a6.58 6.58 0 0 1 0-13.158zm19.053 10.526a6.579 6.579 0 1 1 0 13.158a6.579 6.579 0 0 1 0-13.158zm-58.527 1.263a6.58 6.58 0 1 1 0 13.158a6.58 6.58 0 0 1 0-13.158zM54 63.158a7.895 7.895 0 0 1 7.895 7.895c0 4.36-5.535 7.894-9.895 7.894a7.895 7.895 0 0 1-7.895-7.894c0-4.36 5.535-7.895 9.895-7.895z"></path>
            </svg>
          <hr style={{border: `1px solid ${themeFontColor}`}}/>
          <svg 
            className='info-icon'
            onClick={() => setInfoContainerOpen(!infoContainerOpen)} 
            width={20} 
            height={20} 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
            fill={themeFontColor} 
          >
            <path fill-rule="evenodd" d="M0 10C0 4.478 4.478 0 10 0c5.523 0 10 4.478 10 10 0 5.523-4.477 10-10 10-5.522 0-10-4.477-10-10zm11.125 2.002H8.989v-.141c.01-1.966.492-2.254 1.374-2.782.093-.056.19-.114.293-.178.73-.459 1.292-1.038 1.292-1.883 0-.948-.743-1.564-1.666-1.564-.851 0-1.657.398-1.712 1.533H6.304C6.364 4.693 8.18 3.5 10.294 3.5c2.306 0 3.894 1.447 3.894 3.488 0 1.382-.695 2.288-1.805 2.952l-.238.144c-.79.475-1.009.607-1.02 1.777V12zm.17 3.012a1.344 1.344 0 01-1.327 1.328 1.32 1.32 0 01-1.328-1.328 1.318 1.318 0 011.328-1.316c.712 0 1.322.592 1.328 1.316z"/>
          </svg>
          <hr style={{border: `1px solid ${themeFontColor}`}}/>
          <svg
            className='contact-icon'
            onClick={() => setContactOpen(!contactOpen)}
            fill={themeFontColor}
            width={25} 
            height={25}
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4c-1.103 0-2 .894-2 1.992v12.016C2 17.106 2.897 18 4 18h3v4l6.351-4H20c1.103 0 2-.894 2-1.992V3.992A1.998 1.998 0 0 0 20 2z"/>
            </svg>
          <hr style={{border: `1px solid ${themeFontColor}`}}/>
          <svg 
            className='credits-icon'
            onClick={() => setCreditsOpen(!creditsOpen)}
            xmlns="http://www.w3.org/2000/svg" 
            fill={themeFontColor} 
            width={25} 
            height={25}
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </header>

      <section className='main-content'>
          <div 
            className={gameOver ? 'game-over-container' : 'game-over-hide'}
            style={{ backgroundColor: themeSecondary}}
          >
            <div className='game-over-content'>
              <div className='game-over-header'>
                <img src={luiska} alt="" width={250} style={{ marginTop: '2rem'}}/>
              </div>

              <div className='game-over-stats'>
                <p>Aikaa kului: {maxTime - timeLeft} sekuntia</p>
                <p>WPM: {wpm - mistakes / 2}</p>
                <p>Virheet: {mistakes}</p>
                <p>Tarkkuus: ≈ {accuracy}%</p>
              </div>
            </div>

            <div className='game-over-button-container'>
              <button 
                onClick={generateWords}
                style={{ backgroundColor: themeBackground, color: themeFontColor }}
              >Kokeile uudelleen</button>
            </div>

          </div>
          <div className='word-container'>
            <div className={isRunning === false ? 'typer-info-hide' : 'typer-info'}>
              <p>{timeLeft}</p>
              <svg
                onClick={resetgame}
                className='reset-icon' 
                width={20}
                height={20}
                viewBox="0 0 16 16" 
                xmlns="http://www.w3.org/2000/svg" 
                fill={themeFontColor}>
                  <path d="M7.248 1.307A.75.75 0 118.252.193l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 01-1.004-1.114l1.29-1.161a4.5 4.5 0 103.655 2.832.75.75 0 111.398-.546A6 6 0 118.018 2l-.77-.693z"/></svg>
              <p className='enter-info'>tai paina enter</p>
            </div>
            <input type="text" ref={inputRef} onKeyDown={handleKeyDown}/>
              {
                words?.split("").map((char, index) => (
                  <span
                    onClick={() => inputRef.current.focus()} 
                    ref={(e) => charRefs.current[index] = e}
                    className={`char ${index === charIndex ? 'active' : ''} ${correctWrong[index]}`}
                    style={{ color: correctWrong[index] === 'correct' ? themeSecondaryFontColor : correctWrong[index] === 'wrong' ? 'red' : themeFontColor}}
                  >{char}</span>
                ))
              }
              <p style={{ color: themeFontColor, fontStyle: 'italic', fontSize: '1rem', marginTop: '1rem'}}>-{author}</p>
          </div>

          <div className={isRunning === false ? 'functions-container' : 'functions-container-hide'} style={{ backgroundColor: themeSecondary}}>
            <div className='settings' onClick={generateWords}>
            <svg
              fill={themeFontColor}
              width={25} 
              height={25}
              viewBox="0 0 32 32" 
              version="1.1" 
              xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 29.5c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM21.938 15.938c0-0.552-0.448-1-1-1h-4v-4c0-0.552-0.447-1-1-1h-1c-0.553 0-1 0.448-1 1v4h-4c-0.553 0-1 0.448-1 1v1c0 0.553 0.447 1 1 1h4v4c0 0.553 0.447 1 1 1h1c0.553 0 1-0.447 1-1v-4h4c0.552 0 1-0.447 1-1v-1z"></path>
              </svg>
              <p>Uusi quote</p>
            </div>
          </div>
      </section>

      <footer>
        <div className='footer-icons'>
          <svg onClick={() => setPrivacyOpen(!privacyOpen)} className='privacy-icon' fill={themeFontColor} width={25} height={25} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"><path d="M17,9V7c0-2.8-2.2-5-5-5S7,4.2,7,7v2c-1.7,0-3,1.3-3,3v7c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3v-7C20,10.3,18.7,9,17,9z M9,7c0-1.7,1.3-3,3-3s3,1.3,3,3v2H9V7z"/></svg>
        </div>
        <div className='version'>
          <svg 
            width={20} 
            height={20} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" 
            fill={themeFontColor}
          >
              <path d="M13.273 7.73a2.51 2.51 0 0 0-3.159-.31 2.5 2.5 0 0 0-.921 1.12 2.23 2.23 0 0 0-.13.44 4.52 4.52 0 0 1-4-4 2.23 2.23 0 0 0 .44-.13 2.5 2.5 0 0 0 1.54-2.31 2.45 2.45 0 0 0-.19-1A2.48 2.48 0 0 0 5.503.19a2.45 2.45 0 0 0-1-.19 2.5 2.5 0 0 0-2.31 1.54 2.52 2.52 0 0 0 .54 2.73c.35.343.79.579 1.27.68v5.1a2.411 2.411 0 0 0-.89.37 2.5 2.5 0 1 0 3.47 3.468 2.5 2.5 0 0 0 .42-1.387 2.45 2.45 0 0 0-.19-1 2.48 2.48 0 0 0-1.81-1.49v-2.4a5.52 5.52 0 0 0 2 1.73 5.65 5.65 0 0 0 2.09.6 2.5 2.5 0 0 0 4.95-.49 2.51 2.51 0 0 0-.77-1.72zm-8.2 3.38c.276.117.512.312.68.56a1.5 1.5 0 0 1-2.08 2.08 1.55 1.55 0 0 1-.56-.68 1.49 1.49 0 0 1-.08-.86 1.49 1.49 0 0 1 1.18-1.18 1.49 1.49 0 0 1 .86.08zM4.503 4a1.5 1.5 0 0 1-1.39-.93 1.49 1.49 0 0 1-.08-.86 1.49 1.49 0 0 1 1.18-1.18 1.49 1.49 0 0 1 .86.08A1.5 1.5 0 0 1 4.503 4zm8.06 6.56a1.5 1.5 0 0 1-2.45-.49 1.49 1.49 0 0 1-.08-.86 1.49 1.49 0 0 1 1.18-1.18 1.49 1.49 0 0 1 .86.08 1.499 1.499 0 0 1 .49 2.45z"/>
          </svg>
          <p>ver 1.0</p>
        </div>
      </footer>

      <div className='mobile-message'>
        <p>Joo tää ei toimi puhelimella... Kokeile koneella!</p>
        <img src={hanninen} alt="" width={200}/>
      </div>
      <Analytics/>
    </main>
  )
}

export default App
