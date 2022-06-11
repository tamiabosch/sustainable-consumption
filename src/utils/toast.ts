export function toast(message: string, duration = 20000) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = duration;
    console.log(toast);
    document.body.appendChild(toast);
    return toast.present();
  }