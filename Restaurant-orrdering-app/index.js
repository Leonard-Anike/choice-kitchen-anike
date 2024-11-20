// Importation of menuArray from data.js//

import {menuArray} from "/data.js"

// Declaration of varriables//

const displayOrderEl = document.getElementById ("display-order")
const displayItemEl = document.getElementById ("display-item")
const PriceEl = document.getElementById ("total-price-el")
const totalPriceEl = document.getElementById ("total-price")
const paymentFormEl = document.getElementById ("payment-form")
const paymentEl = document.getElementById ("payment")
const messageEl = document.getElementById ("message")
const buyerName = document.getElementById("buyer-name")
const cardNumber = document.getElementById("card-number")
const cvvNumber = document.getElementById("cvv-number")
const payBtn = document.getElementById("pay-btn")
let orderArray = []


// Event listeners//

document.addEventListener("click", (e) => {
    if (e.target.dataset.add){
        handleAddItemClick (e.target.dataset.add)
        getOrderHtml ()
}
else if (e.target.dataset.remove){
    handleRemoveItemClick (e.target.dataset.remove)
}
else if (e.target.id === "complete-order-btn"){
    handleCompleteOrderClick ()
}
else if (e.target.id === "close-payment-form"){
    handleClosePaymentFormClick()
}
// else if (e.target.id === "pay-btn"){
//     handlePayPaymentFormClick()
// }
})


// This display menu-items from menuArray//

const menuHtml = menuArray.map(function(menu) {
    return `
        <section class="menu" id="menu">
            <div class="menu-start">
                <emoji class="menu-item">${menu.emoji}</emoji>
            </div>
            <div class="menu-mid">
                <h2 class="menu-name">${menu.name}</h2>
                <p class="menu-ingredient">${menu.ingredients}</p>
                <p class="menu-price">$${menu.price}</p>
            </div>
            <div class="menu-end" data-add="${menu.id}">
                <p class="menu-add-btn" data-add="${menu.id}">+</p>
            </div>
        </section>
        ` 
}).join(" ")

document.getElementById("menu-container").innerHTML = menuHtml


// Function that displays order made for checkout//

function getOrderHtml(){
    let total = 0
    let orderHtml = `<div class="order-title"><p> Your order </p></div>`
        orderArray.forEach((menu) => {
            const{name, unitPrice, quantity, totalPrice, id} = menu
            orderHtml += `
                <div class="order-lists">
                    <p>
                        <span> ${name}</span>
                        <button class="remove" id="remove" data-remove = "${id}"> remove </button>
                        <span class="quantity"> Qty: ${quantity}</span>
                        <span class="unit-price"> $${totalPrice} </span>
                    </p>
                </div>
            ` 
        total += unitPrice * quantity 
    })
    displayItemEl.innerHTML = orderHtml
    PriceEl.textContent = ` $${total}`
    return orderHtml 
}


// Function that adds order made to cart when plus icon is clicked//

function handleAddItemClick(data) {
    const dataInt = parseInt(data)
    const targetObject = menuArray.filter(function(menu){
        return menu.id === dataInt
    })[0]

    if (!targetObject) return 
        
    const existingItem = orderArray.find((item) => item.name === targetObject.name)
    
    if (!existingItem){
        orderArray.push({ 
            name: targetObject.name, 
            unitPrice: targetObject.price, 
            quantity: 1, 
            totalPrice: targetObject.price, 
            id: targetObject.id })
        orderArray.quantity = 1
        totalPriceEl.style.display = "block"
        displayOrderEl.style.display = "block"
    }
    else {
        existingItem.quantity ++
        existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity
    }
    messageEl.style.display = "none"
    return orderArray
}


// Function that removes order from cart when remove button is clicked//

function handleRemoveItemClick(itemId){

    let existingItem = orderArray.find((item) => item.id == itemId)
    if (existingItem.quantity > 1){
        existingItem.quantity --
        existingItem.totalPrice -= existingItem.unitPrice
    }
    else {
        orderArray = orderArray.filter(item => item.id !=itemId)
    }

    if (orderArray.length < 1){
        displayOrderEl.style.display = "none"
        document.getElementById ("container").style.height = "720px"
    }
    getOrderHtml()
    return orderArray
}


// Complete-order button function//
// It displays the payment form when clicked//

function handleCompleteOrderClick(){
    paymentEl.style.display = "flex"
    paymentFormEl.style.display = "block"
}


// Close-payment-form button//
// It closes the form and resets it//

function handleClosePaymentFormClick() {
    paymentEl.style.display = "none"
    paymentFormEl.reset()
}


// This section validates the input fields//
// and listens to click on pay button only when the inputs are valid// 

const validatePaymentForm = () => {
    payBtn.enabled = !
    (buyerName.checkValidity() && 
    cardNumber.checkValidity() && 
    cvvNumber.checkValidity())
}

buyerName.addEventListener ("input", validatePaymentForm)
cardNumber.addEventListener ("input", validatePaymentForm)
cvvNumber.addEventListener ("input", validatePaymentForm)

payBtn.addEventListener ("click", () => {
    if (!paymentFormEl.checkValidity()) {
        const invalidInput = paymentFormEl.querySelector (":invalid")
        if (invalidInput) {
            invalidInput.focus()
        }
        else {
        console.log ("form submitted")
        }
    }
        setTimeout (function(){
            if(paymentFormEl.checkValidity()){
                document.getElementById ("pay-btn").textContent = "Processing..."
        }
    }, 300)    
})


// This displays message of successful purchase//

paymentFormEl.addEventListener ("submit", function(e){
    e.preventDefault()
    const paymentFormData = new FormData(paymentFormEl)
    const buyerName = paymentFormData.get("buyer-name")

    setTimeout(function() {
        messageEl.innerHTML = `
    <div class="thankyou-text" id="thankyou-text">
        <p id="thankyou-text">
            Thanks, <span class=inputted-buyer-name> ${buyerName}! </span> 
            Your order is on its way!
        </p>
    </div>`
    document.getElementById("container").style.height = "850px" 
    messageEl.style.display = "block"
    displayOrderEl.style.display = "none"
    paymentEl.style.display = "none"
    orderArray = []
    paymentFormEl.reset()
    document.getElementById("pay-btn").innerText = "Pay"
    }, 2000)
})