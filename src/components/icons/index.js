export { IconWaterDrop } from './IconWaterDrop';
export { IconFunnel } from './IconFunnel';
export { IconRain } from './IconRain';
export { IconThermometer } from './IconThermometer';
export { IconBattery } from './IconBattery';
export { IconSignal } from './IconSignal';
export { IconMenu } from './IconMenu';
export { IconClose } from './IconClose';
import { registerSW } from 'virtual:pwa-register'
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}




const updateSW = registerSW({
  onNeedRefresh() { /* show a prompt to user */ },
  onOfflineReady() { /* show a ready to work offline message */ },
})


  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
