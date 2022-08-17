const images = document.querySelectorAll('.image');
const current = document.querySelector('.current-image');
const cartContainer = document.querySelector('.cart-container');
const cart = document.querySelector('.cart');
const buttons = document.querySelector('.buttons');
const unitsValue = document.querySelector('.units-value');
const cartBody = document.querySelector('.cart-body');
const productName = document.getElementById('name-of-product');
const productPrice = document.getElementById('price-of-product');
const cartUnits = document.querySelector('.cart-units');
const lightbox = document.getElementById('lightbox');
const imagesContainer = document.querySelector('.images'); 
const smallScreen = window.matchMedia("(max-width: 700px)");
const navbar = document.querySelector('.navbar');
const menu = document.querySelector('.menu');
const smallscreenNavbar = document.querySelector('.smallscreen-navbar');

editMenu(smallScreen);
smallScreen.addEventListener('change', editMenu);

function editMenu(event){
    if (event.matches) { 
        navbar.classList.add('hide');
        menu.classList.remove('hide');  
    } 
    else {
        navbar.classList.remove('hide');
        menu.classList.add('hide');
        smallscreenNavbar.classList.add('hide');
    }
    return function cleanup(){
        smallScreen.removeEventListener('change', editMenu);
    }
}

menu.addEventListener('click', () => {
    smallscreenNavbar.classList.toggle('hide');
});

lightbox.addEventListener('click', () => {
    const divOverlay = document.createElement('div');
    divOverlay.classList.add('body-overlay');
    const divProductImages = document.createElement('div');
    divProductImages.classList.add('product-images');
    divOverlay.appendChild(divProductImages);

    const divCurrentImage = document.createElement('div');
    divCurrentImage.classList.add('current-image');

    images.forEach( image => { //get value for current image
        if(image.classList.contains('active')){
            const classList = image.classList;
            divCurrentImage.style.backgroundImage = `url('images/image-product-${classList[1]}.jpg')`;
        } 
    })
    divCurrentImage.innerHTML = `        
    <div class="button-container">
    <button class="close-button">
      <div class="line line1"></div>
      <div class="line line2"></div>
    </button>
    </div>
    <button class="previous btn">
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M11 1 3 9l8 8" stroke="#1D2026" stroke-width="3" fill="none" fill-rule="evenodd"/></svg>
    </button>
    <button class="next btn">
        <svg width="13" height="18" xmlns="http://www.w3.org/2000/svg"><path d="m2 1 8 8-8 8" stroke="#1D2026" stroke-width="3" fill="none" fill-rule="evenodd"/></svg>
    </button> `;

    divProductImages.appendChild(divCurrentImage);
    const divImages = document.createElement('div');
    divImages.classList.add('images');
    divImages.setAttribute('id', 'lightbox-images');
    divImages.innerHTML = imagesContainer.innerHTML;
    divProductImages.appendChild(divImages);
    document.body.appendChild(divOverlay);

    const lightBoxImages = document.getElementById('lightbox-images').querySelectorAll('.image');
    imageListener(lightBoxImages, divCurrentImage, true);

    const closeButton = document.querySelector('.close-button'); 
    closeButton.addEventListener('click', () => {
        divOverlay.remove();
    })
    
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.previous');

    nextButton.addEventListener('click', () => {
        for(i = 0; i < lightBoxImages.length; i++) {
            const classList = lightBoxImages[i].classList;
            if(classList.contains('active') && +(classList[1]) !== lightBoxImages.length){ 
                executeLightBoxButton(lightBoxImages[i], true);
                break; 
            }
        }
    })
    prevButton.addEventListener('click', () => {
        for(i = 0; i < lightBoxImages.length; i++) {
            const classList = lightBoxImages[i].classList;
            if(classList.contains('active') && +(classList[1]) !== 1){ 
                executeLightBoxButton(lightBoxImages[i]);
                break; 
            }
        }
    })

    function executeLightBoxButton(image, isNextButton){
        removeOverlay(lightBoxImages, true);
        const div = document.createElement('div');
        div.classList.add('overlay');

        if(isNextButton){
            image.nextElementSibling.appendChild(div);
            image.nextElementSibling.classList.add('active');
            divCurrentImage.style.backgroundImage = `url('images/image-product-${image.nextElementSibling.classList[1]}.jpg')`;
        }
        else{
            image.previousElementSibling.appendChild(div);
            image.previousElementSibling.classList.add('active');
            divCurrentImage.style.backgroundImage = `url('images/image-product-${image.previousElementSibling.classList[1]}.jpg')`;
        }
    }
})

const imageListener = (images, current, isLightBox) => {
    images.forEach( image => { image.addEventListener('click', () => {

        removeOverlay(images, isLightBox);
        const div = document.createElement('div');
        div.classList.add('overlay');
        image.appendChild(div);
        image.classList.add('active');
        
        const classList = image.classList;
        current.style.backgroundImage = `url('images/image-product-${classList[1]}.jpg')`;
        //change correct current
    }) })
}

imageListener(images, current); 

cartContainer.addEventListener('click', () => {
  cart.classList.toggle('hide');
})

buttons.addEventListener('click', () => {
    if(event.target.classList.contains('plus')){
        unitsValue.innerText = `${+(unitsValue.innerText) + 1}`;
    }
    else if(event.target.classList.contains('minus')){
        if(+(unitsValue.innerText) == 0){
            unitsValue.innerText = 0;
        }
        else{
            unitsValue.innerText = `${+(unitsValue.innerText) - 1}`;
        }
    }
    else if(event.target.classList.contains('add-to-cart')){
        console.log('add to cart');
        if(+(unitsValue.innerText) == 0){
            const message = document.createElement('div');
            message.classList.add('toast-message');
            document.body.appendChild(message);
            message.innerText = `please select number of units`;
            
            setTimeout(()=>{
                message.remove();
            },3000);
        }
        else{
            if(cartBody.classList.contains('empty')){
                cartBody.classList.remove('empty');
                cartBody.classList.add('full');
                // console.log(cartBody.classList);
                cartBody.innerHTML = `
                <div class="cart-content">
                <div class="cart-product-img" style="background-image: url('images/image-product-1-thumbnail.jpg')"></div>
                <div class="product-name-price">
                  <p>${productName.innerText}</p>
                  <p>${productPrice.innerText} 
                  ${+(unitsValue.innerText)==1 ? '<span class="change-units"></span>' : `<span class="change-units">x <span class="current-unit">${unitsValue.innerText}</span> <span style="color: #1d2025; font-weight: 700;">${+(productPrice.innerText.slice(1)) * +(unitsValue.innerText)}.00</span></span>`}</p>
                </div>
                <img src="images/icon-delete.svg" alt="icon-delete" id="delete">
              </div>
              
              <button class="checkout" onclick=" checkout()">Checkout</button>`;  
              changeCart();

              const deleteButton = document.getElementById('delete');

              deleteButton.addEventListener('click', () => {
                console.log("delete button is working");
                cartBody.classList.remove('full');
                cartBody.classList.add('empty');
                cartBody.innerHTML = "Your cart is empty";
                changeCart('empty');
                })
            }

            else if(cartBody.classList.contains('full')){
                const changeUnits = document.querySelector('.change-units');

                changeUnits.innerHTML = `x <span class="current-unit">${unitsValue.innerText}</span> <span style="color: #1d2025; font-weight: 700;">${+(productPrice.innerText.slice(1)) * +(unitsValue.innerText)}.00</span>`;
                changeCart();
            }
            else{
                console.log("Cart is having an empty/full error");
            }
        }
    }
    else{
        console.log("No Button being clicked currently");
    }
})

function checkout(){
    alert("There is no checkout page yet. Thank you for checking out this project!");
}

function changeCart(isCartEmpty){
    if(isCartEmpty == 'empty'){
        cartUnits.classList.remove('full');
        cartUnits.classList.add('empty');
        cartUnits.innerText = '';
    }
    else{
        cartUnits.classList.remove('empty');
        cartUnits.classList.add('full');
        cartUnits.innerText = unitsValue.innerText;
    }
}

const removeOverlay = (images, isLightBox) => { 
    if(isLightBox){
        const overlay = document.getElementById('lightbox-images').querySelector('.overlay');
        overlay.remove();
    }
    else{
        const overlay = document.querySelector('.overlay');
        overlay.remove();
    }

    images.forEach( image => {
        image.classList.remove('active');
    })
}