export const confirmationTemplate = (option: {
  name: string;
  email: string;
}) => {
  const { name, email } = option;
  return `<div>
  <h1>¡Hola ${name}!</h1>
<p>Gracias por registrarte en Agrotrack.</p>
<p>Por favor confirma tu cuenta haciendo clic en el enlace:</p>
<a href="https://agrotrack-develop.onrender.com/auth/confirmar/${email}">Confirmar Cuenta</a>
<p>Si no te registraste, ignora este mensaje.</p>
<p>Saludos,<br>El equipo de Agrotrack</p>
  
  </div>`;
};

//en auth confirmacion y recuperacion de contraseña van aca
//crear endpoint GET confirmacion, q reciba parametro email y confirme el usuario
