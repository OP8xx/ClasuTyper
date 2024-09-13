// Importing styles
import './App.css'

// Importing hooks and libraries
import { useState, useEffect, useRef } from 'react'
import { generate } from "random-words";
import { themes } from './themes/themes';
import { quotes } from './quotes/quotes';

// Importing images 
import clasuLogo from './assets/clasulogo.svg'
import luiska from './assets/luiska.svg'

function App() {

  // Color theme states
  const [themeBackground, setThemeBackground] = useState(themes[0].background)
  const [themeSecondary, setThemeSecondary] = useState(themes[0].secondary)
  const [themeFontColor, setThemeFontColor] = useState(themes[0].fontColor)
  const [themeSecondaryFontColor, setThemeSecondaryFontColor] = useState(themes[0].secondaryFontColor)
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false)

  // Info container states
  const [infoContainerOpen, setInfoContainerOpen] = useState(false)
  const [creditsOpen, setCreditsOpen] = useState(false)

  // Game states
  const [maxTime, setMaxTime] = useState(60)
  const [wordAmount, setWordAmount] = useState(10)
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

  const randomIndexGenerate = () => {
    setRandomIndex(Math.floor(Math.random() * quotes.length))
    console.log(randomIndex)
  }

  useEffect(() => {
    randomIndexGenerate()
    inputRef.current.focus()
    setWordAmount(10)
    setWords(quotes[randomIndex].quote)
    setAuthor(quotes[randomIndex].author)
    setCorrectWrong(Array(charRefs.current.length).fill(''))
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
      setWpm(0); // or some other default value
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

        let accuracy = (100 - (mistakes / (charIndex - mistakes)) * 100).toFixed(1);
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
    } else {
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

  const generateWords = () => {
    randomIndexGenerate()
    const quote = quotes[randomIndex]
    if (quote && quote.quote && quote.quote !== '-') {
      setWords(quote.quote)
      setAuthor(quote.author)
      // ...
    } else {
      // Handle the case where the quote is empty or invalid
      console.error('Invalid quote generated');
      // You can also try generating a new quote here...
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
  }

  return (
    <main style={{ backgroundColor: themeBackground, color: themeFontColor  }}>

      <div className={themeSelectorOpen ? 'theme-selector' : 'theme-selector-closed'} style={{ backgroundColor: themeSecondary}}>
        <svg
          onClick={() => setThemeSelectorOpen(!themeSelectorOpen)}
          className='return-arrow-theme'
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

      <div className={infoContainerOpen ? 'info-container' : 'info-container-hide'} style={{ backgroundColor: themeSecondary}}>
          <svg
            onClick={() => setInfoContainerOpen(!infoContainerOpen)}
            className='return-arrow-info'
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
            ClasuTyperissa testaat kirjoitusnopeuttasi Clasun opettajien sanomien lausahdusten avulla! Jokainen lausahdus on otettu koulun clarus-lehdestä.
            <hr style={{border: `1px solid ${themeFontColor}`}}/>
            Kyseessä on henkilökohtainen koodausprojekti, eikä sen tarkoituksena ole aiheuttaa pahaa mieltä kenellekkään &lt;3
          </p>
      </div>

      <div className={creditsOpen ? 'credits-open' : 'credits-hide'} style={{ backgroundColor: themeSecondary}}>
        <svg
          onClick={() => setCreditsOpen(!creditsOpen)}
          className='return-arrow-credits'
          fill={themeFontColor}
          style={{ cursor: 'pointer'}}
          width={20} height={20}
          viewBox="0 0 15 15" 
          xmlns="http://www.w3.org/2000/svg" 
          id="arrow">
          <path d="M8.29289 2.29289C8.68342 1.90237 9.31658 1.90237 9.70711 2.29289L14.2071 6.79289C14.5976 7.18342 14.5976 7.81658 14.2071 8.20711L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L11 8.5H1.5C0.947715 8.5 0.5 8.05228 0.5 7.5C0.5 6.94772 0.947715 6.5 1.5 6.5H11L8.29289 3.70711C7.90237 3.31658 7.90237 2.68342 8.29289 2.29289Z"/>
        </svg>

        <h1>Credits</h1>
        
        <p>Made by: <br></br>O. Simelius clasu 2022</p>
        <hr style={{border: `1px solid ${themeFontColor}`}}/>
        <p>Erityismaininta Clarukselle, joihin on dokumentoitu opettajien lausahduksia</p>
        <hr style={{border: `1px solid ${themeFontColor}`}}/>
        <p>Inspiraationa toiminut: <a style={{color: themeFontColor}} target='_blank' href="https://monkeytype.com">https://monkeytype.com</a></p>
      </div>

      <header className='header'>
        <div className='header-logo'>
          <h1> ClasuTyper.fi </h1>
          <img src={clasuLogo} alt="cow" width={50} style={{ filter: 'invert(1)'}}/>
        </div>
        <div className='header-buttons'>
          <svg
            onClick={() => setThemeSelectorOpen(!themeSelectorOpen)}
            width={20} 
            height={20} 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            aria-hidden="true" role="img" class="iconify iconify--gis" 
            fill={themeFontColor} 
            preserveAspectRatio="xMidYMid meet">
              <path d="M44.55 10.526C18.234 10.526 0 31.58 0 42.106s5.263 18.42 15.79 18.42c10.526 0 15.789 2.632 15.789 10.527c0 10.526 7.895 18.42 18.421 18.42c34.21 0 50-18.42 50-36.841c0-31.58-23.87-42.106-55.45-42.106zm-7.024 10.527a6.58 6.58 0 1 1 0 13.158a6.58 6.58 0 0 1 0-13.158zm21.053 0a6.58 6.58 0 1 1 0 13.158a6.58 6.58 0 0 1 0-13.158zm19.053 10.526a6.579 6.579 0 1 1 0 13.158a6.579 6.579 0 0 1 0-13.158zm-58.527 1.263a6.58 6.58 0 1 1 0 13.158a6.58 6.58 0 0 1 0-13.158zM54 63.158a7.895 7.895 0 0 1 7.895 7.895c0 4.36-5.535 7.894-9.895 7.894a7.895 7.895 0 0 1-7.895-7.894c0-4.36 5.535-7.895 9.895-7.895z"></path>
            </svg>
          <hr style={{border: `1px solid ${themeFontColor}`}}/>
          <svg 
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
          <a href="https://github.com/OP8xx/ClasuTyper" target='_blank'>
            <svg 
              fill={themeFontColor} 
              width={25} height={25} 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg" 
              data-name="Layer 1"
              href='https://github.com/OP8xx/ClasuTyper' target='_blank'
            >
              <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z"/>
            </svg>
          </a>

          <hr style={{border: `1px solid ${themeFontColor}`}}/>
          <svg 
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
                <p>Tarkkuus: {accuracy}%</p>
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
              <button 
                onClick={generateWords}
                style={{ backgroundColor: themeSecondary, color: themeFontColor }}
              >Stop</button>
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

            <div className='save-settings'>
              <p 
                onClick={generateWords} 
                style={{ backgroundColor: themeBackground}}
              >Uusi quote</p>
            </div>
          </div>
      </section>

      <footer>
        <p>Eiks tää ookki hauska :D</p>
      </footer>
    </main>
  )
}

export default App
