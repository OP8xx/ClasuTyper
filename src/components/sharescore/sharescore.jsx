import style from './sharescore.module.css'
import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';

const ShareScore = (props) => {
    const form = useRef();
    const [message, setMessage] = useState('');

    const sendEmail = (e) => {
      e.preventDefault();

      emailjs
        .sendForm('service_us648iu', 'template_uxqlpn3', form.current, {
          publicKey: 'WWHSaqlF9dLpOobmV',
        })
        .then(
          () => {
            console.log('SUCCESS!');
            setMessage('Tulos jaettu! 🚀');
            e.target.reset();
            setTimeout(() => {
              setMessage('');
            }, 2000);
          },
          (error) => {
            console.log('FAILED...', error.text);
            setMessage('Jotain meni vikaan 😕')
          },
        );
    };

    return (
      <form ref={form} onSubmit={sendEmail}>
        <label>Pelinimesi:</label>
        <input type="text" name="user_name" style={props.style}/>
        <label>Tuloksesi WPM</label>
        <input name="message" type="number" style={props.style2}/>
        <input type="submit" className={style.shareButton} style={props.style3}/>
        <p>{message}</p>
      </form>
    );
}

export default ShareScore