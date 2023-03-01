export default function createElement(type, props, ...children) {
  return {
    key: props?.key || null,
    ref: props?.ref || null,
    type,
    props: {
      ...props,
      children: children?.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: 'TEXT',
    props: {
      nodeValue: text,
      children: [],
    }
  }
}
