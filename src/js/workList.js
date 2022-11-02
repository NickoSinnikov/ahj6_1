export default class WorkList {
    constructor(){
      this.addFormBtn = Array.from(document.querySelectorAll(".add-item"));
      this.btnCancel = Array.from(document.querySelectorAll(".btn-cancel"))
      this.forms = null; 
      this.currentColumn = null;
    }
  
  
    init(){
      this.showAddForm();
      this.closeAddForm();
      this.addItem();
    }
  
    addItem(){

    }



    showAddForm(){
      this.addFormBtn.forEach(el =>{
        el.addEventListener("click", (event)=>{
          event.target.nextElementSibling.classList.toggle("add-form-hidden");
          this.currentColumn = event.target.parentElement;
          console.log(this.currentColumn);
      })
      })
    }

    closeAddForm(){
      this.btnCancel.forEach(el =>{
        el.addEventListener("click", (event)=>{
          console.log(event.target);
          event.target.parentElement.parentElement.classList.toggle("add-form-hidden")
      })
      })
    }


  }
  