import MyReact from "./MyReact";
// import { createRoot } from "react-dom/client";

const element = MyReact.createElement(
  "div",
  { title: "hello" },
  "world",
  MyReact.createElement("a", { href: "//baidu.com", target: "new" }, "baidu")
);
const root = document.getElementById("app");

console.log(element, root);

MyReact.render(element, root);

// createRoot(root).render(element);
