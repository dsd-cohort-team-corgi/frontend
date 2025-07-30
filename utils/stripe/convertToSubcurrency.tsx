// Payment processing systems like Stripe often require amounts to be specified in the smallest currency unit (subunits) rather than the main currency unit. For example, for USD, the subunit is cents. Therefore, $49.99 should be represented as 4999 cents.

function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

export default convertToSubcurrency;
