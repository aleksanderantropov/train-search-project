// Price and currency utilities

export const findMinPrice = (tariffs: { classes: { [key: string]: any } }) => {
  let minPrice = Infinity;
  let minCurrency = '';

  Object.values(tariffs.classes).forEach((tariffClass: any) => {
    if (tariffClass.price && tariffClass.price.value < minPrice) {
      minPrice = tariffClass.price.value;
      minCurrency = tariffClass.price.currency;
    }
  });

  return minPrice !== Infinity
    ? { value: minPrice, currency: minCurrency }
    : null;
};

export const formatPrice = (price: { value: number; currency: string }): string => {
  const formattedValue = price.value.toLocaleString();
  const currencySymbol = price.currency === 'RUB' ? '₽' : price.currency;
  return `${formattedValue} ${currencySymbol}`;
};

