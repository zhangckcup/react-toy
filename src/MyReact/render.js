function createDom(element) {
  const dom =
    element.type === "TEXT"
      ? document.createTextNode(element.props.nodeValue)
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Object.keys(element?.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = element.props[name]));

  return dom;
}

let nextUnitOfWork = null;

// 执行任务单元
// fiber 架构：一种组织工作单元的树状数据结构
function preforUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // 为当前的fiber创造子节点的fiber   fiber.child? === new;
  // parnet child sibling
  const children = fiber?.props?.children;

  // 用于追加兄弟节点
  let preSibling = null;
  children.forEach((childElement, index) => {
    const newFiber = {
      parent: fiber,
      props: childElement.props,
      type: childElement.type,
      dom: null,
      // sibling: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      preSibling.sibling = newFiber;
    }

    preSibling = newFiber;
  });

  // 深度优先遍历，寻找下一个任务单元
  if (fiber.child) {
    return fiber.child;
  }

  // 寻找兄弟节点
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }
}


function workLoop(deadline) {
  let shouldYield = true;

  // 判断是否存在下一个任务单元 && 浏览器是否有空余的时间
  while (nextUnitOfWork && shouldYield) {
    nextUnitOfWork = preforUnitOfWork(nextUnitOfWork);  // 执行工作单元
    shouldYield = deadline.timeRemaining() > 1;         // 得到浏览器当前帧剩余的时间  scheduler
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

export default render;
