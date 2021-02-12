<template>
  <main class="noselect screen-centered">
    <div id="stack" :class="{ incomplete: stack.length > 3 }">
      <span v-for="(value, index) in stack_shown" :key="index">
        {{ prettyPrint(value) }}
      </span>
    </div>
    <div id="input">{{ inputfield }}</div>
  </main>
</template>

<script>
import { Decimal } from "decimal.js";
import { display } from "./display.js";

const maxlength = 20;

export default {
  name: "arpeen",
  data: function () {
    return {
      stack: [],
      inputfield: "",
    };
  },
  mounted() {
    document.addEventListener("keydown", this.keypressed);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keypressed);
  },
  computed: {
    stack_shown: function () {
      return this.stack.slice(-3);
    },
  },
  methods: {
    prettyPrint: function (number) {
      return display(number, maxlength);
    },
    pushToDisplay: function (char) {
      const newfield = this.inputfield + char;
      if (newfield.length < maxlength && !isNaN(Number(newfield))) {
        this.inputfield = newfield;
      }
    },
    drop: function () {
      if (this.inputfield !== "") this.inputfield = "";
      else this.stack.pop();
    },
    push: function () {
      if (this.inputfield !== "" && !isNaN(Number(this.inputfield))) {
        this.stack.push(new Decimal(this.inputfield));
        this.inputfield = "";
      }
    },
    switch: function () {
      if (this.stack.length > 1) {
        let x = this.stack.pop();
        let y = this.stack.pop();
        this.stack.push(x);
        this.stack.push(y);
      }
    },
    keypressed: function (ev) {
      if (this.dispatchAction(ev.key)) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    },
    dispatchAction: function (action) {
      if ("0123456789.".includes(action)) {
        this.pushToDisplay(action);
      } else if ("+-*/".includes(action)) {
        this.binaryOperation(action);
      } else if (action == "Backspace") {
        this.drop();
      } else if (action == "Enter") {
        this.push();
      } else if (action == "Tab") {
        this.switch();
      } else {
        return false;
      }
      return true;
    },
    pushOrFail: function () {
      if (this.inputfield === "") return true;
      if (!isNaN(Number(this.inputfield))) {
        this.stack.push(new Decimal(this.inputfield));
        this.inputfield = "";
        return true;
      }
      return false;
    },
    binaryOperation: function (key) {
      if (this.pushOrFail() === false) return null;
      if (this.stack.length < 2) return null;
      let x = this.stack.pop();
      let y = this.stack.pop();
      switch (key) {
        case "+":
          this.stack.push(y.plus(x));
          break;
        case "-":
          this.stack.push(y.minus(x));
          break;
        case "*":
          this.stack.push(y.times(x));
          break;
        case "/":
          this.stack.push(y.dividedBy(x));
          break;
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300&display=swap");
body {
  margin: 0;
}
.screen-centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}
div {
  font-size: 32px;
  width: 20ch;
  padding: 0;
  line-height: 1.2em;
  text-align: right;
  font-family: "IBM Plex Mono", monospace;
}
div#input {
  height: 1.2em;
  border-top: 2px solid black;
}
div#stack {
  height: 3.6em;
  flex-direction: column;
  display: flex;
  justify-content: flex-end;
}
div#stack span {
  height: 1.2em;
  display: block;
}
div#stack.incomplete::before {
  content: "↑";
}
</style>
