let installPrompt = null;
const installButton = document.getElementById('butInstall');
installButton.addEventListener('click', installPWA);

window.addEventListener('beforeinstallprompt', promptEvent);

function promptEvent(evt) {
  installPrompt = evt;
  installButton.removeAttribute('hidden');
}

function installPWA(evt) {
  // Aparecer instalação
  installPrompt.prompt();
  // Fecha o botão de instalação
  evt.srcElement.setAttribute('hidden', true);

  // // Log user response to prompt.
  // installPrompt.userChoice
  //   .then((choice) => {
  //     if (choice.outcome === 'accepted') {
  //       console.log('User accepted the A2HS prompt', choice);
  //     } else {
  //       console.log('User dismissed the A2HS prompt', choice);
  //     }
  //     installPrompt = null;
  //   });

}

// Evento de instalação
window.addEventListener('appinstalled', logInstalação);

function logInstalação(evt) {
  console.log('Clima PWA instalada com sucesso!', evt);
}
