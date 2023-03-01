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

```TextPlain
React 工作循环：
判断浏览器是否有空余的时间？
判断是否存在下一个任务单元
执行工作单元
```

```TextPlain
fiber 架构：一种组织工作单元的树状数据结构
```

## renderAndCommit

## reconciliation

## functionAndHooks
