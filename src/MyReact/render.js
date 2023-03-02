function createDom(fiber) {
  const dom =
    fiber.type === "TEXT"
      ? document.createTextNode(fiber.props.nodeValue)
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}


function updateDom(dom, prevProps, nextProps) {
  const isEvent = key => key.startsWith('on');
  const isProperty = (key) => key !== "children" && !isEvent(key);
  // 挑选出要移除的属性
  const isGone = (prev, next) => key => !(key in next);
  // 挑选出新的属性
  const isNew = (prev, next) => key => prev[key] !== next[key];
  // 移除旧的监听事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => isGone(prevProps, nextProps)(key) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLocaleLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除不存在新props里的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => (dom[name] = ''));

  // 新增
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => (dom[name] = nextProps[name]));

  // 新增事件
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLocaleLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    })
}

let nextUnitOfWork = null;
let wipRoot = null; // 追踪 Root 树
let currentRoot = null; // 上一次提交的 Fiber 树
let deletions = [];

function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let preSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  while (index < elements.length || !!oldFiber) {
    const childElement = elements[index];
    let newFiber = null;
    const sameType = oldFiber && childElement && childElement.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: childElement.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }

    if (!sameType && childElement) {
      newFiber = {
        type: childElement.type,
        props: childElement.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }

    if (!sameType && oldFiber) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      preSibling.sibling = newFiber;
    }

    preSibling = newFiber;
    index++;
  }
}

// 执行任务单元
// fiber 架构：一种组织工作单元的树状数据结构
function preforUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 为当前的fiber创造子节点的fiber   fiber.child? === new;
  // parnet child sibling
  const children = fiber?.props?.children;

  // 用于追加兄弟节点
  reconcileChildren(fiber, children);

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

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  // 向父节点添加
  const domParent = fiber.parent.dom;

  switch (fiber.effectTag) {
    case 'PLACEMENT':
      !!fiber.dom && domParent.appendChild(fiber.dom);
      break;
    case 'UPDATE':
      !!fiber.dom && updateDom(fiber.dom, fiber.alternate, fiber.props);
      break;
    case 'DELETION':
      !!fiber.dom && domParent.appendChild(fiber.dom);
      break;
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitRoot() {
  // 1. 渲染真实DOM
  commitWork(wipRoot.child);
  deletions.forEach(commitWork);

  currentRoot = wipRoot;
  // 2. 维护 WipRoot
  wipRoot = null;
}


function workLoop(deadline) {
  let shouldYield = true;

  // 判断是否存在下一个任务单元(fiber) && 浏览器是否有空余的时间
  while (nextUnitOfWork && shouldYield) {
    nextUnitOfWork = preforUnitOfWork(nextUnitOfWork);  // 执行工作单元
    shouldYield = deadline.timeRemaining() > 1;         // 得到浏览器当前帧剩余的时间  scheduler
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  // 都为引用类型，会同步更改
  nextUnitOfWork = wipRoot;
  deletions = [];
}

export default render;
