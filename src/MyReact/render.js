function render(element, container) {
  const dom =
    element.type === "TEXT"
      ? document.createTextNode(element.props.nodeValue)
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Object.keys(element?.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = element.props[name]));

  // TODO: 只要开始递归便不会停止，可能会阻塞浏览器
  element?.props?.children?.forEach((child) => render(child, dom));

  container.appendChild(dom);
}

export default render;
