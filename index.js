import { menuArray } from './data.js'
const cartSec = document.getElementById("cart-sec")
const paymentSec = document.getElementById("payment-sec")
const paymentForm = document.getElementById("payment-form")
const cartArray = [];

//event listeners

document.addEventListener('click', function(e){
    if(e.target.dataset.addItem){
        addToCart(e.target.dataset.addItem)
    }
    else if (e.target.dataset.removeItem){
        removeFromCart(e.target.dataset.removeItem)
    }
    else if (e.target.id === "purchase-btn"){
        renderModal()
    }else if (
        !(e.target === paymentSec) &&
        !(e.target == document.querySelector(".payment-modal")) &&
        !isDescendant(paymentSec, e.target)
      ) {
        closeModal()
      }
    })

    paymentForm.addEventListener("submit", function(e){
        e.preventDefault()
        closeModal();
        cartSec.classList.add("hidden")
        renderStatus()
    })

//<--------FUNCTIONS ---->

//Render menu on browser

function renderMenuHtml(){
    let menuHtml = ``
    menuArray.forEach(function(item){
        menuHtml += `
        <div class="item">
        <div class="item-details">
        <div class="item-graphic">${item.emoji}</div>
        <div>
            <h2 class="item-title">${item.name}</h2>
            <p class="item-desc">${item.ingredients}</p>
            <h3 class="item-price">$ ${item.price}</h3>
        </div>
    </div>
        <button class="add-btn" data-add-item="${item.id}">+</button>
    </div>
        `
    })
    document.getElementById("menu").innerHTML = menuHtml
}
renderMenuHtml()

//add items to cart

function addToCart(itemId) {
    //check if exist in array
    const existItem = cartArray.find((item) => item.id == itemId)
    if(existItem){
        existItem.quantity++
    }
    else {
        const newItem = menuArray.find((item) => item.id == itemId)
        if (newItem){
            cartArray.push ({
                name:newItem.name,
                ingredients: newItem.ingredients,
                id: newItem.id,
                price:newItem.price,
                emoji:newItem.emoji,
                quantity: 1,
            })
        }
    }
    renderCartHtml(cartArray)
    cartSec.classList.remove("hidden")
    document.querySelector(".cart-total").innerHTML = `
    ${getTotalPrice(cartArray)}`
}
//remove items from cart
function removeFromCart(itemId){
    const existingItemIndex = cartArray.findIndex(function(item){
        return itemId === item.id
    })
    if(existingItemIndex !== -1) {
        const existingItem = cartArray[existingItemIndex]
        existingItem.quantity--
    
    if (existingItem.quantity === 0) {
        cartArray.splice(existingItemIndex,1)
    }
}
    renderCartHtml(cartArray);
    if (cartArray.length < 1) {
        cartSec.classList.add("hidden")
}
    document.querySelector(".cart-total").innerHTML = `$ ${getTotalPrice(cartArray)}`
}

//total price 

function getTotalPrice(cart) {
    let totalPrice = 0
    let drink = cart.find((item) => item.id == 2)

    cart.forEach(function(item){
        totalPrice += item.price * item.quantity
    })
    return totalPrice
}

function renderModal() {
    paymentSec.style.display = "flex"
}
function isDescendant(parent,child) {
    let node = child.parentNode
    while (node !=null) {
        if(node === parent){
            return true
        }
        node = node.parentNode;
    }
    return false
}

function closeModal(){
    paymentSec.style.display = "none"
}

// completed order
function renderStatus() {
    const orderCompleteSection = document.getElementById("order-complete-sec")
    const paymentFormData = new FormData(paymentForm)
    const customerName = paymentFormData.get("fullName")

    cartArray.length = 0
    orderCompleteSection.innerHTML =  `          
    <div class="order-status">
      <p class="order-text">Thanks, ${customerName}! Your order is on its way!</p>
     
    </div>`
}

// render cart
function renderCartHtml(cart) {
    let cartHtml =``
    cart.forEach(function(item){
        cartHtml += `
        <div class="cart-item-wrapper">
            <div class="cart-item-detail">
                <h2 class="cart-item-name">${item.name}</h2>
                <p>X ${item.quantity}</p>
                <p class="cart-remove-btn" data-remove-item="${item.id}">
                remove
            </p>
            </div>
                <h3>$ ${item.price * item.quantity}</h3>
            </div>
        </div>
        `
    })
    document.querySelector(".cart").innerHTML = cartHtml
}
