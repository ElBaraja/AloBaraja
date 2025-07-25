document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainContent = document.getElementById('main-content');
  const enterButton = document.getElementById('enter-button');
  const forgeSound = document.getElementById('forge-sound');
  const voteButtonContainer = document.getElementById('voteButtonContainer');
  const voteButton = document.getElementById('voteButton');

  // Entry IDs reales del Google Forms (usa los name del HTML como claves)
  const entryIDs = {
    clipDelAno: '1485533663',
    repo: '2064071877',
    mejorClip: '1008162894',
    mejorTiktok: '747262070',
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

  // Validar que todas las categorías tengan selección
  function checkSelections() {
    const categories = document.querySelectorAll('.category');
    for (const cat of categories) {
      if (!cat.querySelector('input[type="radio"]:checked')) return false;
    }
    return true;
  }

  // Mostrar botón votar solo si todas seleccionadas
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

  // Click en video o label activa selección
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

  // Validar antes de enviar
  function validarAntesDeEnviar() {
    for (const name in entryIDs) {
      const seleccionado = document.querySelector(`input[name="${name}"]:checked`);
      if (!seleccionado) {
        alert(`Seleccioná una opción para la categoría "${name}".`);
        return false;
      }
    }
    return true;
  }

  // Enviar votos a Google Forms
  async function enviarGoogleForm(votos) {
    const url = 'https://docs.google.com/forms/d/e/1FAIpQLSccqp2BO_lezekPAcI6jXudkb5QM9ctDLQYAeu3sffUy3Gvcg/formResponse';

    const formData = new FormData();
    for (const key in votos) {
      const entryId = entryIDs[key];
      if (entryId && votos[key]) {
        formData.append(`entry.${entryId}`, votos[key]);
      }
    }

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      alert('✅ ¡Gracias por votar!\nTus votos han sido enviados correctamente.');
      document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
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
    for (const name in entryIDs) {
      const selected = document.querySelector(`input[name="${name}"]:checked`);
      votos[name] = selected ? selected.value : '';
    }

    enviarGoogleForm(votos);
  });
});
