export function getSecondaryColor() {
  getComputedStyle(document.body).getPropertyValue('--ion-color-secondary');
  const colorHex = getComputedStyle(document.body).getPropertyValue('--ion-color-secondary');
  const colorHexToString = colorHex.replace("#", "");
  const color = colorHexToString.substring(1);
  return color;
}
