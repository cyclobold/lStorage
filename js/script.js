const productsDiv = document.querySelector("#products");

/**
 * Get the products
 */
document.addEventListener("DOMContentLoaded", function(){

    //check if there is a pending form in the storage
    const feedback = isPendingForm("add-product-form");
    console.log(feedback);
    if(feedback != null){
        //load the pending form 
        addProduct(true, feedback.id);
    }else{
        products = getProducts();

        if(products.length == 0){
            productsDiv.innerHTML = `<div class='alert alert-warning'>
                                    No products yet

                                    <button type='button' class='btn btn-sm btn-primary' id='add-product-btn'>Add your first product</button>
                                </div>`;


                                document.querySelector("#add-product-btn").onclick = function(){
    
                                    addProduct();

                                }
        }else{
            let code = `<div class='row'>`;

            for(let i = 0; i < products.length; i++){

                code += `<div class='col-md-4'>
                            <div class='card'>
                                <div class='card-heading'>
                                    ${products[i].product_name}
                                </div>

                                <div class='card-body'>
                                ${products[i].product_description}
                                </div>

                                <div class='card-footer'>
                                    <button type='button' class='btn btn-sm btn-outline-danger' onclick="removeItem('${products[i].id}')">Delete Item</button>
                                </div>
                            
                            </div>
                        </div>`;


            }




        code += `</div>`;

        productsDiv.innerHTML = code;
        }

           
            


    }

   






})







/**
 * functions
 */


function removeItem(product_id){

    let productEntries = JSON.parse(localStorage.getItem("product-entries"));

    for(let i = 0; i < productEntries.length; i++){

        if(productEntries[i].id == product_id){
            productEntries.splice(i, 1);

            localStorage.setItem('product-entries', JSON.stringify(productEntries));
            break;
        }

    }

    location.reload();



}

function isPendingForm(form_type){

    let formEntries = localStorage.getItem("form-entries");

    if(formEntries == null || formEntries == undefined){
        //there is nothing in the form Entry
        return null;
    }else{
        formEntries = JSON.parse(formEntries);
        if(formEntries.length == 0){
            //there is nothing in the form entries
            return null;
        }else{

            for(let i = 0; i < formEntries.length; i++){
                if(formEntries[i].type == form_type){
                    if(formEntries[i].is_submitted == false || formEntries[i].is_closed == false){
                        //form found
                        return formEntries[i];
                    }
                }
            }

        }

    }


}

//get products
function getProducts(){

    let storedProducts = localStorage.getItem('product-entries');

    if(storedProducts == null || storedProducts == undefined){

        productsDiv.innerHTML = `<div class='alert alert-warning'>
                                    No products yet

                                    <button type='button' class='btn btn-sm btn-primary' id='add-product-btn'>Add your first product</button>
                                </div>`;


                                document.querySelector("#add-product-btn").onclick = function(){
    
                                    addProduct();

                                }

    }else{

        storedProducts = JSON.parse(storedProducts);

        return storedProducts;

    }


}


function addProduct(reload_form = false, form_id = null){
    let product_name, product_description, product_image, product_price;


    if(reload_form == false){
        product_name = '';
        product_description = '';
        product_image = '';
        product_price = '';
    }else{
        //get form information..
        form_data = getForm(form_id);

        console.log(form_data);

        product_name = form_data.data.product_name;
        product_description = form_data.data.product_description;
        product_image = form_data.data.product_image;
        product_price = form_data.data.product_price;

    }

    const addForm = `

                <div id='form-area'>
                <div>
                    <h5>Add New Product</h5>
                </div>

                <button type='button' class='btn btn-sm btn-danger' id='close-btn'>close</button>
    
                <form class='form' id='add-product-form-id'>
                        <div class='form-group'>
                            <label>Product name</label>
                            <input type='text' name='product_name' value='${product_name}' class='form-control'>
                        </div>

                        <div class='form-group'>
                            <label>Product description</label>
                            <textarea class='form-control' name='product_description'>${product_description}</textarea>
                        </div>

                        <div class='form-group'>
                            <label>Product image</label>
                            <input type='text' name='product_image' value='${product_image}' class='form-control'>
                        </div>
                        <div class='form-group'>
                            <label>Product price</label>
                            <input type='number' name='product_price' value='${product_price}' class='form-control'>
                        </div>

                        <div class='form-group'>
                            <button type='submit' class='btn btn-md btn-success'>Add Product</button>
                        </div>
                
    
                    </form>
                    </div>
                    `;

    
    productsDiv.innerHTML = addForm;

    //save the form state to the localStorage

   if(reload_form == false){
        const addProductForm = document.querySelector("#add-product-form-id");

        let product_name = addProductForm.product_name.value.trim();
        let product_description = addProductForm.product_description.value.trim();
        let product_image = addProductForm.product_image.value.trim();
        let product_price = addProductForm.product_price.value.trim();


        createNewFormEntry("add-product-form",
                            product_name, 
                            product_description,
                            product_image,
                            product_price
                            );
   }




   //when the form is submitted
   let addProductForm = document.querySelector("#add-product-form-id");

   addProductForm.addEventListener("submit", function(e){
        e.preventDefault();
            
        product_name = this.product_name.value.trim();
        product_description = this.product_description.value.trim();
        product_image = this.product_image.value.trim();
        product_price = this.product_price.value.trim();

        let product = {
            id: "prod_"+ new Date().getTime(),
            product_name: product_name,
            product_description: product_description,
            product_image: product_image,
            product_price: product_price
        }


        if(saveToProductEntry(product) == true){

            //clear the form entry
            removeFormEntry("add-product-form");

            location.reload();

        }


   })




    document.querySelector("#close-btn").onclick = function(){
        //removeForm entries
        removeFormEntry("add-product-form");
        location.reload();
    }
}


function saveToProductEntry(product){

    let productEntries = localStorage.getItem("product-entries");

    if(productEntries == null || productEntries == undefined){
        
        let product_entries = [];
        
        product_entries.push(product);

        localStorage.setItem("product-entries", JSON.stringify(product_entries));

        return true;

    }else{

        productEntries = JSON.parse(productEntries);

        productEntries.push(product);

        localStorage.setItem("product-entries", JSON.stringify(productEntries));

        return true;


    }



}

function removeFormEntry(form_type){

    //get your entries
    let formEntries = localStorage.getItem("form-entries");

    formEntries = JSON.parse(formEntries);

    for(let i = 0; i < formEntries.length; i++){
        if(formEntries[i].type == form_type){

            formEntries.splice(i, 1);

            //save formEntries back..
            formEntries = JSON.stringify(formEntries);

            localStorage.setItem("form-entries", formEntries);
            break;
        }
    }


}


function getForm(form_id){

    let formEntries = localStorage.getItem("form-entries");

    formEntries = JSON.parse(formEntries);

    let found_form;
    formEntries.forEach((formEntry) =>{

        if(formEntry.id == form_id){

            found_form = formEntry;

        }


    })

    return found_form;

}

function createNewFormEntry(form_type, product_name, product_description, product_image, product_price){

    const form_object = {
            id: new Date().getTime(),
            is_submitted: false,
            is_closed: false,
            data: {
                product_name: product_name,
                product_description: product_description,
                product_image: product_image,
                product_price: product_price
            },
            type: form_type
    }


    let formEntries = localStorage.getItem("form-entries");

    if(formEntries == null || formEntries == undefined){
        //create a new array
        let form_entries = [];

        form_entries.push(form_object);

        form_entries = JSON.stringify(form_entries);

        localStorage.setItem("form-entries", form_entries);


    }else{

        formEntries = JSON.parse(formEntries);

        formEntries.push(form_object);

        formEntries = JSON.stringify(formEntries);

        localStorage.setItem("form-entries", formEntries);

    }


}

