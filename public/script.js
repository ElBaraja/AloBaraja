document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainContent = document.getElementById('main-content');
  const enterButton = document.getElementById('enter-button');
  const forgeSound = document.getElementById('forge-sound');
  const voteButtonContainer = document.getElementById('voteButtonContainer');
  const voteButton = document.getElementById('voteButton');

  // Mapeo nombres cortos de los inputs en HTML a nombres exactos de preguntas en Google Forms
  const nameToQuestionText = {
    clipDelAno: "CLIP DEL AÑO",
    repo: "R . E . P . O",
    mejorClip: "MEJOR CLIP",
    mejorTiktok: "MEJOR TIK-TOK"
  };

  // Entry IDs en Google Forms para cada pregunta (nombre exacto)
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

  // Enviar formulario a Google Forms con form oculto + submit tradicional
  function enviarGoogleForm(votos) {
    const url = 'https://docs.google.com/forms/d/e/1FAIpQLSccqp2BO_lezekPAcI6jXudkb5QM9ctDLQYAeu3sffUy3Gvcg/formResponse';

    const form = document.createElement('form');
    form.style.display = 'none';
    form.method = 'POST';
    form.action = url;
    form.target = '_blank';

    for (const key in votos) {
      const questionName = nameToQuestionText[key];
      if (!questionName) continue;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `entry.${entryIDs[questionName]}`;
      input.value = votos[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  voteButton.addEventListener('click', () => {
    const votos = {};
    const categorias = Object.keys(nameToQuestionText);

    categorias.forEach(catName => {
      const selected = document.querySelector(`input[name="${catName}"]:checked`);
      votos[catName] = selected ? selected.value : '';
    });

    enviarGoogleForm(votos);

    alert('✅ ¡Gracias por votar!\nTus votos han sido enviados correctamente.');

    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('label.video-label.selected').forEach(label => label.classList.remove('selected'));
    voteButtonContainer.style.display = 'none';
  });
});
