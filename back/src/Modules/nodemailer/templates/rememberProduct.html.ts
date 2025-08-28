export const rememberHtml = (option: {
  name: string;
  plantationName: string;
  productName: string;
  planned: string;
  recommended_water_per_m2?: string;
}) => {
  const {
    name,
    plantationName,
    productName,
    planned,
    recommended_water_per_m2,
  } = option;
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
    h1 { color: #4CAF50; }
    .footer { font-size: 12px; color: #888; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>¡Hola, ${name}!</h1>
    <p>Este es un recordatorio de un plan de aplicación pendiente para mañana.</p>
    <p>Tienes una tarea programada para tu plantación <strong>${plantationName}</strong>, con fecha de aplicación el <strong>${planned}</strong>.</p>
    <p>
      El producto que debes aplicar es: <strong>${productName}</strong>.
    </p>
     <p>
      Recordatorio de riego, para tu plantacion <strong>${plantationName}</strong>, con esta cantidad de agua por m2: <strong>${recommended_water_per_m2}</strong>.
    </p>
    <p>Por favor, revisa tu aplicación para más detalles.</p>
    <p>Saludos cordiales,<br>El equipo de AgroTrack</p>
  </div>
  <div class="footer">
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
  </div>
</body>
</html>`;
};
