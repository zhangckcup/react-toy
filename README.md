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

创建过程与遍历过程都是 深度优先

## renderAndCommit

TODO: 同时创建虚拟 dom 和真实 dom，如果浏览器中断，则UI不完整

添加 wipRoot； nextUnitOfWork 赋值为 wipRoot，引用类型通过引用同步添加属性；

当 Fiber 树的虚拟 DOM 创建完成后，开始通过深度优先创建真实 DOM；

之后销毁 wipRoot；

## reconciliation

协调阶段与 Diff 算法

每次更新会保存提交的 fiber 树，在下一次更新时与旧 fiber 树进行比较；

## functionAndHooks

添加 Function 组件中创建、删除 DOM 的部分逻辑；

### hook

hooks: [], index; 有对应关系；

```js
function A() {
  let a = 1; // 每次都会执行，需要标记，告诉框架只需要执行一次；
  return {a}
}
```

## React 源码层次

### 掌握思想

> <https://react.docschina.org/community/team.html>

### 掌握关键流程的细节

> schedule 调度 小顶堆 浏览器渲染原理
>
> render 协调 dfs 更新：单向链表 lane模型 二进制掩码 fiber：generator

和工作关系不大，探索前端的边界。框架与日常开发最接近，因此选择通过框架来进行探索。

> classComponent -- 面向对象
>
> FunctionComponent 函数式(编译时优化的优势)

用来反映 state --> view 的变化，用函数式更合适。

代数效应：副作用。

### 掌握整体工作流程、局部细节

> React技术揭秘 <https://kasong.gitee.io/just-react/>

> schedule 调度 scheduler
>
> render 协调 renconciler - fiber
>
> commit 渲染 renderer - ReactDom ReactNative ReactArt

> view 视图          软件应用
>
> 生命周期  符合认知  
>
> hooks              操作系统
>
> React 底层运行流程  硬件

### 掌握术语、基本实现思路

> <https://pomb.us/build-your-own-react/>

