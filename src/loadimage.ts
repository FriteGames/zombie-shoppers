export default function loadImage(name, path) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ name, img });
    img.src = path;
  });
}
