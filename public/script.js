document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainContent = document.getElementById('main-content');
  const enterButton = document.getElementById('enter-button');
  const forgeSound = document.getElementById('forge-sound');
  const voteButtonContainer = document.getElementById('voteButtonContainer');
  const voteButton = document.getElementById('voteButton');

  // Inicializar AOS y partículas al cargar la página
  AOS.init();

  particlesJS("particles-js", {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: "#ecc94b" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ecc94b",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        out_mode: "out"
      }
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" }
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 1 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });

  // Intentar reproducir audio al cargar (puede bloquearse)
  forgeSound.volume = 1;
  forgeSound.play().catch(() => {
    // No hace nada hasta click usuario
  });

  // Función para hacer fade out del audio
  function fadeOutAudio(audio, duration = 1000) {
    let volume = audio.volume;
    const interval = 50;
    const step = volume / (duration / interval);
    const fadeAudio = setInterval(() => {
      volume -= step;
      if (volume <= 0) {
        audio.pause();
        audio.volume = 1;
        clearInterval(fadeAudio);
      } else {
        audio.volume = volume;
      }
    }, interval);
  }

  // Mostrar contenido y ocultar bienvenida al click en botón
  enterButton.addEventListener('click', () => {
    forgeSound.play().catch(() => {});

    fadeOutAudio(forgeSound, 1000);

    setTimeout(() => {
      welcomeScreen.style.display = 'none';
      mainContent.style.display = 'block';
    }, 1000);
  });

  // Validar que todas las categorías tengan selección para mostrar botón votar
  function checkSelections() {
    const categories = document.querySelectorAll('.category');
    for (const cat of categories) {
      if (!cat.querySelector('input[type="radio"]:checked')) return false;
    }
    return true;
  }

  // Manejar selección y añadir clase selected a labels
  document.querySelectorAll('.video-container').forEach(container => {
    const radios = container.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        container.querySelectorAll('label.video-label').forEach(label => {
          label.classList.remove('selected');
        });
        if (radio.checked) {
          radio.closest('label.video-label').classList.add('selected');
        }
        voteButtonContainer.style.display = checkSelections() ? 'block' : 'none';
      });
    });
  });

  // Permitir seleccionar radio con click en video o label
  document.querySelectorAll('.video-label').forEach(label => {
    const video = label.querySelector('video');
    const input = label.querySelector('input[type="radio"]');

    if (video && input) {
      video.addEventListener('click', () => {
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change'));
        }
      });
    }

    label.addEventListener('click', (e) => {
      if (e.target !== video) {
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change'));
        }
      }
    });
  });

  // Enviar votos a Google Apps Script con POST JSON
  voteButton.addEventListener('click', () => {
    const votes = {};
    document.querySelectorAll('.category').forEach(cat => {
      const name = cat.querySelector('input[type="radio"]').name;
      const selected = cat.querySelector('input[type="radio"]:checked');
      if (selected) votes[name] = selected.value;
    });

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyBXRx3biHEz7RBPzvZjueDw3kNG8NbhzCt9hvEY5rJLYwKVVBIn4ypSgSAsmiHqkzw/exec';

    fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify(votes),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (!res.ok) throw new Error("Respuesta no OK");
        return res.json();
      })
      .then(data => {
        if (data.result === 'success') {
          alert("✅ ¡Gracias por votar!\nTus votos:\n" + JSON.stringify(votes, null, 2));
        } else {
          alert("⚠️ Hubo un problema guardando el voto:\n" + (data.message || ''));
        }
      })
      .catch(err => {
        console.error('❌ Error al enviar el voto:', err);
        alert("⚠️ Hubo un error al guardar tu voto.");
      });
  });

});
