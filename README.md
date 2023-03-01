# React Toy

手写玩具react，理解其原理；

什么是代数效用；

概念点：schedule调度、优先级队列、小顶堆；
render、DFS、update、
lane模型、fiber

## createElement

简单实现 createElement 和 render 函数;

```js
const element = MyReact.createElement(
  "div",
  { title: "hello" },
  "world",
  MyReact.createElement("a", { href: "//baidu.com", target: "new" }, "baidu")
);
const root = document.getElementById("app");
MyReact.render(element, root);
```

## ConcurrentModeAndFiber

TODO: 只要开始递归便不会停止，可能会阻塞浏览器，寻找优化方法；

实现 Fiber 工作循环和构建 Fiber 树的过程；

```TextPlain
React 工作循环：
判断浏览器是否有空余的时间
判断是否存在下一个任务单元
执行工作单元
```

```js
// 通过此函数得到浏览器是否空闲
function requestIdleCallback(callback: IdleRequestCallback)
// 判断是否存在下一个任务单元 与 执行工作单元 就是遍历 Fiber 树的过程
```

```TextPlain
fiber 架构：一种组织工作单元的树状数据结构
```

## renderAndCommit

TODO: 同时创建虚拟 dom 和真实 dom，如果浏览器中断，则UI不完整

添加 wipRoot； nextUnitOfWork 赋值为 wipRoot，引用类型通过引用同步添加属性；

当 Fiber 树的虚拟 DOM 创建完成后，开始通过深度优先创建真实 DOM；

之后销毁 wipRoot；

## reconciliation

## functionAndHooks
