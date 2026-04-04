//select elements
let crud = document.querySelector(".curd")
let productName = document.querySelector("#name");
let priceInput = document.querySelector("#price");
let taxInput = document.querySelector("#tax");
let DiscountInput = document.querySelector("#discount");
let categoryInput = document.querySelector("#Category");
let addProduct = document.querySelector(".Add");
let myForm = document.forms[0];
let tbody = document.querySelector("#tb");

// setting and global variables
class Product {
  constructor(id, productName, price, tax, discount, category) {
    this.id = id;
    this.productName = productName;
    this.price = price;
    this.tax = tax;
    this.discount = discount;
    this.category = category;
  }
  showInfo() {
    console.log(
      `${this.productName} , ${this.price} ${this.tax} ${this.discount} ${this.category}`,
    );
  }
}
let edit = null;
let myData = [];

////////////get data from localstorg
if (localStorage.getItem("prodcut")) {
  myData = JSON.parse(localStorage.getItem("product"));
}
getFromLocal();

//start add product and submit form
myForm.addEventListener("submit", (e) => {
  if (
    productName.value &&
    priceInput.value &&
    taxInput.value &&
    DiscountInput.value &&
    categoryInput.value !== ""
  ) {
    //create object
    let myproduct = new Product(
      Date.now(),
      productName.value,
      priceInput.value,
      taxInput.value,
      DiscountInput.value,
      categoryInput.value,
    );
    ///////////////////
    //condition to update row
    if(addProduct.textContent=="update"){
     myData = myData.map((el)=>{
        if(el.id == edit){
          return  new Product(el.id,productName.value,priceInput.value,taxInput.value,DiscountInput.value,categoryInput.value);

        }
        return el;
      })
      edit = null;
      addProduct.textContent = "Add Product";
      showAlert("success","Update completed successfully.");

    }else{
     myproduct = new Product(
      Date.now(),
      productName.value,
      priceInput.value,
      taxInput.value,
      DiscountInput.value,
      categoryInput.value,
    );
      myData.push(myproduct);
  }
  //end condition of update row
    addLocalstorg(myData);
    showProduct(myData);
  }else{
      showAlert("error","please fill in all fields");
    
  }

  //stop submit behevior
  e.preventDefault();

  //empty fields
  productName.value = "";
  priceInput.value = "";
  taxInput.value = "";
  DiscountInput.value = "";
  categoryInput.value = "";
});

//edit and delet products from table
tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    ///delete from localstorge
    deletFromlocalstorge(
      e.target.parentElement.parentElement.getAttribute("data-id"),
    );
    //delete from page
    e.target.parentElement.parentElement.remove();
  }
  if (e.target.classList.contains("update")) {
    

    upDate(e.target.parentElement.parentElement.getAttribute("data-id"));
  }
});
//////////////////////////////
//factory of functions
//Function to add data to table
function showProduct(product) {
  tbody.innerHTML = "";
  for (let i = 0; i < product.length; i++) {
    let tr = document.createElement("tr");
    tr.setAttribute("data-id", product[i].id);
    tr.innerHTML = `
    <tr>
    <td>
    ${product[i].productName}
    </td>
    <td>
    ${product[i].price}$
    </td>
    <td>${product[i].tax}%</td>
    <td>${product[i].discount}%</td>
    <td>${product[i].category}</td>
    <td class="Edit">
       <i class="fa-solid fa-trash-can del"></i>
        <i class="fa-solid fa-pen-to-square update"></i>
    </td>
    <td>${totalPrice(product[i].price,product[i].tax,product[i].discount)}$</td>

    </tr>
     `;
    //app
    tbody.appendChild(tr);
  }
}
///////////////////
//add to localstorg
function addLocalstorg(product) {
  localStorage.setItem("product", JSON.stringify(product));
}
/////////////
//get from localstorg
function getFromLocal() {
  let pro = localStorage.getItem("product");
  if (pro) {
    myData = JSON.parse(pro);
    showProduct(myData);
  }
}
///////////////
//delete from localstorg
function deletFromlocalstorge(productId) {
  myData = myData.filter((el) => {
    return el.id != productId;
  });
  addLocalstorg(myData);
}
///////////////////
//function to update tr
function upDate(row) {
  edit = row;
  let newProduct = myData.find((el) => {
    console.log(`${el.id} : ${edit}`)
    return el.id == edit;
  });
  if (newProduct) {
    productName.value = newProduct.productName;
    priceInput.value = newProduct.price;
    taxInput.value = newProduct.tax;
    DiscountInput.value = newProduct.discount;
    categoryInput.value = newProduct.category;
    addProduct.textContent = "update"
  }
}
///////////////
//functio to calc total price after tax and discount
function totalPrice(price,tax,discount){
  price = parseFloat(price)
  tax = parseFloat(tax)
  discount = parseFloat(discount)
  let sum = (price + (price * tax/100)) - (price * discount/100)
  return sum.toFixed(2);
}
///////////////////
//create alert
function showAlert(classes,msg){
  let myAlert = document.createElement("div")
  myAlert.className = `myalert ${classes}`;

  //
    myAlert.innerHTML=
  `
  <span class="msg">${msg}</span>
  <span class="close">x</span>
  `
  //close alert
  myAlert.querySelector(".close").addEventListener("click",()=>{
    myAlert.remove();
  })
  
  setTimeout(()=>{
    myAlert.remove();
  },4000)
  
  document.body.prepend(myAlert)

}  



