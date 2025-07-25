function enviarVotos() {
  if (Object.keys(votos).length === 0) {
    alert("Por favor, seleccioná al menos un clip antes de votar.");
    return;
  }

  const URL_WEBAPP = "https://script.google.com/macros/s/AKfycbyBXRx3biHEz7RBPzvZjueDw3kNG8NbhzCt9hvEY5rJLYwKVVBIn4ypSgSAsmiHqkzw/exec";

  fetch(URL_WEBAPP, {
    method: "POST",
    body: JSON.stringify(votos),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Error al enviar votos");
    }
    return response.text();
  })
  .then(data => {
    alert("¡Gracias por votar! Tus votos fueron registrados correctamente.");
    console.log("Respuesta del servidor:", data);
  })
  .catch(error => {
    alert("Hubo un problema al enviar los votos. Intentalo más tarde.");
    console.error(error);
  });
}
