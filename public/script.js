document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainContent = document.getElementById('main-content');
  const enterButton = document.getElementById('enter-button');
  const forgeSound = document.getElementById('forge-sound');
  const voteButtonContainer = document.getElementById('voteButtonContainer');
  const voteButton = document.getElementById('voteButton');

  // Mapeo nombres cortos a preguntas Google Forms
  const nameToQuestionText = {
    clipDelAno: "CLIP DEL AÑO",
    repo: "R . E . P . O",
    mejorClip: "MEJOR CLIP",
    mejorTiktok: "MEJOR TIK-TOK"
  };

  // Entry IDs Google Forms para cada pregunta
  const entryIDs = {
    "CLIP DEL AÑO": '1485533663',
    "R . E . P . O": '2064071877',
    "MEJOR CLIP": '1008162894',
    "MEJOR TIK-TOK": '747262070',
  };

  // Inicializar AOS y partículas
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

  // Audio play / fadeout
  forgeSound.volume = 1;
  forgeSound.play().catch(() => {});

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

  // Validación ANTES de enviar para evitar ir a Google Forms con datos incompletos
  function validarAntesDeEnviar() {
    const categorias = Object.keys(nameToQuestionText);
    for (const cat of categorias) {
      if (!document.querySelector(`input[name="${cat}"]:checked`)) {
        alert(`Por favor seleccioná una opción para la categoría "${nameToQuestionText[cat]}".`);
        return false;
      }
    }
    return true;
  }

  // Manejar selección y añadir clase selected
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

  // Enviar formulario a Google Forms con form oculto + fetch para no redirigir
  async function enviarGoogleForm(votos) {
    const url = 'https://docs.google.com/forms/d/e/1FAIpQLSccqp2BO_lezekPAcI6jXudkb5QM9ctDLQYAeu3sffUy3Gvcg/formResponse';

    // Construir datos para enviar
    const formData = new URLSearchParams();
    for (const key in votos) {
      const questionName = nameToQuestionText[key];
      if (!questionName) continue;
      formData.append(`entry.${entryIDs[questionName]}`, votos[key]);
    }

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      alert('✅ ¡Gracias por votar!\nTus votos han sido enviados correctamente.');

      // Resetear selección y ocultar botón votar
      document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
      document.querySelectorAll('label.video-label.selected').forEach(label => label.classList.remove('selected'));
      voteButtonContainer.style.display = 'none';

    } catch (error) {
      alert('❌ Hubo un error al enviar tu voto. Por favor, intentá de nuevo.');
      console.error('Error al enviar votos a Google Forms:', error);
    }
  }

  voteButton.addEventListener('click', () => {
    if (!validarAntesDeEnviar()) return;

    const votos = {};
    const categorias = Object.keys(nameToQuestionText);

    categorias.forEach(catName => {
      const selected = document.querySelector(`input[name="${catName}"]:checked`);
      votos[catName] = selected ? selected.value : '';
    });

    enviarGoogleForm(votos);
  });
});
