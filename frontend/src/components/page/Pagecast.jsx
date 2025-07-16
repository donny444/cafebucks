import React from 'react';
import { useCart } from '../context/Cart';
import './Pagecast.css';
import Cafe from '../cafehead/Cafe';
import axios from 'axios';

// The component to displays and manipulates menus in the cart
const Pagecast = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getCartTotal, clearCart } = useCart();

  // ฟังก์ชันสั่งการ Buzzer ผ่าน API
  const handlePurchase = async () => {
    try {
      await axios.post("http://localhost:8085/order", { menus: cart, totalPrice: getCartTotal() });
      clearCart(); // ล้างตะกร้าสินค้าหลังจากสั่งซื้อสำเร็จ

      // เรียก API ที่ไปสั่งการ Raspberry Pi
      await axios.get('http://localhost:8085/buzzer/buzzer'); // แก้ URL ให้ตรงกับ API ที่เรียกไฟล์ Python บน Raspberry Pi
      alert('สั่งซื้อสำเร็จและสั่ง Buzzer เรียบร้อยแล้ว!');
    } catch (error) {
      console.error('Error: ', error);
      alert('เกิดข้อผิดพลาดในการสั่ง Buzzer');
    }
  };

  return (
    <div>
      <Cafe />
      <div className="box2">
        <div className="boxcast">
          <h3>My Cart</h3>
          <h3>Manu in cart: {cart.length}</h3>
        </div>
        <div className="cast-items">
          {cart.map((item) => (
            <div className="container p-2 my-3 border" key={item.id}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-shrink-0" style={{ width: "15%" }}>
                <img
                  className="item-image"
                  src={`/src/assets/img/${item.filename}`}
                  alt={item.filename}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div className="flex-grow-1 text-center" style={{ width: "35%" }}>
                <h3 className="item-name m-2" style={{ fontSize: "1.5rem" }}>
                  {item.name}
                </h3>
              </div>
              <div className="d-flex justify-content-center align-items-center" style={{ width: "25%" }}>
                <button
                  className="btn btn-outline-secondary quantity-button"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>
                <p className="item-quantity mx-2 my-0">{item.quantity}</p>
                <button
                  className="btn btn-outline-secondary quantity-button"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
              </div>
              <div className="flex-shrink-0 text-center" style={{ width: "15%" }}>
                <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                  <p className="fs-5">Remove</p>
                </button>
            <div className="cast-item container p-2 my-3 border" key={item.id}>
              <div class="d-flex justify-content gap-5">
              <img className="item-image" src={`/src/assets/img/${item.filename}`} alt={item.filename} style={{ width: "90px", height: "auto" }} />
              <h3 className="item-name m-2" style={{ fontSize: "1.5rem" }}>{item.name}</h3>  
              
              <div className="d-flex gap-3" >                         
              <button className="btn btn-outline-secondary quantity-button" onClick={() => decreaseQuantity(item.id)}>-</button>
              <p className="item-quantity m-0">{item.quantity}</p>
              <button className="btn btn-outline-secondary quantity-button" onClick={() => increaseQuantity(item.id)}>+</button>     
              </div>   
            
              <button class= "btn btn-danger"   onClick={() => removeFromCart(item.id)}><p class="fs-5">Remove</p></button>
              </div>
            </div>
          </div>
          
          ))}
        </div>
        <div className="container p-5  col text-center">
        <p> Total: <b>{getCartTotal()} THB</b></p>
        <button class="btn btn-success rounded-pill" style={{width:'75%'}} onClick={handlePurchase}><u><b>Buy Now</b></u></button> {/* กดปุ่มเพื่อสั่ง buzzer */}
        </div>
      </div>
    </div>
  );
};

export default Pagecast;