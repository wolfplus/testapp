export function getPrimaryColor() {
  getComputedStyle(document.body).getPropertyValue('--ion-color-primary');
  const colorHex = getComputedStyle(document.body).getPropertyValue('--ion-color-primary');
  const colorHexToString = colorHex.replace("#", "");
  const color = colorHexToString.substring(1);
  return color;
}
