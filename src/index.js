/** @jsxRuntime classic */
import { jsx } from "react";

import React from "./MyReact";

const root = document.getElementById("app");

const updateValue = e => {
  renderer(e.target.value);
}

/** @jsx MyReact.createElement */

const renderer = value => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>{value}</h2>
    </div>
  )

  React.render(element, root);
}

renderer('123');
