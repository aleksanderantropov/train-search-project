import { NextResponse } from 'next/server';
import mockData from './mock.json';

export async function GET() {
  // Transform minPrice.forward format
  const transformedData = JSON.parse(
    JSON.stringify(mockData)
  ) as typeof mockData;

  if (transformedData.minPrice?.forward) {
    const forward = transformedData.minPrice.forward;
    const amount = parseFloat(forward.Amount);
    const precision = forward.Precision || 0;
    const value = amount / Math.pow(10, precision);

    // Convert currency from "C_RUB" to "RUB" (remove "C_" prefix)
    const currency = forward.Currency?.replace(/^C_/, '') || 'RUB';

    // Transform to new format
    (transformedData.minPrice.forward as any) = {
      value,
      currency,
    };
  }

  return NextResponse.json(transformedData);
}
