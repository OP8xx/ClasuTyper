import { useState, useRef } from 'react';
import styles from './contactform.module.css';
import emailjs from '@emailjs/browser';

export const ContactUs = (props) => {
  const form = useRef();

  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_9vbzbz9', 'template_rfoh16h', form.current, {
        publicKey: 'WSnkIy19uEGbolfeR',
      })
      .then(
        () => {
          setMessage('Viesti lähetetty 🚀');
          e.target.reset();
          setTimeout(() => {
            setMessage('');
          }, 2000);
        },
        (error) => {
          console.log(error.text);
          setMessage('Jotain meni vikaan 😕')
        },
      );
  };

  return (
    <>
    <form style={props.style} ref={form} onSubmit={sendEmail} className={styles.form}>
      <input required type="text" name="user_name" placeholder='Nimesi' style={props.inputStyle}/>
      <input required type="email" name="user_email" placeholder='Sähköpostisi' style={props.inputStyle}/>
      <textarea required name="message" placeholder='Mitä haluat sanoa?' style={props.inputStyle}/>
      <input type="submit" value="Lähetä!" className={styles.button}/>
    </form>
    <p>{message}</p>
    </>
  );
};