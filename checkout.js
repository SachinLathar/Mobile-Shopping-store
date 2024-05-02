// Get the cart data from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const cartDataString = urlParams.get('cart');

if (cartDataString) {
  const cartData = JSON.parse(decodeURIComponent(cartDataString));

  // Display cart items in the checkout page
  const checkoutItemsList = document.getElementById('checkout-items-list');
  let totalAmount = 0;
  cartData.items.forEach(item => {
    // Create a list item for each cart item
    const listItem = document.createElement('li');

    // **Image:**
    const itemImage = document.createElement('img');
    itemImage.src = "images/${item.id}.jpeg"; // Assuming the image file name corresponds to the item ID
    itemImage.alt = item.id; // Use item ID as alt text
    listItem.appendChild(itemImage);

    // **Item Name:**
    const itemTitle = document.createElement('div');
    const itemName = document.createElement('h3');
    itemName.textContent = item.title; // Assuming item name is available
    itemDetails.appendChild(itemTitle);
    
    // Create a paragraph for item quantity and price
    const itemInfo = document.createElement('p');
    itemInfo.textContent = `Quantity: ${item.quantity}, Price: $${item.price}`;
    itemDetails.appendChild(itemInfo);

    // Append item details to list item
    listItem.appendChild(itemDetails);

    // Append list item to checkout items list
    checkoutItemsList.appendChild(listItem);

    // Calculate total amount
    totalAmount += item.price * item.quantity;
  });

  // Update total amount display
  const totalAmountSpan = document.getElementById('total-amount');
  totalAmountSpan.textContent = totalAmount.toFixed(2);
} else {
  // Handle scenario where no cart data is present
  console.warn("No cart data found in the URL");
}

// Placeholder for Google Pay integration (replace with actual implementation)
const googlePayButton = document.getElementById('google-pay-button');
googlePayButton.addEventListener('click', () => {
  console.log('Google Pay button clicked! (Replace with actual payment processing)');

  // Implement Google Pay API logic here to handle payments
  // - Request payment authorization
  // - Process payment confirmation
  // - Update order status and enable submit button upon successful payment
});

// Enable submit button only after successful payment (placeholder)
const checkoutForm = document.getElementById('checkout-form');
// (Replace with logic to enable submit button based on Google Pay confirmation)
// checkoutForm.submit.disabled = false;
