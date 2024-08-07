export function formatText(text: string) {
  return `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;
}

export function formatPrice(price: number) {
  let _price = price.toLocaleString(undefined);
  return `${_price} ₽`;
}
