import "../index.html";
import "../styles/main.css";
const Hammer = require("hammerjs");
////////////////////////////////////////////////////////////////
//contants and selectors
const colors = ["red", "lawngreen", "orange"];
const content = document.querySelector("#content");
const addButton = document.querySelector("#addButton");
const modal = document.querySelector("#modal");
const input: HTMLInputElement = document.querySelector("#input");
const modalContentt = document.querySelector(".modal_content");
const addStickButton = document.querySelector("#addStickButton");
const saveButton = document.querySelector("#saveButton");
const loadButton = document.querySelector("#loadButton");
////////////////////////////////////////////////////////////////
addButton.addEventListener("click", openModal);
modalContentt.addEventListener("click", (e) => {
  e.stopPropagation();
});
addStickButton.addEventListener("click", addStick);
saveButton.addEventListener("click", saveSticks);
loadButton.addEventListener("click", loadSticks);
modal.addEventListener("click", closeModal);
////////////////////////////////////////////////////////////////
//modal
function closeModal() {
  modal.classList.remove("modal_active");
}
function openModal() {
  modal.classList.add("modal_active");
}
////////////////////////////////////////////////////////////////
interface Stick {
  id: number;
  top: string;
  left: string;
  color: string;
  text: string;
  rotate: string;
}

let sticks: Stick[] = [];
////////////////////////////////////////////////////////////////
//asist func
function pixelToNumber(value: string) {
  return Number(value.split("px")[0]);
}
function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
function sticksUpdate(id: number, options: any) {
  sticks = sticks.map((stick) => {
    if (id === stick.id) {
      return {
        ...stick,
        ...options,
      };
    }
    return stick;
  });
}
function sticksAdd(stick: any) {
  sticks.push(stick);
}
function sticksRemove(id: number) {
  sticks = sticks.filter((stick) => stick.id !== id);
}
function saveSticks() {
  if (sticks.length) {
    localStorage.setItem("sticks", JSON.stringify(sticks));
    return alert("Saved");
  }
  alert("Nothing to save");
}
function loadSticks() {
  document.querySelectorAll(".stick").forEach((item) => item.remove());
  sticks = JSON.parse(localStorage.getItem("sticks"));
  sticks.forEach((item) => {
    const sticker = new Sticker(item);
    sticker.addStick();
  });
}
////////////////////////////////////////////////////////////////
//body
function addStick() {
  if (!input.value) {
    return alert("input area not to be empty");
  }
  const sticker = new Sticker();
  sticker.addStick();
  sticker.addStickToList();
  closeModal();
  input.value = "";
}
class Sticker {
  private id: number;
  private top: string;
  private left: string;
  private color: string;
  private text: string;
  private rotate: string;
  private START_X: number;
  private START_Y: number;
  constructor(props?: Stick) {
    this.id = props?.id ?? sticks.length;
    this.top = props?.top ?? "20px";
    this.left = props?.left ?? "20px";
    this.color = props?.color ?? randomColor();
    this.text = props?.text ?? input.value;
    this.rotate =
      props?.rotate ?? `rotate(${Math.floor(Math.random() * 20 - 10)}deg)`;
  }
  addStick() {
    const stick: HTMLDivElement = document.createElement("div");
    stick.className = "stick";
    stick.style.transform = this.rotate;
    stick.style.backgroundColor = this.color;
    stick.style.left = this.left;
    stick.style.top = this.top;
    stick.textContent = this.text;
    content.append(stick);
    const hammStick = new Hammer(stick);
    hammStick.on("panstart", (e: any) => {
      this.START_X = Math.floor(pixelToNumber(e.target.style.left));
      this.START_Y = Math.floor(pixelToNumber(e.target.style.top));
    });
    hammStick.on("panmove", (ev: any) => {
      let top = `${this.START_Y + ev.deltaY}px`;
      let left = `${this.START_X + ev.deltaX}px`;
      stick.style.top = top;
      stick.style.left = left;
      sticksUpdate(this.id, { top, left });
    });
    hammStick.on("doubletap", () => {
      sticksRemove(this.id);
      stick.remove();
    });
    hammStick.on("panmoveend", () => {
      console.log("");
    });
  }
  addStickToList() {
    sticksAdd({
      id: this.id,
      top: this.top,
      left: this.left,
      color: this.color,
      text: this.text,
      rotate: this.rotate,
    });
  }
}
