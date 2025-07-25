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

  function checkSelections() {
    const categories = document.querySelectorAll('.category');
    for (let cat of categories) {
      const selected = cat.querySelector('input[type="radio"]:checked');
      if (!selected) return false;
    }
    return true;
  }

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

  document.querySelectorAll('.video-label').forEach(label => {
    const video = label.querySelector('video');
    const input = label.querySelector('input[type="radio"]');

    if (video && input) {
      video.addEventListener('click', e => {
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change'));
        }
        // El video sigue su funcionamiento natural (play/pause)
      });
    }

    label.addEventListener('click', e => {
      if (e.target !== video) {
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change'));
        }
      }
    });
  });

  voteButton.addEventListener('click', () => {
    const votes = {};
    document.querySelectorAll('.category').forEach(cat => {
      const name = cat.querySelector('input[type="radio"]').name;
      const selected = cat.querySelector('input[type="radio"]:checked');
      if (selected) votes[name] = selected.value;
    });
    alert("Gracias por votar! Tus votos:\n" + JSON.stringify(votes, null, 2));
  });
});
