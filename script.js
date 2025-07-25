document.addEventListener('DOMContentLoaded', () => {
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

  const voteButtonContainer = document.getElementById('voteButtonContainer');
  const voteButton = document.getElementById('voteButton');

  // Esta función chequea si hay al menos 1 clip seleccionado en todas las categorías
  function checkSelections() {
    const categories = document.querySelectorAll('.category');
    for (let cat of categories) {
      const selected = cat.querySelector('input[type="radio"]:checked');
      if (!selected) {
        return false;
      }
    }
    return true;
  }

  // Al hacer click en un radio, seteamos estilos y actualizamos botón votar
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
        // Mostrar botón votar solo si hay selección en todas las categorías
        if (checkSelections()) {
          voteButtonContainer.style.display = 'block';
        } else {
          voteButtonContainer.style.display = 'none';
        }
      });
    });
  });

  // Acción al votar
  voteButton.addEventListener('click', () => {
    const votes = {};
    document.querySelectorAll('.category').forEach(cat => {
      const name = cat.querySelector('input[type="radio"]').name;
      const selected = cat.querySelector('input[type="radio"]:checked');
      if (selected) votes[name] = selected.value;
    });
    alert("Gracias por votar! Tus votos:\n" + JSON.stringify);
  });
});
