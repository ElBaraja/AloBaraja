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
      video.addEventListener('click', (e) => {
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    label.addEventListener('click', (e) => {
      if (e.target !== video) {
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
  });

  // --- NUEVO: Enviar votos directo a Google Forms usando fetch POST ---

  // Reemplaza con tu URL pública del Google Forms (sin /viewform)
  const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSccqp2BO_lezekPAcI6jXudkb5QM9ctDLQYAeu3sffUy3Gvcg/formResponse';

  // Mapeo de los nombres de las categorías a sus entry IDs (ejemplo)
  const entryIDs = {
    clipDelAno: '1485533663',
    repo: '2064071877',
    mejorClip: '1008162894',
    mejorTiktok: '747262070',
  };

  voteButton.addEventListener('click', () => {
    // Recopilar votos en formato entry.<id>=valor
    const formData = new URLSearchParams();

    document.querySelectorAll('.category').forEach(cat => {
      // Obtener nombre de la categoría, ej: clipDelAno, repo, mejorClip, mejorTiktok
      const radios = cat.querySelectorAll('input[type="radio"]');
      const name = radios.length > 0 ? radios[0].name : null;

      if (name) {
        const selected = cat.querySelector('input[type="radio"]:checked');
        if (selected) {
          const entryID = entryIDs[name];
          if (entryID) {
            formData.append(`entry.${entryID}`, selected.value);
          }
        }
      }
    });

    // Enviar datos con fetch POST a Google Forms
    fetch(googleFormURL, {
      method: 'POST',
      mode: 'no-cors', // Importante para no tener error CORS
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
    .then(() => {
      alert('✅ ¡Gracias por votar!\nTus votos han sido enviados correctamente.');
      // Opcional: resetear formulario
      document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
      document.querySelectorAll('label.video-label.selected').forEach(label => label.classList.remove('selected'));
      voteButtonContainer.style.display = 'none';
    })
    .catch(() => {
      alert('⚠️ Hubo un error al enviar tu voto. Por favor, intenta de nuevo.');
    });
  });
});
