import { PaymentElement } from "@stripe/react-stripe-js";
// https://docs.stripe.com/sdks/stripejs-react

const CheckoutForm = function () {
  return (
    <form>
      <PaymentElement />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CheckoutForm;
