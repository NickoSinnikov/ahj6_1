import TrelloStorage from "./TrelloStorage";

export default class WorkList {
  constructor() {
    this.columnsContent = document.querySelector(".column-content");
    this.columns = Array.from(document.querySelectorAll(".column"));
    this.forms = Array.from(document.getElementsByTagName("form"));
    this.draggedEl = null;
    this.ghostEl = null;
    this.todoList = document.getElementById("todo");
    this.progressList = document.getElementById("inProgress");
    this.doneList = document.getElementById("done");
    this.topDiff = null;
    this.leftDiff = null;
  }

  init() {
    console.log("init");
    document.addEventListener("DOMContentLoaded", () => {
      console.log("pfufe");
      this.load();
    });
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
        addItemDiv.innerHTML = `<span class="item-text">${input.value}</span> <button type="submit" class="delete-item hidden">&#10006</button>`;
        parent.appendChild(addItemDiv);
        item.reset();
        item.classList.add("add-form-hidden");
        this.save();
      });
    });
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
        this.save();
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
        this.ghostEl.style.width = `${this.draggedEl.offsetWidth}px`;
        this.ghostEl.style.left = `${this.draggedEl.getBoundingClientRect()}px`;
        this.ghostEl.style.top = `${this.draggedEl.getBoundingClientRect()}px`;
        const { top, left } = this.draggedEl.getBoundingClientRect();
        this.topDiff = event.pageY - top;
        this.leftDiff = event.pageX - left;
        this.draggedEl.classList.add("dragged-elem");
      });

      el.addEventListener("mousemove", (event) => {
        event.preventDefault();
        if (!this.draggedEl) {
          return;
        }
        this.ghostEl.style.left = `${event.pageX - this.leftDiff}px`;
        this.ghostEl.style.top = `${event.pageY - this.topDiff}px`;
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
          this.endMove();
          this.save();
        } else if (parent) {
          parent.appendChild(this.draggedEl);
          this.endMove();
          this.save();
        } else {
          this.endMove();
          this.save();
        }
      });
    });
  }

  endMove() {
    document.body.style.cursor = "auto";
    document.body.removeChild(this.ghostEl);
    this.draggedEl.classList.remove("dragged-elem");
    this.ghostEl = null;
    this.draggedEl = null;
  }

  save() {
    const todoCards = this.todoList.querySelectorAll(".content-item");
    const progressCards = this.progressList.querySelectorAll(".content-item");
    const doneCards = this.doneList.querySelectorAll(".content-item");

    const data = {
      todo: [],
      progress: [],
      done: [],
    };

    todoCards.forEach((el) => {
      const elText = el.querySelector(".item-text");
      data.todo.push(elText.textContent);
    });

    progressCards.forEach((el) => {
      const elText = el.querySelector(".item-text");
      data.progress.push(elText.textContent);
    });

    doneCards.forEach((el) => {
      const elText = el.querySelector(".item-text");
      data.done.push(elText.textContent);
    });

    TrelloStorage.save(data);
  }

  load() {
    const data = JSON.parse(TrelloStorage.load());

    if (data) {
      data.todo.forEach((el) => {
        const addItemDiv = document.createElement("div");
        addItemDiv.className = "content-item";
        addItemDiv.innerHTML = `<span class="item-text">${el}</span> <button type="submit" class="delete-item hidden">&#10006</button>`;
        this.todoList.querySelector(".column-content").appendChild(addItemDiv);
      });
      data.progress.forEach((el) => {
        const addItemDiv = document.createElement("div");
        addItemDiv.className = "content-item";
        addItemDiv.innerHTML = `<span class="item-text">${el}</span> <button type="submit" class="delete-item hidden">&#10006</button>`;
        this.progressList
          .querySelector(".column-content")
          .appendChild(addItemDiv);
      });
      data.done.forEach((el) => {
        const addItemDiv = document.createElement("div");
        addItemDiv.className = "content-item";
        addItemDiv.innerHTML = `<span class="item-text">${el}</span> <button type="submit" class="delete-item hidden">&#10006</button>`;
        this.doneList.querySelector(".column-content").appendChild(addItemDiv);
      });
    }
  }
}
