const fs = require('fs');
// New Order Email Message
const newOrderEmailContent = (user, order) => {
  const imagePath = `./images/${
    order.product.image.startsWith('popular') ? 'popular' : 'menu'
  }/${order.product?.image}`;

  const image = fs.readFileSync(imagePath);
  const imageBase64 = image.toString('base64');
  return `
  <div>
    <h2>Dear <span style="color:#ffcc00;">${user.firstName}</span></h2>
    <h3 style="padding-block: 2px;">You have a new order from ${user.firstName} ${user.lastName}</h3>
    <p style="padding-block: 3px;">Name: <span style="color: rgb(230, 0, 0);">${order.product.name}</span></p>
    <p style="padding-block: 3px;">Quantity: <span style="color: rgb(76, 175, 80);">${order.product.quantity}</span></p>
    <p style="padding-block: 3px;">Price: <span style="color: rgb(255, 204, 0);">${order.product.price}</span></p>
    <img src="data:image/WebP;base64,${imageBase64}" alt="Product Image" style="padding-block: 5px; width: 80px; height: 80px;"/>
  </div>
  `;
};

// New Reservation Table Successful
const newReservationEmailContent = (user, table) => {
  const imagePath = `./images/reserve-tables/${table.image}`;

  const image = fs.readFileSync(imagePath);
  const imageBase64 = image.toString('base64');
  return `
    <div>
      <h2>Dear <span style="color:#ffcc00;">${user.firstName}</span> You reserve A New Table In Our Restaurant</h2>
      <h3 style="padding-block: 2px;">Your reservation for table ${table.name} has been confirmed</h3>
      <img src="data:image/WebP;base64,${imageBase64}" alt="Product Image" style="padding-block: 5px; width: 100px; height: 100px;"/>
      <p>Please arrive at the restaurant 15 minutes before your reservation time to enjoy your meal</p>
    </div>
    `;
};

module.exports = {
  newOrderEmailContent,
  newReservationEmailContent,
};
