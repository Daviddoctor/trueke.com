// Creación de una instancia de cliente de Stripe.
const stripe = Stripe("MY_PUBLIC_KEY");

// Creación de una instancia de Elementos.
const elements = stripe.elements();

// Personalización del campo de la tarjeta de crédito/débito.
const style = {
  base: {
    color: "#32325d",
    fontFamily: "Helvetica Neue, Helvetica, sans-serif",
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

// Creación de una instancia de la tarjeta Elemento.
const card = elements.create("card", {style: style});

// Añadir una instancia del elemento tarjeta en el <div> `card-element`.
card.mount("#card-element");

// Tratamiento de los errores de validación en tiempo real de la tarjeta Element.
card.addEventListener("change", function(event) {
  const displayError = document.getElementById("card-errors");
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = "";
  }
});

// Gestión del envío de formularios.
const form = document.getElementById("payment-form");
form.addEventListener("submit", function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Informar al usuario si hubo un error.
      const errorElement = document.getElementById("card-errors");
      errorElement.textContent = result.error.message;
    } else {
      // Enviar el token a mi servidor localhost.
      stripeTokenHandler(result.token);
    }
  });
});

// Enviar el formulario con el ID del token de Stripe obtenido del servidor de Stripe.
function stripeTokenHandler(token) {
  // Inserte el ID del token en el formulario para que se envíe al servidor.
  const form = document.getElementById("payment-form");
  const hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", "stripeToken");
  hiddenInput.setAttribute("value", token.id);
  form.appendChild(hiddenInput);

  // Envíe el formulario
  form.submit();
}