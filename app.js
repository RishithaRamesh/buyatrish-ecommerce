// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

//cart
let cart = []
//buttons
let buttonsDOM = []

// getting the products- currently from json, later we'll change
class Products{ 
    //this class has only 1 method. we fetch json and display it neatly on console by mapping
async getProducts(){  
    try{
        //let can  only be redeclared in another block 
        let result = await fetch('products.json'); //what await does is wait till promise is setlled
        let data = await result.json(); //we need the json of result to view in console(inspect page)
        let products = data.items;//data was an array, we store it to products
        products = products.map(item => {
            const {title,price} = item.fields;
            const {id} = item.sys;
            const image = item.fields.image.fields.file.url;
            return {title,price,id,image}
        })
        return products //this one(after mapping) looks neater.
        //return data;//check in console: it used to return an array which was not pretty
    } catch (error) {
        console.log(error);
    }
 }
}
// display products- responsible for getting elements and displaying it
class UI{
    displayProducts(products){
        let result = '';
        products.forEach(product => {
            result +=`
            <article class="product">
              <div class="img-container">
                <img 
                    src=${product.image} 
                    alt="product" 
                    class="product-img"
                    />
                    <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping"></i>
                    add to cart
                    </button>
              </div>
              <h3>${product.title}</h3>
              <h4>$${product.price}</h4>
            </article>
            `;
        });
        //console.log(products);
        productsDOM.innerHTML = result;
    }
    getBagButtons(){ //when we click on add-to-bag in product. it should get added to cart. this function does it
        const buttons = [...document.querySelectorAll('.bag-btn'
        )]; // ...(spread operator) specifies an array not a node-list
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){//this makes sure if the item is already in cart, it will show "in-cart' instead of "add-to-bag"
                button.innerText = "In Cart";
                button.disabled = true;
            }
            
                button.addEventListener('click',(event) => { //everytime we click on add-tocart button it counts.
                    //console.log(event);
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    //now we neet to get clicked item/product from local storage
                    //TO_DO: 1.get product from products
                    let cartItem = {...Storage.getProduct(id),
                        amount : 1 };//amount is needed in cart calculations
                    // we first declare emply array in line 13 and append it here once user has cicked "addtocart"

                    // 2.add product to cart
                    cart = [...cart, cartItem]; //we use spread operator to get all items that we have in cart
                    //console.log(cart); //this will show updated list of cart

                    // 3.save cart in local storage
                    Storage.saveCart(cart); // check inspect->application->local storage

                    // 4.set cart values
                    this.setCartValues(cart);

                    // 5. display cart item i.e addinf item to DOM
                    this.addCartItem(cartItem);

                    // 6.show cart
                    this.showCart();
                });
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount; //total no of items
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(
            2));
        cartItems.innerText = itemsTotal;
    }
    //console.log(cartTotal,cartItems);
    addCartItem(item){
            const div = document.createElement('div');
            div.classList.add('cart-item');
            // we are getting these items dynamically
            //now we cut of html part and paste it here
            // we have an empty div ready in index.html and the retreived values will be reflected there
            div.innerHTML = `
                <img src=${item.image} alt="product" />
                <div>
                <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
                </div>
                <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
                </div>`;
            cartContent.appendChild(div);
            //console.log(cartContent);
    }
    showCart(){
        //we call 2 classes transparantBcg and showCart, so that the cart can 
        //check styles.css line no 194 197
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    setupAPP(){
        cart = Storage.getCart(); //line 163
        //we update cart array here
        this.setCartValues(cart); //line 106        
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click',this.hideCart);
    }
    populateCart(cart){
        //we loop throughcart array and we add every item to line 118 i.e in cart(right side)
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart(){
        //basically, when closes sidebar cart 
        //cartOverlay and cartDom are classes we retrived in line 7
        cartOverlay.classList.remove("transparentBcg");//line 194 in styles.css
        cartDOM.classList.remove("showCart");
    }
    cartLogic(){
        //we clear the cart here i.e clear cart button
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });//check next function
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0])
        }
        //this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        //set cart values
        this.setCartValues(cart);
        Storage.saveCart(cart);
        //we need to reset from Incart to add-to-cart in products
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

//local storage
class Storage{ //this class locally stores products and details
 static saveProducts(products){
     localStorage.setItem("products", JSON.stringify(products)
     );
 }
 static getProduct(id){
     let products = JSON.parse(localStorage.getItem('products'));
     return products.find(product => product.id === id);
 }
 static saveCart(cart) {
     localStorage.setItem('cart',JSON.stringify(cart))
 }
 static getCart(){
     //ternary operator in case the local storage is empty
     //retrieving cart item from local storage
     return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')):[];
 }
}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const products = new Products();
    //setup app
    ui.setupAPP();

    // get all products
    // .then waits for the prev function to get executed first.
    products.getProducts().then(products => {//.then waits for getProducts() to execute
        ui.displayProducts(products);
        Storage.saveProducts(products); //saves products list in storage, check inspect->application->local storage
    }).then(() => { //Here, we wait for the above 2 lines to take place first.
        ui.getBagButtons();
        ui.cartLogic();
    });
});