let wipFiber;
let hooksIndex;

export function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  wipFiber.hooks = [];
  hooksIndex = 0;

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

export function useState(initVal) {
  const oldHook = wipFiber?.alternate?.hooks?.[hooksIndex];

  const hook = {
    state: oldHook ? oldHook.state : initVal,
    queue: [],
  }

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action;
  })

  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    // 都为引用类型，会同步更改
    nextUnitOfWork = wipRoot;
    deletions = [];
  }

  wipFiber.hooks.push(hook);
  hooksIndex++;

  return [hook.state, setState]
}

export function useEffect(callback, deps) {
  
}
