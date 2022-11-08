export default class WorkList {
  constructor() {
    this.columnsContent = document.querySelector(".column-content");
    this.columns = Array.from(document.querySelectorAll(".column"));
    this.forms = Array.from(document.getElementsByTagName("form"));
    this.draggedEl = null;
    this.ghostEl = null;
  }

  init() {
    this.action();
    this.addItem();
  }

  addItem() {
    this.forms.forEach((item) => {
      item.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = [...item.elements][0];
        const parent = item.closest(".column").querySelector(".column-content");
        const addItemDiv = document.createElement("div");
        addItemDiv.className = "content-item";
        addItemDiv.innerHTML = `<span>${input.value}</span> <button type="submit" class="delete-item hidden">&#10006</button>`;
        parent.appendChild(addItemDiv);
        item.reset();
        item.classList.add("add-form-hidden");
      });
    });
  }

  deleteItem(elem) {
    elem.closest(".content-item").remove();
  }

  action() {
    this.columns.forEach((el) => {
      //* нажатие на элементы
      el.addEventListener("click", (event) => {
        console.log(event.target);
        if (event.target.classList.contains("delete-item")) {
          event.target
            .closest(".content-item")
            .remove(event.target.parentElement);
        } else if (event.target.classList.contains("add-item")) {
          const parentEl = event.target.parentElement;
          parentEl
            .querySelector(".add-form")
            .classList.toggle("add-form-hidden");
        } else if (event.target.classList.contains("btn-cancel")) {
          event.target.parentElement.parentElement.classList.toggle(
            "add-form-hidden"
          );
        }
      });

      //* наведение на элементы
      el.addEventListener("mouseover", (event) => {
        if (event.target.classList.contains("content-item")) {
          event.target.querySelector(".delete-item").classList.remove("hidden");
        }
      });

      el.addEventListener("mouseout", (event) => {
        if (
          event.target.classList.contains("content-item") &&
          !event.relatedTarget.classList.contains("delete-item")
        ) {
          event.target.querySelector(".delete-item").classList.add("hidden");
        }
      });

      //* перетаскивание
      el.addEventListener("mousedown", (event) => {
        if (!event.target.classList.contains("content-item")) {
          return;
        }
        event.preventDefault();
        document.body.style.cursor = "grabbing";
        this.draggedEl = event.target;
        this.ghostEl = event.target.cloneNode(true);
        this.ghostEl.classList.add("dragged");
        document.body.appendChild(this.ghostEl);
        this.ghostEl.style.left = `${
          event.pageX - this.ghostEl.offsetWidth / 2
        }px`;
        this.ghostEl.style.top = `${
          event.pageY - this.ghostEl.offsetHeight / 2
        }px`;
      });

      el.addEventListener("mousemove", (event) => {
        event.preventDefault();
        if (!this.draggedEl) {
          return;
        }
        this.ghostEl.style.left = `${
          event.pageX - this.ghostEl.offsetWidth / 2
        }px`;
        this.ghostEl.style.top = `${
          event.pageY - this.ghostEl.offsetHeight / 2
        }px`;
      });

      el.addEventListener("mouseup", (event) => {
        event.preventDefault();
        if (!this.draggedEl) {
          return;
        }

        const closest = document.elementFromPoint(event.clientX, event.clientY);
        const { top } = closest.getBoundingClientRect();
        const parent = closest.closest(".column-content");
        if (parent && parent !== closest) {
          if (event.pageY > window.scrollY + top + closest.offsetHeight / 2) {
            parent.insertBefore(this.draggedEl, closest.nextElementSibling);
          } else {
            parent.insertBefore(this.draggedEl, closest);
          }
        } else if (parent) {
          parent.appendChild(this.draggedEl);
          this.endMove();
        } else {
          this.endMove();
        }
      });
    });
  }

  endMove() {
    document.body.style.cursor = "auto";
    document.body.removeChild(this.ghostEl);
    this.ghostEl = null;
    this.draggedEl = null;
  }
}
