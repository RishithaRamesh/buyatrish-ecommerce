// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

//cart
let cart = []

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
                    add to bag
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
}
//local storage
class Storage{

}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const products = new Products();

    // get all products
    products.getProducts().then(products =>
    ui.displayProducts(products))
});