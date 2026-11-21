var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a;
        return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a;
        return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix2) {
        return new code_1.Name(this._newName(prefix2));
      }
      _newName(prefix2) {
        const ng = this._names[prefix2] || this._nameGroup(prefix2);
        return `${prefix2}${ng.index++}`;
      }
      _nameGroup(prefix2) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix2)) || this._prefixes && !this._prefixes.has(prefix2)) {
          throw new Error(`CodeGen: prefix "${prefix2}" is not allowed in this scope`);
        }
        return this._names[prefix2] = { prefix: prefix2, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix2, nameStr) {
        super(nameStr);
        this.prefix = prefix2;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix2) {
        return new ValueScopeName(prefix2, this._newName(prefix2));
      }
      value(nameOrPrefix, value) {
        var _a;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix: prefix2 } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix2];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix2] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix2] || (this._scope[prefix2] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix2, itemIndex });
        return name;
      }
      getValue(prefix2, keyOrRef) {
        const vs = this._values[prefix2];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix2 in values) {
          const vs = values[prefix2];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix2] = usedValues[prefix2] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node5 = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node5 {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants3) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants3);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node5 {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants3) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants3);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node5 {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node5 {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node5 {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node5 {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants3) {
        this.code = optimizeExpr(this.code, names, constants3);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node5 {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants3) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants3))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants3) {
        var _a;
        this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants3);
        if (!(super.optimizeNames(names, constants3) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants3);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants3) {
        if (!super.optimizeNames(names, constants3))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants3);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants3) {
        if (!super.optimizeNames(names, constants3))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants3);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a, _b;
        super.optimizeNodes();
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants3) {
        var _a, _b;
        super.optimizeNames(names, constants3);
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants3);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants3);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix2) {
        return this._scope.name(prefix2);
      }
      // reserves unique name in the external scope
      scopeName(prefix2) {
        return this._extScope.name(prefix2);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix2, keyOrRef) {
        return this._extScope.getValue(prefix2, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants3) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants3[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants3[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : { ...from, ...to },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // data passed to validation function
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      // validation/data context - should not be used directly, it is destructured to the names below
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      // root data - same as the data passed to the first/top validation function
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // used to support recursiveRef and dynamicRef
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      // null or array of validation errors
      errors: new codegen_1.Name("errors"),
      // counter of validation errors
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      // also used in JTD errors
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a;
      return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a2;
        gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/json-schema-traverse/index.js"(exports, module) {
    "use strict";
    var traverse = module.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env) {
        var _a;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        // TODO can its length be used as dataLevel if nil is removed?
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve2.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve2(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a;
      if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/data.json"(exports, module) {
    module.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/fast-uri/lib/utils.js"(exports, module) {
    "use strict";
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    var isPort = RegExp.prototype.test.bind(/^\d*$/u);
    var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
    var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
    var isPathCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u);
    var isQueryFragmentCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u);
    var isUserinfoCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u);
    var BYTE_HEX = new Array(256);
    {
      const HEX_DIGITS = "0123456789ABCDEF";
      for (let i = 0; i < 256; i++) {
        BYTE_HEX[i] = "%" + HEX_DIGITS[i >> 4] + HEX_DIGITS[i & 15];
      }
    }
    function percentEncodeNonAscii(cp) {
      if (cp < 2048) {
        return BYTE_HEX[192 | cp >> 6] + BYTE_HEX[128 | cp & 63];
      }
      if (cp < 65536) {
        return BYTE_HEX[224 | cp >> 12] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
      }
      return BYTE_HEX[240 | cp >> 18] + BYTE_HEX[128 | cp >> 12 & 63] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
    }
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    var isHextet = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/);
    var isIPvFuture = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/);
    var isZoneCharacter = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/);
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function isZoneIdentifier(zone) {
      if (zone.length === 0) return false;
      for (let i = 0; i < zone.length; i++) {
        if (isZoneCharacter(zone[i])) continue;
        if (zone[i] === "%" && i + 2 < zone.length && isHexPair(zone.slice(i + 1, i + 3))) {
          i += 2;
          continue;
        }
        return false;
      }
      return true;
    }
    function compressIPv6ZeroRun(hextets) {
      let bestStart = -1;
      let bestLength = 0;
      let runStart = -1;
      let runLength = 0;
      for (let i = 0; i < hextets.length; i++) {
        if (hextets[i] === "0") {
          if (runStart === -1) runStart = i;
          runLength++;
          if (runLength > bestLength) {
            bestLength = runLength;
            bestStart = runStart;
          }
        } else {
          runStart = -1;
          runLength = 0;
        }
      }
      if (bestLength < 2) return hextets.join(":");
      const head2 = hextets.slice(0, bestStart).join(":");
      const tail = hextets.slice(bestStart + bestLength).join(":");
      return head2 + "::" + tail;
    }
    function normalizeIPv6Address(input) {
      const compression = input.indexOf("::");
      if (compression !== -1 && input.indexOf("::", compression + 1) !== -1) return void 0;
      const left = compression === -1 ? input.split(":") : input.slice(0, compression).split(":");
      const right = compression === -1 ? [] : input.slice(compression + 2).split(":");
      if (compression !== -1) {
        if (left.length === 1 && left[0] === "") left.length = 0;
        if (right.length === 1 && right[0] === "") right.length = 0;
      }
      const parts = left.concat(right);
      let hextetCount = 0;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === "") return void 0;
        if (part.indexOf(".") !== -1) {
          if (i !== parts.length - 1 || compression !== -1 && right.length === 0 || !isIPv4(part)) return void 0;
          hextetCount += 2;
          continue;
        }
        if (!isHextet(part)) return void 0;
        parts[i] = parseInt(part, 16).toString(16);
        hextetCount++;
      }
      if (compression === -1) {
        if (hextetCount !== 8) return void 0;
        return compressIPv6ZeroRun(parts);
      }
      if (hextetCount >= 8) return void 0;
      const expanded = parts.slice(0, left.length);
      for (let i = hextetCount; i < 8; i++) expanded.push("0");
      for (let i = left.length; i < parts.length; i++) expanded.push(parts[i]);
      return compressIPv6ZeroRun(expanded);
    }
    function normalizeIPv6(host) {
      const bracketed = host[0] === "[" && host[host.length - 1] === "]";
      const hasBracket = host[0] === "[" || host[host.length - 1] === "]";
      if (hasBracket && !bracketed) return { host, isIPV6: false, error: true };
      let input = bracketed ? host.slice(1, -1) : host;
      if (bracketed && isIPvFuture(input)) {
        input = input.toLowerCase();
        return { host: `[${input}]`, escapedHost: input, isIPV6: false, isIPVFuture: true };
      }
      if (findToken(input, ":") < 2) {
        return { host, isIPV6: false, error: bracketed };
      }
      let zoneIdentifier = "";
      const zoneSeparator = input.indexOf("%");
      if (zoneSeparator !== -1) {
        const separatorLength = input.slice(zoneSeparator, zoneSeparator + 3).toLowerCase() === "%25" ? 3 : 1;
        zoneIdentifier = input.slice(zoneSeparator + separatorLength);
        if (!isZoneIdentifier(zoneIdentifier)) return { host, isIPV6: false, error: true };
        input = input.slice(0, zoneSeparator);
      }
      const address = normalizeIPv6Address(input);
      if (address === void 0) return { host, isIPV6: false, error: true };
      return {
        host: address + (zoneIdentifier ? "%" + zoneIdentifier : ""),
        escapedHost: address + (zoneIdentifier ? "%25" + zoneIdentifier : ""),
        isIPV6: true
      };
    }
    function findToken(str, token) {
      let ind = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === token) ind++;
      }
      return ind;
    }
    function removeDotSegments(path) {
      let input = path;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    function removeDotSegmentsRelative(path) {
      if (path === "" || path[0] === "/") {
        return removeDotSegments(path);
      }
      const segments = path.split("/");
      const last = segments.length - 1;
      const output = [];
      let trailingDirectory = false;
      for (let i = 0; i <= last; i++) {
        const segment = segments[i];
        if (segment === "." || segment === "..") {
          if (segment === "..") {
            if (output.length !== 0 && output[output.length - 1] !== "..") {
              output.pop();
            } else {
              output.push("..");
            }
          }
          trailingDirectory = i === last;
        } else {
          output.push(segment);
        }
      }
      if (trailingDirectory && output[output.length - 1] !== "..") {
        output.push("");
      }
      if (output.length === 0 || output[0] === "" || output[0].includes(":")) {
        output.unshift(".");
      }
      return output.join("/");
    }
    var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
    var HOST_DELIM_RE = /[@/?#:]/g;
    var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
    function reescapeHostDelimiters(host, isIP) {
      const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
      re.lastIndex = 0;
      return host.replace(re, (ch) => HOST_DELIMS[ch]);
    }
    function normalizePercentEncoding(input, decodeUnreserved = false) {
      if (input.indexOf("%") === -1) {
        return input;
      }
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decodeUnreserved && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        output += input[i];
      }
      return output;
    }
    function normalizePathEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decoded !== "." && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isPathCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function serializePathEncoding(input, pathNoScheme = false) {
      let output = "";
      let firstSegment = pathNoScheme && input[0] !== "/";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (ch === "/") {
          firstSegment = false;
        }
        if (isPathCharacter(ch) && (ch !== ":" || !firstSegment)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeComponent(input, isAllowed) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (isAllowed(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeUserinfo(input) {
      return encodeComponent(input, isUserinfoCharacter);
    }
    function encodeQuery(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function encodeFragment(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function isEscapeSafe(cp) {
      return cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 42 || cp === 43 || cp === 45 || cp === 46 || cp === 47 || cp === 64 || cp === 95;
    }
    function normalizeQueryFragmentEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isQueryFragmentCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function escapePreservingEscapes(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        output += escape(input[i]);
      }
      return output;
    }
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(encodeUserinfo(component.userinfo));
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = component.host;
        if (!isIPv4(host)) {
          let ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 !== true && ipV6res.isIPVFuture !== true) {
            host = normalizePercentEncoding(host, true);
            ipV6res = normalizeIPv6(host);
          }
          if (ipV6res.isIPV6 === true || ipV6res.isIPVFuture === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = reescapeHostDelimiters(host, false);
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        const port2 = String(component.port);
        if (!isPort(port2)) {
          throw new TypeError("URI port is malformed.");
        }
        uriTokens.push(":");
        uriTokens.push(port2);
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    module.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      reescapeHostDelimiters,
      normalizePercentEncoding,
      normalizePathEncoding,
      serializePathEncoding,
      normalizeQueryFragmentEncoding,
      encodeUserinfo,
      encodeQuery,
      encodeFragment,
      escapePreservingEscapes,
      removeDotSegments,
      removeDotSegmentsRelative,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/fast-uri/lib/schemes.js"(exports, module) {
    "use strict";
    var { isUUID } = require_utils();
    var URN_REG = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const queryIndex = wsComponent.resourceName.indexOf("?");
        const path = queryIndex === -1 ? wsComponent.resourceName : wsComponent.resourceName.slice(0, queryIndex);
        wsComponent.path = path && path !== "/" ? path : void 0;
        wsComponent.query = queryIndex === -1 ? void 0 : wsComponent.resourceName.slice(queryIndex + 1);
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches && matches[0] === urnComponent.path) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    var http = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    module.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/fast-uri/index.js
var require_fast_uri = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/fast-uri/index.js"(exports, module) {
    "use strict";
    var { normalizeIPv6, removeDotSegments, removeDotSegmentsRelative, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    var VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
    var MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
    var MALFORMED_HOST_ERROR = "URI host is malformed.";
    var FORBIDDEN_DOMAIN_HOST_CHARACTER = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
    function validateScheme(scheme) {
      const stringScheme = String(scheme);
      if (!VALID_SCHEME.test(stringScheme)) {
        throw new TypeError(MALFORMED_SCHEME_ERROR);
      }
      return stringScheme;
    }
    function normalize(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        normalizeString(uri, options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse(serialize(uri, options), options);
      }
      return uri;
    }
    function resolve2(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
      const {
        parsed: baseParsed,
        malformedAuthorityOrPort: baseMalformed,
        malformedPercentEncoding: baseMalformedPercentEncoding,
        malformedSchemeSpecific: baseMalformedSchemeSpecific,
        malformedHost: baseMalformedHost,
        malformedScheme: baseMalformedScheme
      } = parseWithStatus(baseURI, schemelessOptions);
      const {
        parsed: relativeParsed,
        malformedAuthorityOrPort: relativeMalformed,
        malformedPercentEncoding: relativeMalformedPercentEncoding,
        malformedSchemeSpecific: relativeMalformedSchemeSpecific,
        malformedHost: relativeMalformedHost,
        malformedScheme: relativeMalformedScheme
      } = parseWithStatus(relativeURI, schemelessOptions);
      if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) {
        throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
      }
      const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
      const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
      const resolvedHost = resolved.host;
      const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
      if (hasForbiddenDomainHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP)) {
        throw new Error(MALFORMED_HOST_ERROR);
      }
      canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
      const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !new RegExp("\\P{ASCII}", "u").test(resolvedHost);
      if (resolved.error && !encodedASCIIHost) {
        throw new Error(resolved.error);
      }
      schemelessOptions.skipEscape = true;
      return serialize(resolved, schemelessOptions);
    }
    function resolveComponent(base, relative, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base = parse(serialize(base, options), options);
        relative = parse(serialize(relative, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
      } else {
        if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (!relative.path) {
            target.path = base.path;
            if (relative.query !== void 0) {
              target.query = relative.query;
            } else {
              target.query = base.query;
            }
          } else {
            if (relative.path[0] === "/") {
              target.path = removeDotSegments(relative.path);
            } else {
              const baseHasAuthority = base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0;
              if (baseHasAuthority && !base.path) {
                target.path = "/" + relative.path;
              } else if (!base.path) {
                target.path = relative.path;
              } else {
                target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
              }
              target.path = base.scheme === void 0 && !baseHasAuthority && target.path[0] !== "/" ? removeDotSegmentsRelative(target.path) : removeDotSegments(target.path);
            }
            target.query = relative.query;
          }
          target.userinfo = base.userinfo;
          target.host = base.host;
          target.port = base.port;
        }
        target.scheme = base.scheme;
      }
      target.fragment = relative.fragment;
      return target;
    }
    function equal(uriA, uriB, options) {
      const normalizedA = normalizeComparableURI(uriA, options);
      const normalizedB = normalizeComparableURI(uriB, options);
      return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
    }
    function serialize(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      if (component.scheme) {
        component.scheme = validateScheme(component.scheme);
      }
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
      const schemelessReference = (component.scheme === void 0 || options.reference === "suffix") && !hasAuthority;
      const pathNoScheme = !options.skipEscape && schemelessReference;
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = serializePathEncoding(component.path, pathNoScheme);
        } else {
          component.path = normalizePercentEncoding(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        component.scheme = validateScheme(component.scheme);
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = schemelessReference && s[0] !== "/" ? removeDotSegmentsRelative(s) : removeDotSegments(s);
        }
        if (schemelessReference) {
          s = serializePathEncoding(s, true);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", encodeQuery(component.query));
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", encodeFragment(component.fragment));
      }
      return uriTokens.join("");
    }
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
    var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
    function getParseError(parsed, matches) {
      if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") {
        return 'URI path must start with "/" when authority is present.';
      }
      if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
        return "URI port is malformed.";
      }
      return void 0;
    }
    function hasMalformedPercentEncoding(component) {
      if (component === void 0) return false;
      let percent = component.indexOf("%");
      while (percent !== -1) {
        if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) {
          return true;
        }
        percent = component.indexOf("%", percent + 3);
      }
      return false;
    }
    function isIPLiteral(host) {
      return host[0] === "[" && host[host.length - 1] === "]";
    }
    function hasMalformedComponentPercentEncoding(matches) {
      const host = matches[4];
      return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !isIPLiteral(host) && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
    }
    function canonicalizeHost(parsed, options, schemeHandler, isIP) {
      if (hasForbiddenDomainHost(parsed, options, schemeHandler, isIP)) {
        parsed.error = parsed.error || MALFORMED_HOST_ERROR;
        return true;
      }
      if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
        let url;
        try {
          url = new URL("http://" + parsed.host);
        } catch (e) {
          parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
          return true;
        }
        if (!isHostOnlyURL(url)) {
          parsed.error = parsed.error || MALFORMED_HOST_ERROR;
          return true;
        }
        parsed.host = url.hostname;
      }
      return false;
    }
    function hasForbiddenDomainHost(parsed, options, schemeHandler, isIP) {
      return Boolean(
        parsed.host && isIP === false && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && FORBIDDEN_DOMAIN_HOST_CHARACTER.test(parsed.host)
      );
    }
    function isHostOnlyURL(url) {
      return url.username === "" && url.password === "" && url.port === "" && url.pathname === "/" && url.search === "" && url.hash === "" && url.hostname !== "";
    }
    function parseWithStatus(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let malformedAuthorityOrPort = false;
      let malformedPercentEncoding = false;
      let malformedSchemeSpecific = false;
      let malformedHost = false;
      let malformedIPLiteral = false;
      let malformedScheme = false;
      let isIP = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const authorityMatch = uri.match(AUTHORITY_PREFIX);
      if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
        parsed.error = "URI authority must not contain a literal backslash.";
        malformedAuthorityOrPort = true;
      }
      const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
      if (introducerMatch !== null) {
        const region = introducerMatch[1];
        const normalizedRegion = region.replace(/[\t\n\r]/g, "");
        if (normalizedRegion.length >= 2) {
          if (normalizedRegion.slice(0, 2) !== "//") {
            parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
            malformedAuthorityOrPort = true;
          } else if (region.length !== normalizedRegion.length) {
            parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
            malformedAuthorityOrPort = true;
          }
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (parsed.scheme !== void 0) {
          if (VALID_SCHEME.test(parsed.scheme)) {
            parsed.scheme = parsed.scheme.toLowerCase();
          } else {
            parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
            malformedScheme = true;
          }
        }
        malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
        if (malformedPercentEncoding) {
          parsed.error = parsed.error || "URI contains malformed percent-encoding.";
        }
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        const parseError = getParseError(parsed, matches);
        if (parseError !== void 0) {
          parsed.error = parsed.error || parseError;
          malformedAuthorityOrPort = true;
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const bracketedIPLiteral = isIPLiteral(parsed.host);
            const hasIPLiteralBracket = parsed.host.indexOf("[") !== -1 || parsed.host.indexOf("]") !== -1;
            const ipv6result = normalizeIPv6(parsed.host);
            isIP = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
            malformedIPLiteral = hasIPLiteralBracket && (!bracketedIPLiteral || ipv6result.error === true);
            parsed.host = isIP ? ipv6result.host : ipv6result.host.toLowerCase();
            if (malformedIPLiteral) {
              parsed.error = parsed.error || MALFORMED_HOST_ERROR;
              malformedAuthorityOrPort = true;
            }
          } else {
            isIP = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        if (!malformedIPLiteral) {
          malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP);
        }
        if (uri.indexOf("%") !== -1 && parsed.host !== void 0 && !malformedIPLiteral) {
          let host = isIP ? parsed.host : normalizePercentEncoding(parsed.host, true);
          if (!isIP) {
            host = normalizePercentEncoding(host.toLowerCase());
          }
          parsed.host = isIP || options.scheme !== "null" ? reescapeHostDelimiters(host, isIP) : host;
        }
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (parsed.path) {
            parsed.path = normalizePathEncoding(parsed.path);
          }
          if (parsed.query) {
            parsed.query = normalizeQueryFragmentEncoding(parsed.query);
          }
          if (parsed.fragment) {
            parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
          if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) {
            malformedSchemeSpecific = true;
          }
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme };
    }
    function parse(uri, opts) {
      return parseWithStatus(uri, opts).parsed;
    }
    function normalizeString(uri, opts) {
      return normalizeStringWithStatus(uri, opts).normalized;
    }
    function normalizeStringWithStatus(uri, opts) {
      const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
      return {
        normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize(parsed, opts),
        malformedAuthorityOrPort,
        malformedPercentEncoding,
        malformedSchemeSpecific,
        malformedHost,
        malformedScheme
      };
    }
    function normalizeComparableURI(uri, opts) {
      if (typeof uri !== "string" && typeof uri !== "object") {
        return void 0;
      }
      let value;
      try {
        value = typeof uri === "string" ? uri : serialize(uri, opts);
      } catch {
        return void 0;
      }
      const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
      return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
    }
    var fastUri = {
      SCHEMES,
      normalize,
      resolve: resolve2,
      resolveComponent,
      equal,
      serialize,
      parse
    };
    module.exports = fastUri;
    module.exports.default = fastUri;
    module.exports.fastUri = fastUri;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/runtime/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var uri = require_fast_uri();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags) => new RegExp(str, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = /* @__PURE__ */ Object.create(null);
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey2 = schemaKeyRef;
            this._cache.delete(cacheKey2);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text2, msg) => text2 + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema2 = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema2)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv.ValidationError = validation_error_1.default;
    Ajv.MissingRefError = ref_error_1.default;
    exports.default = Ajv;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js
var require_dynamicAnchor = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicAnchor = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicAnchor",
      schemaType: "string",
      code: (cxt) => dynamicAnchor(cxt, cxt.schema)
    };
    function dynamicAnchor(cxt, anchor) {
      const { gen, it } = cxt;
      it.schemaEnv.root.dynamicAnchors[anchor] = true;
      const v = (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`;
      const validate = it.errSchemaPath === "#" ? it.validateName : _getValidate(cxt);
      gen.if((0, codegen_1._)`!${v}`, () => gen.assign(v, validate));
    }
    exports.dynamicAnchor = dynamicAnchor;
    function _getValidate(cxt) {
      const { schemaEnv, schema, self } = cxt.it;
      const { root, baseId, localRefs, meta } = schemaEnv.root;
      const { schemaId } = self.opts;
      const sch = new compile_1.SchemaEnv({ schema, schemaId, root, baseId, localRefs, meta });
      compile_1.compileSchema.call(self, sch);
      return (0, ref_1.getValidate)(cxt, sch);
    }
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js
var require_dynamicRef = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicRef = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicRef",
      schemaType: "string",
      code: (cxt) => dynamicRef(cxt, cxt.schema)
    };
    function dynamicRef(cxt, ref) {
      const { gen, keyword, it } = cxt;
      if (ref[0] !== "#")
        throw new Error(`"${keyword}" only supports hash fragment reference`);
      const anchor = ref.slice(1);
      if (it.allErrors) {
        _dynamicRef();
      } else {
        const valid = gen.let("valid", false);
        _dynamicRef(valid);
        cxt.ok(valid);
      }
      function _dynamicRef(valid) {
        if (it.schemaEnv.root.dynamicAnchors[anchor]) {
          const v = gen.let("_v", (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
          gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
        } else {
          _callRef(it.validateName, valid)();
        }
      }
      function _callRef(validate, valid) {
        return valid ? () => gen.block(() => {
          (0, ref_1.callRef)(cxt, validate);
          gen.let(valid, true);
        }) : () => (0, ref_1.callRef)(cxt, validate);
      }
    }
    exports.dynamicRef = dynamicRef;
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js
var require_recursiveAnchor = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var util_1 = require_util();
    var def = {
      keyword: "$recursiveAnchor",
      schemaType: "boolean",
      code(cxt) {
        if (cxt.schema)
          (0, dynamicAnchor_1.dynamicAnchor)(cxt, "");
        else
          (0, util_1.checkStrictMode)(cxt.it, "$recursiveAnchor: false is ignored");
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js
var require_recursiveRef = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicRef_1 = require_dynamicRef();
    var def = {
      keyword: "$recursiveRef",
      schemaType: "string",
      code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema)
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/dynamic/index.js
var require_dynamic = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/dynamic/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var dynamicRef_1 = require_dynamicRef();
    var recursiveAnchor_1 = require_recursiveAnchor();
    var recursiveRef_1 = require_recursiveRef();
    var dynamic = [dynamicAnchor_1.default, dynamicRef_1.default, recursiveAnchor_1.default, recursiveRef_1.default];
    exports.default = dynamic;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/dependentRequired.js
var require_dependentRequired = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/dependentRequired.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentRequired",
      type: "object",
      schemaType: "object",
      error: dependencies_1.error,
      code: (cxt) => (0, dependencies_1.validatePropertyDeps)(cxt)
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js
var require_dependentSchemas = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentSchemas",
      type: "object",
      schemaType: "object",
      code: (cxt) => (0, dependencies_1.validateSchemaDeps)(cxt)
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/limitContains.js
var require_limitContains = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/validation/limitContains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["maxContains", "minContains"],
      type: "array",
      schemaType: "number",
      code({ keyword, parentSchema, it }) {
        if (parentSchema.contains === void 0) {
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "contains" is ignored`);
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/next.js
var require_next = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/next.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependentRequired_1 = require_dependentRequired();
    var dependentSchemas_1 = require_dependentSchemas();
    var limitContains_1 = require_limitContains();
    var next = [dependentRequired_1.default, dependentSchemas_1.default, limitContains_1.default];
    exports.default = next;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js
var require_unevaluatedProperties = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var error = {
      message: "must NOT have unevaluated properties",
      params: ({ params }) => (0, codegen_1._)`{unevaluatedProperty: ${params.unevaluatedProperty}}`
    };
    var def = {
      keyword: "unevaluatedProperties",
      type: "object",
      schemaType: ["boolean", "object"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, props } = it;
        if (props instanceof codegen_1.Name) {
          gen.if((0, codegen_1._)`${props} !== true`, () => gen.forIn("key", data, (key) => gen.if(unevaluatedDynamic(props, key), () => unevaluatedPropCode(key))));
        } else if (props !== true) {
          gen.forIn("key", data, (key) => props === void 0 ? unevaluatedPropCode(key) : gen.if(unevaluatedStatic(props, key), () => unevaluatedPropCode(key)));
        }
        it.props = true;
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function unevaluatedPropCode(key) {
          if (schema === false) {
            cxt.setParams({ unevaluatedProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (!(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            cxt.subschema({
              keyword: "unevaluatedProperties",
              dataProp: key,
              dataPropType: util_1.Type.Str
            }, valid);
            if (!allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          }
        }
        function unevaluatedDynamic(evaluatedProps, key) {
          return (0, codegen_1._)`!${evaluatedProps} || !${evaluatedProps}[${key}]`;
        }
        function unevaluatedStatic(evaluatedProps, key) {
          const ps = [];
          for (const p in evaluatedProps) {
            if (evaluatedProps[p] === true)
              ps.push((0, codegen_1._)`${key} !== ${p}`);
          }
          return (0, codegen_1.and)(...ps);
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js
var require_unevaluatedItems = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "unevaluatedItems",
      type: "array",
      schemaType: ["boolean", "object"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        const items = it.items || 0;
        if (items === true)
          return;
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        if (schema === false) {
          cxt.setParams({ len: items });
          cxt.fail((0, codegen_1._)`${len} > ${items}`);
        } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
          const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items}`);
          gen.if((0, codegen_1.not)(valid), () => validateItems(valid, items));
          cxt.ok(valid);
        }
        it.items = true;
        function validateItems(valid, from) {
          gen.forRange("i", from, len, (i) => {
            cxt.subschema({ keyword: "unevaluatedItems", dataProp: i, dataPropType: util_1.Type.Num }, valid);
            if (!it.allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/unevaluated/index.js
var require_unevaluated = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/unevaluated/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var unevaluatedProperties_1 = require_unevaluatedProperties();
    var unevaluatedItems_1 = require_unevaluatedItems();
    var unevaluated = [unevaluatedProperties_1.default, unevaluatedItems_1.default];
    exports.default = unevaluated;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format();
    var format = [format_1.default];
    exports.default = format;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/draft2020.js
var require_draft2020 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/draft2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var dynamic_1 = require_dynamic();
    var next_1 = require_next();
    var unevaluated_1 = require_unevaluated();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft2020Vocabularies = [
      dynamic_1.default,
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(true),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary,
      next_1.default,
      unevaluated_1.default
    ];
    exports.default = draft2020Vocabularies;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports.DiscrError = DiscrError = {}));
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
              if (sch === void 0)
                throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/schema.json
var require_schema = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/schema.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/schema",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/core": true,
        "https://json-schema.org/draft/2020-12/vocab/applicator": true,
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
        "https://json-schema.org/draft/2020-12/vocab/validation": true,
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true,
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
        "https://json-schema.org/draft/2020-12/vocab/content": true
      },
      $dynamicAnchor: "meta",
      title: "Core and Validation specifications meta-schema",
      allOf: [
        { $ref: "meta/core" },
        { $ref: "meta/applicator" },
        { $ref: "meta/unevaluated" },
        { $ref: "meta/validation" },
        { $ref: "meta/meta-data" },
        { $ref: "meta/format-annotation" },
        { $ref: "meta/content" }
      ],
      type: ["object", "boolean"],
      $comment: "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.",
      properties: {
        definitions: {
          $comment: '"definitions" has been replaced by "$defs".',
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          deprecated: true,
          default: {}
        },
        dependencies: {
          $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
          type: "object",
          additionalProperties: {
            anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }]
          },
          deprecated: true,
          default: {}
        },
        $recursiveAnchor: {
          $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
          $ref: "meta/core#/$defs/anchorString",
          deprecated: true
        },
        $recursiveRef: {
          $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
          $ref: "meta/core#/$defs/uriReferenceString",
          deprecated: true
        }
      }
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json
var require_applicator2 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/applicator",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/applicator": true
      },
      $dynamicAnchor: "meta",
      title: "Applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        prefixItems: { $ref: "#/$defs/schemaArray" },
        items: { $dynamicRef: "#meta" },
        contains: { $dynamicRef: "#meta" },
        additionalProperties: { $dynamicRef: "#meta" },
        properties: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependentSchemas: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          default: {}
        },
        propertyNames: { $dynamicRef: "#meta" },
        if: { $dynamicRef: "#meta" },
        then: { $dynamicRef: "#meta" },
        else: { $dynamicRef: "#meta" },
        allOf: { $ref: "#/$defs/schemaArray" },
        anyOf: { $ref: "#/$defs/schemaArray" },
        oneOf: { $ref: "#/$defs/schemaArray" },
        not: { $dynamicRef: "#meta" }
      },
      $defs: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $dynamicRef: "#meta" }
        }
      }
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json
var require_unevaluated2 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/unevaluated",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true
      },
      $dynamicAnchor: "meta",
      title: "Unevaluated applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        unevaluatedItems: { $dynamicRef: "#meta" },
        unevaluatedProperties: { $dynamicRef: "#meta" }
      }
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json
var require_content = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/content",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/content": true
      },
      $dynamicAnchor: "meta",
      title: "Content vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        contentEncoding: { type: "string" },
        contentMediaType: { type: "string" },
        contentSchema: { $dynamicRef: "#meta" }
      }
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json
var require_core3 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/core",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/core": true
      },
      $dynamicAnchor: "meta",
      title: "Core vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        $id: {
          $ref: "#/$defs/uriReferenceString",
          $comment: "Non-empty fragments not allowed.",
          pattern: "^[^#]*#?$"
        },
        $schema: { $ref: "#/$defs/uriString" },
        $ref: { $ref: "#/$defs/uriReferenceString" },
        $anchor: { $ref: "#/$defs/anchorString" },
        $dynamicRef: { $ref: "#/$defs/uriReferenceString" },
        $dynamicAnchor: { $ref: "#/$defs/anchorString" },
        $vocabulary: {
          type: "object",
          propertyNames: { $ref: "#/$defs/uriString" },
          additionalProperties: {
            type: "boolean"
          }
        },
        $comment: {
          type: "string"
        },
        $defs: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" }
        }
      },
      $defs: {
        anchorString: {
          type: "string",
          pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
        },
        uriString: {
          type: "string",
          format: "uri"
        },
        uriReferenceString: {
          type: "string",
          format: "uri-reference"
        }
      }
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json
var require_format_annotation = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/format-annotation",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true
      },
      $dynamicAnchor: "meta",
      title: "Format vocabulary meta-schema for annotation results",
      type: ["object", "boolean"],
      properties: {
        format: { type: "string" }
      }
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json
var require_meta_data = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/meta-data",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true
      },
      $dynamicAnchor: "meta",
      title: "Meta-data vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        deprecated: {
          type: "boolean",
          default: false
        },
        readOnly: {
          type: "boolean",
          default: false
        },
        writeOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        }
      }
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json
var require_validation2 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/validation",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/validation": true
      },
      $dynamicAnchor: "meta",
      title: "Validation vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        type: {
          anyOf: [
            { $ref: "#/$defs/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/$defs/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        const: true,
        enum: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/$defs/nonNegativeInteger" },
        minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        maxItems: { $ref: "#/$defs/nonNegativeInteger" },
        minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        maxContains: { $ref: "#/$defs/nonNegativeInteger" },
        minContains: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 1
        },
        maxProperties: { $ref: "#/$defs/nonNegativeInteger" },
        minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        required: { $ref: "#/$defs/stringArray" },
        dependentRequired: {
          type: "object",
          additionalProperties: {
            $ref: "#/$defs/stringArray"
          }
        }
      },
      $defs: {
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 0
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      }
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/index.js
var require_json_schema_2020_12 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-2020-12/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var metaSchema = require_schema();
    var applicator = require_applicator2();
    var unevaluated = require_unevaluated2();
    var content = require_content();
    var core = require_core3();
    var format = require_format_annotation();
    var metadata = require_meta_data();
    var validation = require_validation2();
    var META_SUPPORT_DATA = ["/properties"];
    function addMetaSchema2020($data) {
      ;
      [
        metaSchema,
        applicator,
        unevaluated,
        content,
        core,
        with$data(this, format),
        metadata,
        with$data(this, validation)
      ].forEach((sch) => this.addMetaSchema(sch, void 0, false));
      return this;
      function with$data(ajv3, sch) {
        return $data ? ajv3.$dataMetaSchema(sch, META_SUPPORT_DATA) : sch;
      }
    }
    exports.default = addMetaSchema2020;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/2020.js
var require__ = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/2020.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv2020 = void 0;
    var core_1 = require_core();
    var draft2020_1 = require_draft2020();
    var discriminator_1 = require_discriminator();
    var json_schema_2020_12_1 = require_json_schema_2020_12();
    var META_SCHEMA_ID = "https://json-schema.org/draft/2020-12/schema";
    var Ajv20204 = class extends core_1.default {
      constructor(opts = {}) {
        super({
          ...opts,
          dynamicRef: true,
          next: true,
          unevaluated: true
        });
      }
      _addVocabularies() {
        super._addVocabularies();
        draft2020_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data, meta } = this.opts;
        if (!meta)
          return;
        json_schema_2020_12_1.default.call(this, $data);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv2020 = Ajv20204;
    module.exports = exports = Ajv20204;
    module.exports.Ajv2020 = Ajv20204;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv20204;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv-formats/dist/formats.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
    function fmtDef(validate, compare) {
      return { validate, compare };
    }
    exports.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: fmtDef(date, compareDate),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: fmtDef(getTime(true), compareTime),
      "date-time": fmtDef(getDateTime(true), compareDateTime),
      "iso-time": fmtDef(getTime(), compareIsoTime),
      "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte,
      // signed 32 bit integer
      int32: { type: "number", validate: validateInt32 },
      // signed 64 bit integer
      int64: { type: "number", validate: validateInt64 },
      // C-type float
      float: { type: "number", validate: validateNumber },
      // C-type double
      double: { type: "number", validate: validateNumber },
      // hint to the UI to hide input strings
      password: true,
      // unchecked string payload
      binary: true
    };
    exports.fastFormats = {
      ...exports.fullFormats,
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
      "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
      "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
      "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    exports.formatNames = Object.keys(exports.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date(str) {
      const matches = DATE.exec(str);
      if (!matches)
        return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    function compareDate(d1, d2) {
      if (!(d1 && d2))
        return void 0;
      if (d1 > d2)
        return 1;
      if (d1 < d2)
        return -1;
      return 0;
    }
    var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function getTime(strictTimeZone) {
      return function time(str) {
        const matches = TIME.exec(str);
        if (!matches)
          return false;
        const hr = +matches[1];
        const min = +matches[2];
        const sec = +matches[3];
        const tz = matches[4];
        const tzSign = matches[5] === "-" ? -1 : 1;
        const tzH = +(matches[6] || 0);
        const tzM = +(matches[7] || 0);
        if (tzH > 23 || tzM > 59 || strictTimeZone && !tz)
          return false;
        if (hr <= 23 && min <= 59 && sec < 60)
          return true;
        const utcMin = min - tzM * tzSign;
        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
      };
    }
    function compareTime(s1, s2) {
      if (!(s1 && s2))
        return void 0;
      const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
      const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
      if (!(t1 && t2))
        return void 0;
      return t1 - t2;
    }
    function compareIsoTime(t1, t2) {
      if (!(t1 && t2))
        return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2))
        return void 0;
      t1 = a1[1] + a1[2] + a1[3];
      t2 = a2[1] + a2[2] + a2[3];
      if (t1 > t2)
        return 1;
      if (t1 < t2)
        return -1;
      return 0;
    }
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function getDateTime(strictTimeZone) {
      const time = getTime(strictTimeZone);
      return function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
      };
    }
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const d1 = new Date(dt1).valueOf();
      const d2 = new Date(dt2).valueOf();
      if (!(d1 && d2))
        return void 0;
      return d1 - d2;
    }
    function compareIsoDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0)
        return void 0;
      return res || compareTime(t1, t2);
    }
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    function validateNumber() {
      return true;
    }
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str))
        return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module) {
    module.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv/dist/ajv.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv = Ajv;
    module.exports = exports = Ajv;
    module.exports.Ajv = Ajv;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv-formats/dist/limit.js
var require_limit = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv-formats/dist/limit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatLimitDefinition = void 0;
    var ajv_1 = require_ajv();
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    exports.formatLimitDefinition = {
      keyword: Object.keys(KWDs),
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, keyword, it } = cxt;
        const { opts, self } = it;
        if (!opts.validateFormats)
          return;
        const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
        if (fCxt.$data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
          cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
        }
        function validateFormat() {
          const format = fCxt.schema;
          const fmtDef = self.formats[format];
          if (!fmtDef || fmtDef === true)
            return;
          if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") {
            throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
          }
          const fmt = gen.scopeValue("formats", {
            key: format,
            ref: fmtDef,
            code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : void 0
          });
          cxt.fail$data(compareCode(fmt));
        }
        function compareCode(fmt) {
          return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    var formatLimitPlugin = (ajv3) => {
      ajv3.addKeyword(exports.formatLimitDefinition);
      return ajv3;
    };
    exports.default = formatLimitPlugin;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv-formats/dist/index.js
var require_dist = __commonJS({
  "../../usr/local/lib/node_modules/@iskra/apps/node_modules/ajv-formats/dist/index.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var formats_1 = require_formats();
    var limit_1 = require_limit();
    var codegen_1 = require_codegen();
    var fullName = new codegen_1.Name("fullFormats");
    var fastName = new codegen_1.Name("fastFormats");
    var formatsPlugin = (ajv3, opts = { keywords: true }) => {
      if (Array.isArray(opts)) {
        addFormats2(ajv3, opts, formats_1.fullFormats, fullName);
        return ajv3;
      }
      const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
      const list = opts.formats || formats_1.formatNames;
      addFormats2(ajv3, list, formats, exportName);
      if (opts.keywords)
        (0, limit_1.default)(ajv3);
      return ajv3;
    };
    formatsPlugin.get = (name, mode = "full") => {
      const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
      const f = formats[name];
      if (!f)
        throw new Error(`Unknown format "${name}"`);
      return f;
    };
    function addFormats2(ajv3, list, fs, exportName) {
      var _a;
      var _b;
      (_a = (_b = ajv3.opts.code).formats) !== null && _a !== void 0 ? _a : _b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`;
      for (const f of list)
        ajv3.addFormat(f, fs[f]);
    }
    module.exports = exports = formatsPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = formatsPlugin;
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/@hono/node-server/dist/constants-BLSFu_RU.mjs
var X_ALREADY_SENT = "x-hono-already-sent";

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/@hono/node-server/dist/index.mjs
import { STATUS_CODES, ServerResponse, createServer } from "node:http";
import { Http2ServerRequest, constants } from "node:http2";
import { Readable } from "node:stream";

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/helper/websocket/index.js
var defineWebSocketHelper = (handler) => {
  return ((...args) => {
    if (typeof args[0] === "function") {
      const [createEvents, options] = args;
      return async function upgradeWebSocket2(c, next) {
        const result = await handler(c, await createEvents(c), options);
        if (result) return result;
        await next();
      };
    } else {
      const [c, events, options] = args;
      return (async () => {
        const upgraded = await handler(c, events, options);
        if (!upgraded) throw new Error("Failed to upgrade WebSocket");
        return upgraded;
      })();
    }
  });
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/@hono/node-server/dist/index.mjs
var RequestError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "RequestError";
  }
};
var nonJoinedHeaders = /* @__PURE__ */ new Set([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "server",
  "user-agent"
]);
var validHeaderName = /^[!#$%&'*+\-.^_`|~\dA-Za-z]+$/;
var isHttpWhitespace = (code) => code === 9 || code === 10 || code === 13 || code === 32;
var normalizeHeaderValue = (value) => {
  if (!isHttpWhitespace(value.charCodeAt(0)) && !isHttpWhitespace(value.charCodeAt(value.length - 1))) return value;
  let start = 0;
  let end = value.length;
  while (start < end && isHttpWhitespace(value.charCodeAt(start))) start++;
  while (end > start && isHttpWhitespace(value.charCodeAt(end - 1))) end--;
  return value.slice(start, end);
};
var forbiddenHeaderValue = /[\0\r\n]/;
var GlobalHeaders = globalThis.Headers;
var materializeHeaders = (rawHeaders, HeadersCtor = GlobalHeaders) => {
  const headers = new HeadersCtor();
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const name = rawHeaders[i];
    if (!name.startsWith(":")) headers.append(name, rawHeaders[i + 1]);
  }
  return headers;
};
var RequestHeaders = class {
  #incoming;
  #rawHeaders;
  #headers;
  #invalidValue;
  constructor(incoming) {
    this.#incoming = incoming;
    if (incoming instanceof Http2ServerRequest) this.#rawHeaders = incoming.rawHeaders.slice();
  }
  get #lazyRawHeaders() {
    return this.#rawHeaders ??= this.#incoming.rawHeaders.slice();
  }
  get #native() {
    if (!this.#headers) {
      this.#headers = materializeHeaders(this.#lazyRawHeaders);
      this.#rawHeaders = void 0;
    }
    return this.#headers;
  }
  #normalizedName(name) {
    if (typeof name !== "string") return;
    if (!validHeaderName.test(name)) throw new TypeError(`Invalid header name: ${name}`);
    return name.toLowerCase();
  }
  #lookupHttp1(lowerName) {
    const headers = this.#incoming instanceof Http2ServerRequest ? void 0 : this.#incoming.headers;
    if (!headers || nonJoinedHeaders.has(lowerName) || lowerName === "set-cookie" || lowerName === "__proto__") return;
    if (!Object.hasOwn(headers, lowerName)) return null;
    const rawValue = headers[lowerName];
    if (typeof rawValue === "string") {
      const value = normalizeHeaderValue(rawValue);
      return forbiddenHeaderValue.test(value) ? void 0 : value;
    }
  }
  #lookup(rawHeaders, lowerName) {
    const separator = lowerName === "cookie" ? "; " : ", ";
    let value = null;
    for (let i = 0; i < rawHeaders.length; i += 2) {
      const rawName = rawHeaders[i];
      if (rawName.length === lowerName.length && rawName.toLowerCase() === lowerName) {
        const rawValue = normalizeHeaderValue(rawHeaders[i + 1]);
        if (forbiddenHeaderValue.test(rawValue)) {
          this.#invalidValue = true;
          return;
        }
        value = value === null ? rawValue : value + separator + rawValue;
      }
    }
    return value;
  }
  append(name, value) {
    this.#native.append(name, value);
  }
  delete(name) {
    this.#native.delete(name);
  }
  get(name) {
    const lowerName = this.#normalizedName(name);
    if (lowerName && !this.#headers && !this.#invalidValue) {
      const http1Value = this.#lookupHttp1(lowerName);
      if (http1Value !== void 0) return http1Value;
      const value = this.#lookup(this.#lazyRawHeaders, lowerName);
      if (value !== void 0) return value;
    }
    return this.#native.get(name);
  }
  has(name) {
    const lowerName = this.#normalizedName(name);
    if (lowerName && !this.#headers && !this.#invalidValue) {
      const http1Value = this.#lookupHttp1(lowerName);
      if (http1Value !== void 0) return http1Value !== null;
      const value = this.#lookup(this.#lazyRawHeaders, lowerName);
      if (value !== void 0) return value !== null;
    }
    return this.#native.has(name);
  }
  set(name, value) {
    this.#native.set(name, value);
  }
  getSetCookie() {
    return this.#native.getSetCookie();
  }
  keys() {
    return this.#native.keys();
  }
  values() {
    return this.#native.values();
  }
  entries() {
    return this.#native.entries();
  }
  forEach(callback, thisArg) {
    this.#native.forEach((value, key) => {
      callback.call(thisArg, value, key, this);
    });
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};
Object.defineProperty(RequestHeaders.prototype, /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), { value: function(depth, options, inspectFn) {
  return `Headers (lightweight) ${inspectFn(Object.fromEntries(this), {
    ...options,
    depth: depth == null ? null : depth - 1
  })}`;
} });
Object.setPrototypeOf(RequestHeaders.prototype, GlobalHeaders.prototype);
var newHeadersFromIncoming = (incoming) => globalThis.Headers === GlobalHeaders ? new RequestHeaders(incoming) : materializeHeaders(incoming.rawHeaders, globalThis.Headers);
var reValidRequestUrl = /^\/[!#$&-;=?-\[\]_a-z~]*$/;
var reDotSegment = /\/\.\.?(?:[/?#]|$)/;
var reValidHost = /^[a-z0-9._-]+(?::(?:[1-5]\d{3,4}|[6-9]\d{3}))?$/;
var validateRequestTarget = (target) => {
  const backslash = target.indexOf("\\");
  if (backslash !== -1) {
    const query = target.indexOf("?");
    if (query === -1 || backslash < query) throw new RequestError("Backslash in request path");
  }
};
var buildUrl = (scheme, host, incomingUrl) => {
  const url = `${scheme}://${host}${incomingUrl}`;
  if (!reValidHost.test(host)) {
    validateRequestTarget(incomingUrl);
    const urlObj = new URL(url);
    if (urlObj.hostname.length !== host.length && urlObj.hostname !== (host.includes(":") ? host.replace(/:\d+$/, "") : host).toLowerCase()) throw new RequestError("Invalid host header");
    return urlObj.href;
  } else if (incomingUrl.length === 0) return url + "/";
  else {
    if (incomingUrl.charCodeAt(0) !== 47) throw new RequestError("Invalid URL");
    if (!reValidRequestUrl.test(incomingUrl) || reDotSegment.test(incomingUrl)) {
      validateRequestTarget(incomingUrl);
      return new URL(url).href;
    }
    return url;
  }
};
var toRequestError = (e) => {
  if (e instanceof RequestError) return e;
  return new RequestError(e.message, { cause: e });
};
var GlobalRequest = global.Request;
var Request$1 = class extends GlobalRequest {
  constructor(input, options) {
    if (typeof input === "object" && getRequestCache in input) {
      const hasReplacementBody = options !== void 0 && "body" in options && options.body != null;
      if (input[bodyConsumedDirectlyKey] && !hasReplacementBody) throw new TypeError("Cannot construct a Request with a Request object that has already been used.");
      input = input[getRequestCache]();
    }
    if (typeof options?.body?.getReader !== "undefined") options.duplex ??= "half";
    super(input, options);
  }
};
var wrapBodyStream = /* @__PURE__ */ Symbol("wrapBodyStream");
var byteExactEncodings = /* @__PURE__ */ new Set([
  "latin1",
  "binary",
  "hex",
  "base64",
  "base64url"
]);
var isByteExactEncoding = (encoding) => encoding === null || byteExactEncodings.has(encoding);
var bodyBufferedBeforeDisconnectKey = /* @__PURE__ */ Symbol("bodyBufferedBeforeDisconnect");
var bodyBufferedLengthBeforeDisconnectKey = /* @__PURE__ */ Symbol("bodyBufferedLengthBeforeDisconnect");
var toBufferChunk = (chunk, encoding) => Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding ?? "utf8");
var isRecoverableDisconnectedIncoming = (incoming) => !(incoming instanceof Http2ServerRequest) && !!incoming.complete && !!incoming.readableAborted && typeof incoming.read === "function" && isByteExactEncoding(incoming.readableEncoding);
var recordBodyBufferedBeforeDisconnect = (incoming) => {
  if (incoming.readableDidRead || !isRecoverableDisconnectedIncoming(incoming)) return;
  const incomingWithRecovery = incoming;
  incomingWithRecovery[bodyBufferedLengthBeforeDisconnectKey] ??= incoming.readableLength;
};
var readBodyBufferedBeforeDisconnect = (incoming, chunks) => {
  if (incoming.readableDidRead && !chunks || !isRecoverableDisconnectedIncoming(incoming)) return;
  const incomingWithRecovery = incoming;
  if (incomingWithRecovery[bodyBufferedBeforeDisconnectKey] !== void 0) return incomingWithRecovery[bodyBufferedBeforeDisconnectKey];
  let result;
  const errored = incoming.errored;
  if (errored && errored.code !== "ECONNRESET") result = errored;
  else if (incomingWithRecovery[bodyBufferedLengthBeforeDisconnectKey] !== void 0 && incoming.readableLength !== incomingWithRecovery[bodyBufferedLengthBeforeDisconnectKey]) result = newBodyUnusableError();
  else {
    const bodyChunks = chunks ?? [];
    const chunk = incoming.read();
    if (chunk !== null) bodyChunks.push(toBufferChunk(chunk, incoming.readableEncoding));
    const buffer = bodyChunks.length === 1 ? bodyChunks[0] : Buffer.concat(bodyChunks);
    result = buffer;
    const contentLength = incoming.headers["content-length"];
    if (typeof contentLength === "string" && /^\d+$/.test(contentLength)) {
      const expectedLength = Number(contentLength);
      if (Number.isSafeInteger(expectedLength) && buffer.length !== expectedLength) result = newBodyUnusableError();
    }
  }
  incomingWithRecovery[bodyBufferedBeforeDisconnectKey] = result;
  return result;
};
var enqueueBufferedBody = (controller, buffered) => {
  if (buffered instanceof Error) {
    controller.error(buffered);
    return;
  }
  if (buffered.length > 0) controller.enqueue(buffered);
  controller.close();
};
var newRequestFromIncoming = (method, url, headers, incoming, abortController) => {
  const init = {
    method,
    headers,
    signal: abortController.signal
  };
  if (method === "TRACE") {
    init.method = "GET";
    const req = new Request$1(url, init);
    Object.defineProperty(req, "method", { get() {
      return "TRACE";
    } });
    return req;
  }
  if (!(method === "GET" || method === "HEAD")) if ("rawBody" in incoming && incoming.rawBody instanceof Buffer) init.body = new ReadableStream({ start(controller) {
    controller.enqueue(incoming.rawBody);
    controller.close();
  } });
  else if (incoming[wrapBodyStream]) {
    let reader;
    init.body = new ReadableStream({ async pull(controller) {
      try {
        if (!reader) {
          const buffered = readBodyBufferedBeforeDisconnect(incoming);
          if (buffered !== void 0) {
            enqueueBufferedBody(controller, buffered);
            return;
          }
        }
        reader ||= Readable.toWeb(incoming).getReader();
        const { done, value } = await reader.read();
        if (done) controller.close();
        else controller.enqueue(value);
      } catch (error) {
        controller.error(error);
      }
    } });
  } else {
    const buffered = readBodyBufferedBeforeDisconnect(incoming);
    if (buffered !== void 0) init.body = new ReadableStream({ start(controller) {
      enqueueBufferedBody(controller, buffered);
    } });
    else init.body = Readable.toWeb(incoming);
  }
  return new Request$1(url, init);
};
var getRequestCache = /* @__PURE__ */ Symbol("getRequestCache");
var requestCache = /* @__PURE__ */ Symbol("requestCache");
var incomingKey = /* @__PURE__ */ Symbol("incomingKey");
var urlKey = /* @__PURE__ */ Symbol("urlKey");
var methodKey = /* @__PURE__ */ Symbol("methodKey");
var headersKey = /* @__PURE__ */ Symbol("headersKey");
var abortControllerKey = /* @__PURE__ */ Symbol("abortControllerKey");
var getAbortController = /* @__PURE__ */ Symbol("getAbortController");
var abortRequest = /* @__PURE__ */ Symbol("abortRequest");
var bodyBufferKey = /* @__PURE__ */ Symbol("bodyBuffer");
var bodyReadPromiseKey = /* @__PURE__ */ Symbol("bodyReadPromise");
var bodyConsumedDirectlyKey = /* @__PURE__ */ Symbol("bodyConsumedDirectly");
var bodyLockReaderKey = /* @__PURE__ */ Symbol("bodyLockReader");
var abortReasonKey = /* @__PURE__ */ Symbol("abortReason");
var newBodyUnusableError = () => {
  return /* @__PURE__ */ new TypeError("Body is unusable");
};
var rejectBodyUnusable = () => {
  return Promise.reject(newBodyUnusableError());
};
var textDecoder = new TextDecoder();
var consumeBodyDirectOnce = (request) => {
  if (request[bodyConsumedDirectlyKey]) return rejectBodyUnusable();
  request[bodyConsumedDirectlyKey] = true;
};
var toArrayBuffer = (buf) => {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
};
var contentType = (request) => {
  return (request[headersKey] ||= newHeadersFromIncoming(request[incomingKey])).get("content-type") || "";
};
var methodTokenRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var normalizeIncomingMethod = (method) => {
  if (typeof method !== "string" || method.length === 0) return "GET";
  switch (method) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "PATCH":
    case "POST":
    case "PUT":
    case "QUERY":
      return method;
  }
  const upper = method.toUpperCase();
  switch (upper) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "POST":
    case "PUT":
      return upper;
    default:
      return method;
  }
};
var validateDirectReadMethod = (method) => {
  if (!methodTokenRegExp.test(method)) return /* @__PURE__ */ new TypeError(`'${method}' is not a valid HTTP method.`);
  const normalized = method.toUpperCase();
  if (normalized === "CONNECT" || normalized === "TRACK" || normalized === "TRACE" && method !== "TRACE") return /* @__PURE__ */ new TypeError(`'${method}' HTTP method is unsupported.`);
};
var readBodyWithFastPath = (request, method, fromBuffer) => {
  if (request[bodyConsumedDirectlyKey]) return rejectBodyUnusable();
  const methodName = request.method;
  if (methodName === "GET" || methodName === "HEAD") return request[getRequestCache]()[method]();
  const methodValidationError = validateDirectReadMethod(methodName);
  if (methodValidationError) return Promise.reject(methodValidationError);
  if (request[requestCache]) {
    if (methodName !== "TRACE") return request[requestCache][method]();
  }
  const alreadyUsedError = consumeBodyDirectOnce(request);
  if (alreadyUsedError) return alreadyUsedError;
  const raw2 = readRawBodyIfAvailable(request);
  if (raw2) {
    const result = Promise.resolve(fromBuffer(raw2, request));
    request[bodyBufferKey] = void 0;
    return result;
  }
  return readBodyDirect(request).then((buf) => {
    const result = fromBuffer(buf, request);
    request[bodyBufferKey] = void 0;
    return result;
  });
};
var readRawBodyIfAvailable = (request) => {
  const incoming = request[incomingKey];
  if ("rawBody" in incoming && incoming.rawBody instanceof Buffer) return incoming.rawBody;
};
var normalizeAbortError = (request, incoming) => {
  if (incoming.errored) return incoming.errored;
  const reason = request[abortReasonKey];
  if (reason !== void 0) return reason instanceof Error ? reason : new Error(String(reason));
  return /* @__PURE__ */ new Error("Client connection prematurely closed.");
};
var readBodyDirect = (request) => {
  if (request[bodyBufferKey]) return Promise.resolve(request[bodyBufferKey]);
  if (request[bodyReadPromiseKey]) return request[bodyReadPromiseKey];
  const incoming = request[incomingKey];
  if (incoming.readableDidRead) return rejectBodyUnusable();
  const buffered = readBodyBufferedBeforeDisconnect(incoming);
  if (buffered !== void 0) {
    if (buffered instanceof Error) return Promise.reject(buffered);
    request[bodyBufferKey] = buffered;
    return Promise.resolve(buffered);
  }
  const promise = new Promise((resolve2, reject) => {
    const chunks = [];
    let settled = false;
    const finish = (callback) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };
    const recoverCompleteBodyAfterDisconnect = (error) => {
      const streamError = incoming.errored ?? error;
      if (!isRecoverableDisconnectedIncoming(incoming) || streamError && streamError.code !== "ECONNRESET") return false;
      finish(() => {
        const recovered = readBodyBufferedBeforeDisconnect(incoming, chunks);
        if (recovered instanceof Error) reject(recovered);
        else if (recovered === void 0) reject(error ?? normalizeAbortError(request, incoming));
        else {
          request[bodyBufferKey] = recovered;
          resolve2(recovered);
        }
      });
      return true;
    };
    const onData = (chunk) => {
      chunks.push(toBufferChunk(chunk, incoming.readableEncoding));
    };
    const onEnd = () => {
      finish(() => {
        const buffer = chunks.length === 1 ? chunks[0] : Buffer.concat(chunks);
        request[bodyBufferKey] = buffer;
        resolve2(buffer);
      });
    };
    const onError = (error) => {
      if (recoverCompleteBodyAfterDisconnect(error)) return;
      finish(() => {
        reject(error);
      });
    };
    const onClose = () => {
      if (incoming.readableEnded) {
        onEnd();
        return;
      }
      if (recoverCompleteBodyAfterDisconnect()) return;
      finish(() => {
        reject(normalizeAbortError(request, incoming));
      });
    };
    const cleanup = () => {
      incoming.off("data", onData);
      incoming.off("end", onEnd);
      incoming.off("error", onError);
      incoming.off("close", onClose);
      request[bodyReadPromiseKey] = void 0;
    };
    incoming.on("data", onData);
    incoming.on("end", onEnd);
    incoming.on("error", onError);
    incoming.on("close", onClose);
    queueMicrotask(() => {
      if (settled) return;
      if (incoming.readableEnded) onEnd();
      else if (incoming.errored) onError(incoming.errored);
      else if (incoming.destroyed) onClose();
    });
  });
  request[bodyReadPromiseKey] = promise;
  return promise;
};
var requestPrototype = {
  get method() {
    return this[methodKey];
  },
  get url() {
    return this[urlKey];
  },
  get headers() {
    return this[headersKey] ||= newHeadersFromIncoming(this[incomingKey]);
  },
  [abortRequest](reason) {
    if (this[abortReasonKey] === void 0) this[abortReasonKey] = reason;
    const abortController = this[abortControllerKey];
    if (abortController && !abortController.signal.aborted) abortController.abort(reason);
  },
  [getAbortController]() {
    this[abortControllerKey] ||= new AbortController();
    if (this[abortReasonKey] !== void 0 && !this[abortControllerKey].signal.aborted) this[abortControllerKey].abort(this[abortReasonKey]);
    return this[abortControllerKey];
  },
  [getRequestCache]() {
    const abortController = this[getAbortController]();
    if (this[requestCache]) return this[requestCache];
    const method = this.method;
    if (this[bodyConsumedDirectlyKey] && !(method === "GET" || method === "HEAD")) {
      this[bodyBufferKey] = void 0;
      const init = {
        method: method === "TRACE" ? "GET" : method,
        headers: this.headers,
        signal: abortController.signal
      };
      if (method !== "TRACE") {
        init.body = new ReadableStream({ start(c) {
          c.close();
        } });
        init.duplex = "half";
      }
      const req = new Request$1(this[urlKey], init);
      if (method === "TRACE") Object.defineProperty(req, "method", { get() {
        return "TRACE";
      } });
      return this[requestCache] = req;
    }
    return this[requestCache] = newRequestFromIncoming(this.method, this[urlKey], this.headers, this[incomingKey], abortController);
  },
  get body() {
    if (!this[bodyConsumedDirectlyKey]) return this[getRequestCache]().body;
    const request = this[getRequestCache]();
    if (!this[bodyLockReaderKey] && request.body) this[bodyLockReaderKey] = request.body.getReader();
    return request.body;
  },
  get bodyUsed() {
    if (this[bodyConsumedDirectlyKey]) return true;
    if (this[requestCache]) return this[requestCache].bodyUsed;
    return false;
  }
};
Object.defineProperty(requestPrototype, "signal", { get() {
  return this[getAbortController]().signal;
} });
[
  "cache",
  "credentials",
  "destination",
  "integrity",
  "mode",
  "redirect",
  "referrer",
  "referrerPolicy",
  "keepalive"
].forEach((k) => {
  Object.defineProperty(requestPrototype, k, { get() {
    return this[getRequestCache]()[k];
  } });
});
["clone", "formData"].forEach((k) => {
  Object.defineProperty(requestPrototype, k, { value: function() {
    if (this[bodyConsumedDirectlyKey]) {
      if (k === "clone") throw newBodyUnusableError();
      return rejectBodyUnusable();
    }
    return this[getRequestCache]()[k]();
  } });
});
Object.defineProperty(requestPrototype, "text", { value: function() {
  return readBodyWithFastPath(this, "text", (buf) => textDecoder.decode(buf));
} });
Object.defineProperty(requestPrototype, "arrayBuffer", { value: function() {
  return readBodyWithFastPath(this, "arrayBuffer", (buf) => toArrayBuffer(buf));
} });
Object.defineProperty(requestPrototype, "blob", { value: function() {
  return readBodyWithFastPath(this, "blob", (buf, request) => {
    const type = contentType(request);
    const init = type ? { headers: { "content-type": type } } : void 0;
    return new Response(buf, init).blob();
  });
} });
Object.defineProperty(requestPrototype, "json", { value: function() {
  if (this[bodyConsumedDirectlyKey]) return rejectBodyUnusable();
  return this.text().then(JSON.parse);
} });
Object.defineProperty(requestPrototype, /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), { value: function(depth, options, inspectFn) {
  return `Request (lightweight) ${inspectFn({
    method: this.method,
    url: this.url,
    headers: this.headers,
    nativeRequest: this[requestCache]
  }, {
    ...options,
    depth: depth == null ? null : depth - 1
  })}`;
} });
Object.setPrototypeOf(requestPrototype, Request$1.prototype);
var newRequest = (incoming, defaultHostname) => {
  const req = Object.create(requestPrototype);
  req[incomingKey] = incoming;
  req[methodKey] = normalizeIncomingMethod(incoming.method);
  const incomingUrl = incoming.url || "";
  if (incomingUrl[0] !== "/" && (incomingUrl.startsWith("http://") || incomingUrl.startsWith("https://"))) {
    if (incoming instanceof Http2ServerRequest) throw new RequestError("Absolute URL for :path is not allowed in HTTP/2");
    try {
      validateRequestTarget(incomingUrl);
      req[urlKey] = new URL(incomingUrl).href;
    } catch (e) {
      throw new RequestError("Invalid absolute URL", { cause: e });
    }
    return req;
  }
  const host = (incoming instanceof Http2ServerRequest ? incoming.authority : incoming.headers.host) || defaultHostname;
  if (!host) throw new RequestError("Missing host header");
  let scheme;
  if (incoming instanceof Http2ServerRequest) {
    scheme = incoming.scheme;
    if (!(scheme === "http" || scheme === "https")) throw new RequestError("Unsupported scheme");
  } else scheme = incoming.socket && incoming.socket.encrypted ? "https" : "http";
  try {
    req[urlKey] = buildUrl(scheme, host, incomingUrl);
  } catch (e) {
    if (e instanceof RequestError) throw e;
    else throw new RequestError("Invalid URL", { cause: e });
  }
  return req;
};
var defaultContentType = "text/plain; charset=UTF-8";
var responseCache = /* @__PURE__ */ Symbol("responseCache");
var getResponseCache = /* @__PURE__ */ Symbol("getResponseCache");
var cacheKey = /* @__PURE__ */ Symbol("cache");
var GlobalResponse = global.Response;
var Response$1 = class Response$12 {
  #body;
  #init;
  [getResponseCache]() {
    const cache = this[cacheKey];
    const liveHeaders = cache && cache[2] instanceof Headers ? cache[2] : void 0;
    delete this[cacheKey];
    return this[responseCache] ||= new GlobalResponse(this.#body, liveHeaders ? {
      status: this.#init?.status,
      statusText: this.#init?.statusText,
      headers: liveHeaders
    } : this.#init);
  }
  constructor(body, init) {
    let headers;
    this.#body = body;
    if (init instanceof GlobalResponse) {
      const cachedGlobalResponse = init[responseCache];
      if (cachedGlobalResponse) {
        this.#init = cachedGlobalResponse;
        this[getResponseCache]();
        return;
      }
      this.#init = init instanceof Response$12 ? init.#init : init;
      headers = new Headers(init.headers);
    } else this.#init = init;
    if (body == null || typeof body === "string" || typeof body?.getReader !== "undefined" || body instanceof Blob || body instanceof Uint8Array) this[cacheKey] = [
      init?.status || 200,
      body ?? null,
      headers || init?.headers
    ];
  }
  get headers() {
    const cache = this[cacheKey];
    if (cache) {
      if (!(cache[2] instanceof Headers)) cache[2] = new Headers(cache[2] || (cache[1] === null ? void 0 : { "content-type": defaultContentType }));
      return cache[2];
    }
    return this[getResponseCache]().headers;
  }
  get status() {
    return this[cacheKey]?.[0] ?? this[getResponseCache]().status;
  }
  get ok() {
    const status = this.status;
    return status >= 200 && status < 300;
  }
};
[
  "body",
  "bodyUsed",
  "redirected",
  "statusText",
  "trailers",
  "type",
  "url"
].forEach((k) => {
  Object.defineProperty(Response$1.prototype, k, { get() {
    return this[getResponseCache]()[k];
  } });
});
[
  "arrayBuffer",
  "blob",
  "clone",
  "formData",
  "json",
  "text"
].forEach((k) => {
  Object.defineProperty(Response$1.prototype, k, { value: function() {
    return this[getResponseCache]()[k]();
  } });
});
Object.defineProperty(Response$1.prototype, /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), { value: function(depth, options, inspectFn) {
  return `Response (lightweight) ${inspectFn({
    status: this.status,
    headers: this.headers,
    ok: this.ok,
    nativeResponse: this[responseCache]
  }, {
    ...options,
    depth: depth == null ? null : depth - 1
  })}`;
} });
Object.setPrototypeOf(Response$1, GlobalResponse);
Object.setPrototypeOf(Response$1.prototype, GlobalResponse.prototype);
var validRedirectUrl = /^https?:\/\/[!#-;=?-[\]_a-z~A-Z]+$/;
var parseRedirectUrl = (url) => {
  if (url instanceof URL) return url.href;
  if (validRedirectUrl.test(url)) return url;
  return new URL(url).href;
};
var validRedirectStatuses = /* @__PURE__ */ new Set([
  301,
  302,
  303,
  307,
  308
]);
Object.defineProperty(Response$1, "redirect", {
  value: function redirect(url, status = 302) {
    if (!validRedirectStatuses.has(status)) throw new RangeError("Invalid status code");
    return new Response$1(null, {
      status,
      headers: { location: parseRedirectUrl(url) }
    });
  },
  writable: true,
  configurable: true
});
Object.defineProperty(Response$1, "json", {
  value: function json(data, init) {
    const body = JSON.stringify(data);
    if (body === void 0) throw new TypeError("The data is not JSON serializable");
    const initHeaders = init?.headers;
    let headers;
    if (initHeaders) {
      headers = new Headers(initHeaders);
      if (!headers.has("content-type")) headers.set("content-type", "application/json");
    } else headers = { "content-type": "application/json" };
    return new Response$1(body, {
      status: init?.status ?? 200,
      statusText: init?.statusText,
      headers
    });
  },
  writable: true,
  configurable: true
});
async function readWithoutBlocking(readPromise) {
  return Promise.race([readPromise, Promise.resolve().then(() => Promise.resolve(void 0))]);
}
function writeFromReadableStreamDefaultReader(reader, writable, currentReadPromise) {
  const cancel = (error) => {
    reader.cancel(error).catch(() => {
    });
  };
  writable.on("close", cancel);
  writable.on("error", cancel);
  (currentReadPromise ?? reader.read()).then(flow, handleStreamError);
  return reader.closed.finally(() => {
    writable.off("close", cancel);
    writable.off("error", cancel);
  });
  function handleStreamError(error) {
    if (error) writable.destroy(error);
  }
  function onDrain() {
    reader.read().then(flow, handleStreamError);
  }
  function flow({ done, value }) {
    try {
      if (done) writable.end();
      else if (!writable.write(value)) writable.once("drain", onDrain);
      else return reader.read().then(flow, handleStreamError);
    } catch (e) {
      handleStreamError(e);
    }
  }
}
function writeFromReadableStream(stream, writable) {
  if (stream.locked) throw new TypeError("ReadableStream is locked.");
  else if (writable.destroyed) return;
  return writeFromReadableStreamDefaultReader(stream.getReader(), writable);
}
var buildOutgoingHttpHeaders = (headers, defaultContentType2) => {
  const res = {};
  if (!(headers instanceof Headers)) headers = new Headers(headers ?? void 0);
  if (headers.has("set-cookie")) {
    const cookies = [];
    for (const [k, v] of headers) if (k === "set-cookie") cookies.push(v);
    else res[k] = v;
    if (cookies.length > 0) res["set-cookie"] = cookies;
  } else for (const [k, v] of headers) res[k] = v;
  if (defaultContentType2) res["content-type"] ??= defaultContentType2;
  return res;
};
var outgoingEnded = /* @__PURE__ */ Symbol("outgoingEnded");
var incomingDraining = /* @__PURE__ */ Symbol("incomingDraining");
var DRAIN_TIMEOUT_MS = 500;
var MAX_DRAIN_BYTES = 64 * 1024 * 1024;
var drainIncoming = (incoming) => {
  const incomingWithDrainState = incoming;
  if (incoming.destroyed || incomingWithDrainState[incomingDraining]) return;
  incomingWithDrainState[incomingDraining] = true;
  if (incoming instanceof Http2ServerRequest) {
    try {
      incoming.stream?.close?.(constants.NGHTTP2_NO_ERROR);
    } catch {
    }
    return;
  }
  let bytesRead = 0;
  const cleanup = () => {
    clearTimeout(timer);
    incoming.off("data", onData);
    incoming.off("end", cleanup);
    incoming.off("error", cleanup);
  };
  const forceClose = () => {
    cleanup();
    const socket = incoming.socket;
    if (socket && !socket.destroyed) {
      if (typeof socket.destroySoon === "function") socket.destroySoon();
      else if (typeof socket.destroy === "function") socket.destroy();
    }
  };
  const timer = setTimeout(forceClose, DRAIN_TIMEOUT_MS);
  timer.unref?.();
  const onData = (chunk) => {
    bytesRead += chunk.length;
    if (bytesRead > MAX_DRAIN_BYTES) forceClose();
  };
  incoming.on("data", onData);
  incoming.on("end", cleanup);
  incoming.on("error", cleanup);
  incoming.resume();
};
var makeCloseHandler = (req, incoming, outgoing, needsBodyCleanup) => () => {
  if (incoming.errored) {
    recordBodyBufferedBeforeDisconnect(incoming);
    req[abortRequest](incoming.errored.toString());
  } else if (!outgoing.writableFinished || incoming instanceof Http2ServerRequest && incoming.aborted) {
    recordBodyBufferedBeforeDisconnect(incoming);
    req[abortRequest]("Client connection prematurely closed.");
  }
  if (needsBodyCleanup && !incoming.readableEnded) setTimeout(() => {
    if (!incoming.readableEnded) setTimeout(() => {
      drainIncoming(incoming);
    });
  });
};
var isImmediateCacheableResponse = (res) => {
  if (!(cacheKey in res)) return false;
  const body = res[cacheKey][1];
  return body === null || typeof body === "string" || body instanceof Uint8Array;
};
var handleRequestError = () => new Response(null, { status: 400 });
var handleFetchError = (e) => new Response(null, { status: e instanceof Error && (e.name === "TimeoutError" || e.constructor.name === "TimeoutError") ? 504 : 500 });
var handleResponseError = (e, outgoing) => {
  const err = e instanceof Error ? e : new Error("unknown error", { cause: e });
  if (err.code === "ERR_STREAM_PREMATURE_CLOSE") console.info("The user aborted a request.");
  else {
    console.error(e);
    if (!outgoing.headersSent) {
      if (outgoing instanceof ServerResponse) outgoing._contentLength = null;
      outgoing.writeHead(500, { "Content-Type": "text/plain" });
    }
    outgoing.end(`Error: ${err.message}`);
    outgoing.destroy(err);
  }
};
var flushHeaders = (outgoing) => {
  if ("flushHeaders" in outgoing && outgoing.writable) outgoing.flushHeaders();
};
var trySetContentLength = (outgoing, status, length) => {
  const http1 = outgoing;
  if (http1._contentLength === null && http1._hasBody && http1.useChunkedEncodingByDefault && !http1._removedContLen && status >= 200 && status !== 204 && status !== 304 && !outgoing.hasHeader("content-length") && !outgoing.hasHeader("transfer-encoding") && !outgoing.hasHeader("trailer")) {
    http1._contentLength = length;
    return true;
  }
  return false;
};
var writeDefaultHeaders = (outgoing, status, length) => {
  if (trySetContentLength(outgoing, status, length)) outgoing.writeHead(status, { "Content-Type": defaultContentType });
  else outgoing.writeHead(status, {
    "Content-Type": defaultContentType,
    "Content-Length": length
  });
};
var responseViaCache = async (res, outgoing) => {
  let [status, body, header] = res[cacheKey];
  if (!header) {
    if (body === null) {
      outgoing.writeHead(status);
      outgoing.end();
    } else if (typeof body === "string") {
      writeDefaultHeaders(outgoing, status, Buffer.byteLength(body));
      outgoing.end(body);
    } else if (body instanceof Uint8Array) {
      writeDefaultHeaders(outgoing, status, body.byteLength);
      outgoing.end(body);
    } else if (body instanceof Blob) {
      writeDefaultHeaders(outgoing, status, body.size);
      outgoing.end(new Uint8Array(await body.arrayBuffer()));
    } else {
      outgoing.writeHead(status, { "Content-Type": defaultContentType });
      flushHeaders(outgoing);
      await writeFromReadableStream(body, outgoing)?.catch((e) => handleResponseError(e, outgoing));
    }
    outgoing[outgoingEnded]?.();
    return;
  }
  let hasContentLength = false;
  let plainHeaders = false;
  let canAutoLength = true;
  if (header instanceof Headers) {
    hasContentLength = header.has("content-length");
    header = buildOutgoingHttpHeaders(header, body === null ? void 0 : defaultContentType);
  } else if (Array.isArray(header)) {
    const headerObj = new Headers(header);
    hasContentLength = headerObj.has("content-length");
    header = buildOutgoingHttpHeaders(headerObj, body === null ? void 0 : defaultContentType);
  } else {
    plainHeaders = true;
    for (const key in header) {
      if (key.length === 14 && key.toLowerCase() === "content-length") {
        hasContentLength = true;
        break;
      }
      if (key.length === 17 && key.toLowerCase() === "transfer-encoding" || key.length === 7 && key.toLowerCase() === "trailer") canAutoLength = false;
    }
  }
  if (!hasContentLength) {
    let length;
    if (typeof body === "string") length = Buffer.byteLength(body);
    else if (body instanceof Uint8Array) length = body.byteLength;
    else if (body instanceof Blob) length = body.size;
    if (length !== void 0 && (!plainHeaders || !canAutoLength || !trySetContentLength(outgoing, status, length))) {
      if (plainHeaders) header = { ...header };
      header["Content-Length"] = length;
    }
  }
  outgoing.writeHead(status, header);
  if (body == null) outgoing.end();
  else if (typeof body === "string" || body instanceof Uint8Array) outgoing.end(body);
  else if (body instanceof Blob) outgoing.end(new Uint8Array(await body.arrayBuffer()));
  else {
    flushHeaders(outgoing);
    await writeFromReadableStream(body, outgoing)?.catch((e) => handleResponseError(e, outgoing));
  }
  outgoing[outgoingEnded]?.();
};
var isPromise = (res) => typeof res.then === "function";
var responseViaResponseObject = async (res, outgoing, options = {}) => {
  if (isPromise(res)) if (options.errorHandler) try {
    res = await res;
  } catch (err) {
    const errRes = await options.errorHandler(err);
    if (!errRes) return;
    res = errRes;
  }
  else res = await res.catch(handleFetchError);
  if (cacheKey in res) return responseViaCache(res, outgoing);
  const resHeaderRecord = buildOutgoingHttpHeaders(res.headers, res.body === null ? void 0 : defaultContentType);
  if (res.body) {
    const reader = res.body.getReader();
    const values = [];
    let done = false;
    let currentReadPromise = void 0;
    if (resHeaderRecord["transfer-encoding"] !== "chunked") {
      let maxReadCount = 2;
      for (let i = 0; i < maxReadCount; i++) {
        currentReadPromise ||= reader.read();
        const chunk = await readWithoutBlocking(currentReadPromise).catch((e) => {
          console.error(e);
          done = true;
        });
        if (!chunk) {
          if (i === 1) {
            await new Promise((resolve2) => setTimeout(resolve2));
            maxReadCount = 3;
            continue;
          }
          break;
        }
        currentReadPromise = void 0;
        if (chunk.value) values.push(chunk.value);
        if (chunk.done) {
          done = true;
          break;
        }
      }
      if (done && !("content-length" in resHeaderRecord)) resHeaderRecord["content-length"] = values.reduce((acc, value) => acc + value.length, 0);
    }
    outgoing.writeHead(res.status, resHeaderRecord);
    values.forEach((value) => {
      outgoing.write(value);
    });
    if (done) outgoing.end();
    else {
      if (values.length === 0) flushHeaders(outgoing);
      await writeFromReadableStreamDefaultReader(reader, outgoing, currentReadPromise);
    }
  } else if (resHeaderRecord[X_ALREADY_SENT]) {
  } else {
    outgoing.writeHead(res.status, resHeaderRecord);
    outgoing.end();
  }
  outgoing[outgoingEnded]?.();
};
var getRequestListener = (fetchCallback, options = {}) => {
  const autoCleanupIncoming = options.autoCleanupIncoming ?? true;
  if (options.overrideGlobalObjects !== false && global.Request !== Request$1) {
    Object.defineProperty(global, "Request", { value: Request$1 });
    Object.defineProperty(global, "Response", { value: Response$1 });
  }
  return async (incoming, outgoing) => {
    let res, req;
    let needsBodyCleanup = false;
    let closeHandlerAttached = false;
    const ensureCloseHandler = () => {
      if (!req || closeHandlerAttached) return;
      closeHandlerAttached = true;
      outgoing.on("close", makeCloseHandler(req, incoming, outgoing, needsBodyCleanup));
    };
    try {
      req = newRequest(incoming, options.hostname);
      needsBodyCleanup = autoCleanupIncoming && !(incoming.method === "GET" || incoming.method === "HEAD");
      if (needsBodyCleanup) {
        incoming[wrapBodyStream] = true;
        if (incoming instanceof Http2ServerRequest) outgoing[outgoingEnded] = () => {
          if (!incoming.readableEnded) setTimeout(() => {
            if (!incoming.readableEnded) setTimeout(() => {
              incoming.destroy();
              outgoing.destroy();
            });
          });
        };
      }
      res = fetchCallback(req, {
        incoming,
        outgoing
      });
      if (!isPromise(res) && isImmediateCacheableResponse(res)) {
        if (needsBodyCleanup && !incoming.readableEnded) outgoing.once("finish", () => {
          if (!incoming.readableEnded) drainIncoming(incoming);
        });
        return responseViaCache(res, outgoing);
      }
      ensureCloseHandler();
    } catch (e) {
      if (!res) if (options.errorHandler) {
        ensureCloseHandler();
        res = await options.errorHandler(req ? e : toRequestError(e));
        if (!res) return;
      } else if (!req) res = handleRequestError();
      else res = handleFetchError(e);
      else return handleResponseError(e, outgoing);
    }
    try {
      return await responseViaResponseObject(res, outgoing, options);
    } catch (e) {
      return handleResponseError(e, outgoing);
    }
  };
};
var CloseEvent = globalThis.CloseEvent ?? class extends Event {
  #eventInitDict;
  constructor(type, eventInitDict = {}) {
    super(type, eventInitDict);
    this.#eventInitDict = eventInitDict;
  }
  get wasClean() {
    return this.#eventInitDict.wasClean ?? false;
  }
  get code() {
    return this.#eventInitDict.code ?? 0;
  }
  get reason() {
    return this.#eventInitDict.reason ?? "";
  }
};
var ErrorEvent = globalThis.ErrorEvent ?? class extends Event {
  #eventInitDict;
  constructor(type, eventInitDict = {}) {
    super(type, eventInitDict);
    this.#eventInitDict = eventInitDict;
  }
  get message() {
    return this.#eventInitDict.message ?? "";
  }
  get filename() {
    return this.#eventInitDict.filename ?? "";
  }
  get lineno() {
    return this.#eventInitDict.lineno ?? 0;
  }
  get colno() {
    return this.#eventInitDict.colno ?? 0;
  }
  get error() {
    return this.#eventInitDict.error ?? null;
  }
};
var generateConnectionSymbol = () => /* @__PURE__ */ Symbol("connection");
var CONNECTION_SYMBOL_KEY = /* @__PURE__ */ Symbol("CONNECTION_SYMBOL_KEY");
var WAIT_FOR_WEBSOCKET_SYMBOL = /* @__PURE__ */ Symbol("WAIT_FOR_WEBSOCKET_SYMBOL");
var responseHeadersToSkip = /* @__PURE__ */ new Set([
  "connection",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "sec-websocket-accept",
  "sec-websocket-extensions",
  "sec-websocket-protocol"
]);
var appendResponseHeaders = (headers, responseHeaders) => {
  if (!responseHeaders) return;
  responseHeaders.forEach((value, key) => {
    if (responseHeadersToSkip.has(key.toLowerCase())) return;
    headers.push(`${key}: ${value}`);
  });
};
var rejectUpgradeRequest = (socket, status, responseHeaders) => {
  if (socket.destroyed) return;
  const responseLines = ["Connection: close", "Content-Length: 0"];
  appendResponseHeaders(responseLines, responseHeaders);
  socket.end(`HTTP/1.1 ${status.toString()} ${STATUS_CODES[status] ?? ""}\r
${responseLines.join("\r\n")}\r
\r
`);
};
var createUpgradeRequest = (request) => {
  const protocol = request.socket.encrypted ? "https" : "http";
  const incomingUrl = request.url ?? "/";
  let url;
  if (incomingUrl[0] !== "/" && (incomingUrl.startsWith("http://") || incomingUrl.startsWith("https://"))) {
    validateRequestTarget(incomingUrl);
    url = new URL(incomingUrl).href;
  } else url = buildUrl(protocol, request.headers.host ?? "localhost", incomingUrl);
  const headers = new Headers();
  for (const key in request.headers) {
    const value = request.headers[key];
    if (!value) continue;
    headers.append(key, Array.isArray(value) ? value[0] : value);
  }
  return new Request(url, { headers });
};
var setupWebSocket = (options) => {
  const { server, fetchCallback, wss } = options;
  const waiterMap = /* @__PURE__ */ new Map();
  wss.on("connection", (ws, request) => {
    const waiter = waiterMap.get(request);
    if (waiter) {
      waiter.resolve(ws);
      waiterMap.delete(request);
    }
  });
  const rejectWaiter = (request) => {
    const waiter = waiterMap.get(request);
    if (waiter) {
      waiterMap.delete(request);
      waiter.reject(/* @__PURE__ */ new Error("WebSocket handshake aborted"));
    }
  };
  const waitForWebSocket = (request, connectionSymbol) => {
    return new Promise((resolve2, reject) => {
      waiterMap.set(request, {
        resolve: resolve2,
        reject,
        connectionSymbol
      });
    });
  };
  server.on("upgrade", async (request, socket, head2) => {
    if (request.headers.upgrade?.toLowerCase() !== "websocket") return;
    const ignoreSocketError = () => {
    };
    const reclaimWaiterOnClose = () => rejectWaiter(request);
    socket.on("error", ignoreSocketError);
    socket.once("close", reclaimWaiterOnClose);
    const env = {
      incoming: request,
      outgoing: void 0,
      wss,
      [WAIT_FOR_WEBSOCKET_SYMBOL]: waitForWebSocket
    };
    let status = 400;
    let responseHeaders;
    try {
      const response = await fetchCallback(createUpgradeRequest(request), env);
      if (response instanceof Response) {
        status = response.status;
        responseHeaders = response.headers;
      }
    } catch (error) {
      if (server.listenerCount("upgrade") === 1) rejectUpgradeRequest(socket, error instanceof RequestError ? 400 : 500);
      return;
    }
    if (socket.destroyed) {
      rejectWaiter(request);
      return;
    }
    const waiter = waiterMap.get(request);
    if (!waiter || waiter.connectionSymbol !== env[CONNECTION_SYMBOL_KEY]) {
      rejectWaiter(request);
      if (server.listenerCount("upgrade") === 1) rejectUpgradeRequest(socket, status, responseHeaders);
      return;
    }
    const addResponseHeaders = (headers) => {
      appendResponseHeaders(headers, responseHeaders);
    };
    wss.on("headers", addResponseHeaders);
    try {
      wss.handleUpgrade(request, socket, head2, (ws) => {
        socket.off("close", reclaimWaiterOnClose);
        socket.off("error", ignoreSocketError);
        wss.emit("connection", ws, request);
      });
    } finally {
      wss.off("headers", addResponseHeaders);
    }
  });
  server.on("close", () => {
    wss.close();
  });
};
var upgradeWebSocket = defineWebSocketHelper(async (c, events, options) => {
  if (c.req.header("upgrade")?.toLowerCase() !== "websocket") return;
  const env = c.env;
  const waitForWebSocket = env[WAIT_FOR_WEBSOCKET_SYMBOL];
  if (!waitForWebSocket || !env.incoming) return new Response(null, { status: 500 });
  const connectionSymbol = generateConnectionSymbol();
  env[CONNECTION_SYMBOL_KEY] = connectionSymbol;
  (async () => {
    let ws;
    try {
      ws = await waitForWebSocket(env.incoming, connectionSymbol);
    } catch {
      return;
    }
    const messagesReceivedInStarting = [];
    const bufferMessage = (data, isBinary) => {
      messagesReceivedInStarting.push([data, isBinary]);
    };
    ws.on("message", bufferMessage);
    const ctx = {
      binaryType: "arraybuffer",
      close(code, reason) {
        ws.close(code, reason);
      },
      protocol: ws.protocol,
      raw: ws,
      get readyState() {
        return ws.readyState;
      },
      send(source, opts) {
        ws.send(source, { compress: opts?.compress });
      },
      url: new URL(c.req.url)
    };
    try {
      events?.onOpen?.(new Event("open"), ctx);
    } catch (e) {
      (options?.onError ?? console.error)(e);
    }
    const handleMessage = (data, isBinary) => {
      const datas = Array.isArray(data) ? data : [data];
      for (const data2 of datas) try {
        events?.onMessage?.(new MessageEvent("message", { data: isBinary ? data2 instanceof ArrayBuffer ? data2 : data2.buffer.slice(data2.byteOffset, data2.byteOffset + data2.byteLength) : typeof data2 === "string" ? data2 : Buffer.from(data2).toString("utf-8") }), ctx);
      } catch (e) {
        (options?.onError ?? console.error)(e);
      }
    };
    ws.off("message", bufferMessage);
    for (const message of messagesReceivedInStarting) handleMessage(...message);
    ws.on("message", (data, isBinary) => {
      handleMessage(data, isBinary);
    });
    ws.on("close", (code, reason) => {
      try {
        events?.onClose?.(new CloseEvent("close", {
          code,
          reason: reason.toString()
        }), ctx);
      } catch (e) {
        (options?.onError ?? console.error)(e);
      }
    });
    ws.on("error", (error) => {
      try {
        events?.onError?.(new ErrorEvent("error", { error }), ctx);
      } catch (e) {
        (options?.onError ?? console.error)(e);
      }
    });
  })();
  return new Response();
});
var createAdaptorServer = (options) => {
  const fetchCallback = options.fetch;
  const requestListener = getRequestListener(fetchCallback, {
    hostname: options.hostname,
    overrideGlobalObjects: options.overrideGlobalObjects,
    autoCleanupIncoming: options.autoCleanupIncoming
  });
  const server = (options.createServer || createServer)(options.serverOptions || {}, requestListener);
  if (options.websocket && options.websocket.server) {
    if (options.websocket.server.options.noServer !== true) throw new Error("WebSocket server must be created with { noServer: true } option");
    setupWebSocket({
      server,
      fetchCallback,
      wss: options.websocket.server
    });
  }
  return server;
};
var serve = (options, listeningListener) => {
  const server = createAdaptorServer(options);
  server.listen(options?.port ?? 3e3, options.hostname, () => {
    const serverInfo = server.address();
    listeningListener && listeningListener(serverInfo);
  });
  return server;
};

// ../../usr/local/lib/node_modules/@iskra/apps/dist/apps-client.js
var import__2 = __toESM(require__());
import { randomUUID } from "node:crypto";

// ../../usr/local/lib/node_modules/@iskra/apps/dist/app-api-profile.generated.js
var appApiProfile = Object.freeze({
  "protocol": "app-api-v1",
  "api_version": "1",
  "openapi_version": "3.1.1",
  "issuer": "iskra-app-api",
  "token_type": "iskra-app-api+jwt",
  "service_path": "/__iskra_apps_api",
  "method_prefix": "/__iskra_app_api/methods/",
  "document_path": "/__iskra_app_api/openapi.json",
  "operation_pattern": "^[a-z][a-z0-9_]*(\\.[a-z][a-z0-9_]*)*$",
  "max_document_bytes": 262144,
  "max_probe_report_bytes": 1048576,
  "max_args_bytes": 65536,
  "max_envelope_bytes": 98304,
  "max_result_bytes": 1048576,
  "max_page_size": 100,
  "max_methods": 100,
  "max_operation_length": 96,
  "max_schema_nodes": 1e3,
  "max_schema_depth": 16,
  "max_summary_length": 160,
  "max_description_length": 2e3,
  "call_timeout_ms": 1e4,
  "token_ttl_ms": 15e3,
  "clock_skew_ms": 2e3,
  "max_concurrency": 64,
  "max_source_concurrency": 8,
  "max_token_bytes": 16384,
  "max_action_key_bytes": 128,
  "max_error_path_length": 256,
  "schema_node_schema": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "additionalProperties": false,
    "$defs": {
      "typeName": {
        "type": "string",
        "enum": [
          "object",
          "array",
          "string",
          "number",
          "integer",
          "boolean",
          "null"
        ]
      },
      "count": {
        "type": "integer",
        "minimum": 0,
        "maximum": 2147483647
      },
      "subschema": {
        "type": [
          "object",
          "boolean"
        ]
      }
    },
    "properties": {
      "type": {
        "anyOf": [
          {
            "$ref": "#/$defs/typeName"
          },
          {
            "type": "array",
            "minItems": 2,
            "maxItems": 2,
            "uniqueItems": true,
            "items": {
              "$ref": "#/$defs/typeName"
            }
          }
        ]
      },
      "properties": {
        "type": "object",
        "propertyNames": {
          "not": {
            "const": "__proto__"
          }
        }
      },
      "required": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "uniqueItems": true
      },
      "additionalProperties": {
        "$ref": "#/$defs/subschema"
      },
      "$ref": {
        "type": "string"
      },
      "items": {
        "$ref": "#/$defs/subschema"
      },
      "enum": {
        "type": "array",
        "minItems": 1,
        "uniqueItems": true
      },
      "const": {},
      "minimum": {
        "type": "number"
      },
      "maximum": {
        "type": "number"
      },
      "exclusiveMinimum": {
        "type": "number"
      },
      "exclusiveMaximum": {
        "type": "number"
      },
      "minLength": {
        "$ref": "#/$defs/count"
      },
      "maxLength": {
        "$ref": "#/$defs/count"
      },
      "minItems": {
        "$ref": "#/$defs/count"
      },
      "maxItems": {
        "$ref": "#/$defs/count"
      },
      "title": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "examples": {
        "type": "array"
      }
    }
  }
});

// ../../usr/local/lib/node_modules/@iskra/apps/dist/app-api-schema.js
var import__ = __toESM(require__());
var ajv = new import__.Ajv2020({ strict: true, strictTypes: false, strictRequired: false, allowUnionTypes: true, ownProperties: true, allErrors: false, coerceTypes: false, useDefaults: false, removeAdditional: false });
var validateNode = ajv.compile(appApiProfile.schema_node_schema);

// ../../usr/local/lib/node_modules/@iskra/apps/dist/apps-client.js
var uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
var operationPattern = new RegExp(appApiProfile.operation_pattern);
var uuidSchema = { type: "string", pattern: uuidPattern.source };
var versionSchema = { type: "string", const: "1" };
var hashSchema = { type: "string", pattern: "^[a-f0-9]{64}$" };
var operationSchema = { type: "string", pattern: appApiProfile.operation_pattern, maxLength: appApiProfile.max_operation_length };
var effectSchema = { type: "string", enum: ["read", "write"] };
var businessSchema = { type: ["object", "boolean"] };
var methodSchema = { type: "object", additionalProperties: false, required: ["operation_id", "summary", "description", "effect", "arguments_schema", "result_schema"], properties: { operation_id: operationSchema, summary: { type: "string", maxLength: appApiProfile.max_summary_length }, description: { type: "string", maxLength: appApiProfile.max_description_length }, effect: effectSchema, arguments_schema: businessSchema, result_schema: businessSchema, schemas: { type: "object", additionalProperties: businessSchema }, errors: { type: "object", propertyNames: { pattern: "^[45][0-9]{2}$" }, additionalProperties: { type: "string", minLength: 1, maxLength: appApiProfile.max_description_length } } } };
var catalogSchema = { type: "object", additionalProperties: false, required: ["apps", "methods"], properties: {
  apps: { type: "array", maxItems: appApiProfile.max_page_size, items: { type: "object", additionalProperties: false, required: ["app_id", "title", "openapi_url", "runtime_available"], properties: { app_id: uuidSchema, title: { type: "string" }, openapi_url: { type: "string", minLength: 1 }, runtime_available: { type: "boolean" }, api_version: versionSchema, app_version: { type: "string", minLength: 1 } } } },
  methods: { type: "array", maxItems: appApiProfile.max_methods, items: methodSchema },
  app_id: uuidSchema,
  api_version: versionSchema,
  app_version: { type: "string", minLength: 1 },
  contract_hash: hashSchema,
  next_cursor: { type: "string", minLength: 1, maxLength: 2048 },
  connection: { type: "object", additionalProperties: false, required: ["source_app_id", "target_app_id", "api_version", "contract_hash", "methods"], properties: { source_app_id: uuidSchema, target_app_id: uuidSchema, api_version: versionSchema, contract_hash: hashSchema, methods: { type: "array", minItems: 1, maxItems: appApiProfile.max_methods, items: { type: "object", additionalProperties: false, required: ["operation_id", "effect"], properties: { operation_id: operationSchema, effect: effectSchema } } } } }
} };
var validateCatalog = new import__2.Ajv2020({ strict: true, strictTypes: false, ownProperties: true, coerceTypes: false, useDefaults: false, removeAdditional: false }).compile(catalogSchema);

// ../../usr/local/lib/node_modules/@iskra/apps/dist/manifest.js
var import__3 = __toESM(require__());
var import_ajv_formats = __toESM(require_dist());

// ../../usr/local/lib/node_modules/@iskra/apps/dist/schema.generated.js
var manifestSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "\u0418\u0441\u043A\u0440\u0430 \u2014 \u043C\u0430\u043D\u0438\u0444\u0435\u0441\u0442 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F (app.json)",
  "description": "\u0415\u0434\u0438\u043D\u0438\u0446\u0430 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438 \u0431\u0430\u043D\u0434\u043B\u0430 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F (Apps \u0444\u0430\u0437\u0430 1, \u044D\u0442\u0430\u043F A). \u0421\u043C. docs/superpowers/specs/2026-07-26-iskra-apps-design.md \u2014 \xAB\u0415\u0434\u0438\u043D\u0438\u0446\u0430 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438\xBB.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "name",
    "version",
    "entry",
    "health",
    "access",
    "storage"
  ],
  "properties": {
    "name": {
      "description": 'Slug \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F (RFC 1123 label). \u0414\u043E\u043C\u0435\u043D\u043D\u044B\u0435 \u043E\u0442\u043A\u0430\u0437\u044B (xn-- \u043F\u0440\u0435\u0444\u0438\u043A\u0441, "--" \u0432 \u043F\u043E\u0437\u0438\u0446\u0438\u044F\u0445 3\u20134, \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A) \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u0442 manifest.go \u2014 \u0441\u0445\u0435\u043C\u0430 \u0432\u044B\u0440\u0430\u0436\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0433\u0440\u0430\u043C\u043C\u0430\u0442\u0438\u043A\u0443.',
      "type": "string",
      "pattern": "^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$",
      "maxLength": 63
    },
    "version": {
      "description": 'Semver \u0431\u0435\u0437 build-\u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0445, \u0441\u0442\u0440\u043E\u0447\u043D\u044B\u0435 \u0431\u0443\u043A\u0432\u044B \u0432 prerelease. \u041F\u043E\u0434\u0441\u0442\u0440\u043E\u043A\u0430 ".." \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u0430 manifest.go.',
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+(-[0-9a-z][0-9a-z.-]{0,30})?$",
      "maxLength": 48
    },
    "entry": {
      "description": "\u041F\u0443\u0442\u044C \u0432\u0445\u043E\u0434\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430. \u0424\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u043E\u0439 \u2014 \u0430\u0432\u0442\u043E\u0440\u043E\u043C \u043D\u0435 \u0437\u0430\u0434\u0430\u0451\u0442\u0441\u044F.",
      "type": "string",
      "const": "server.js"
    },
    "health": {
      "description": "\u041F\u0443\u0442\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u0436\u0438\u0432\u043E\u0441\u0442\u0438 \u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u043E\u0439; \u043C\u0430\u043D\u0438\u0444\u0435\u0441\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u0442 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443.",
      "type": "boolean",
      "const": true
    },
    "access": {
      "description": "\u0420\u0435\u0436\u0438\u043C \u0434\u043E\u0441\u0442\u0443\u043F\u0430. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 public \u0434\u043B\u044F \u0432\u043D\u0435\u0448\u043D\u0435\u0439 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438 \u043F\u043E \u0442\u0435\u043A\u0443\u0449\u0435\u043C\u0443 \u043F\u0440\u0430\u0432\u0443 \u0432\u043B\u0430\u0434\u0435\u043B\u044C\u0446\u0430; private \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0432\u043B\u0430\u0434\u0435\u043B\u044C\u0446\u0443, org \u2014 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430\u043C \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438.",
      "type": "string",
      "enum": [
        "private",
        "org",
        "public"
      ]
    },
    "storage": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "kind"
      ],
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "sqlite"
          ]
        }
      }
    },
    "api": {
      "description": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 AppBridge: SDK \u043F\u0443\u0431\u043B\u0438\u043A\u0443\u0435\u0442 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0438 \u0437\u0430\u0449\u0438\u0449\u0451\u043D\u043D\u044B\u0435 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0438 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0435\u0433\u043E API.",
      "type": "object",
      "additionalProperties": false,
      "required": [
        "kind"
      ],
      "properties": {
        "kind": {
          "type": "string",
          "const": "openapi-3.1"
        }
      }
    },
    "secrets": {
      "description": "\u0414\u0435\u043A\u043B\u0430\u0440\u0430\u0446\u0438\u044F \u0441\u0435\u043A\u0440\u0435\u0442\u043D\u044B\u0445 \u0441\u043B\u043E\u0442\u043E\u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F.",
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "slot",
          "scope"
        ],
        "properties": {
          "slot": {
            "type": "string",
            "pattern": "^[a-z0-9_]{1,64}$"
          },
          "scope": {
            "description": "app \u2014 \u043E\u0431\u0449\u0438\u0439 \u0441\u043B\u043E\u0442, \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0451\u0442 \u0432\u043B\u0430\u0434\u0435\u043B\u0435\u0446; viewer \u2014 \u043B\u0438\u0447\u043D\u044B\u0439 \u0441\u043B\u043E\u0442 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0437\u0440\u0438\u0442\u0435\u043B\u044F.",
            "type": "string",
            "enum": [
              "app",
              "viewer"
            ]
          }
        }
      }
    }
  }
};

// ../../usr/local/lib/node_modules/@iskra/apps/dist/manifest.js
var ajv2 = new import__3.Ajv2020({ allErrors: true, strict: true });
var addFormats = import_ajv_formats.default;
addFormats(ajv2);
var validateSchema = ajv2.compile(manifestSchema);

// ../../usr/local/lib/node_modules/@iskra/apps/dist/primitives.js
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { posix } from "node:path";
var sessionTTLSeconds = 24 * 60 * 60;
function appBasePath(env = process.env) {
  const raw2 = env.APP_BASE_PATH;
  if (!raw2 || !raw2.startsWith("/") || raw2.includes("?") || raw2.includes("#")) {
    throw new Error("APP_BASE_PATH \u043E\u0431\u044F\u0437\u0430\u043D \u0431\u044B\u0442\u044C \u0430\u0431\u0441\u043E\u043B\u044E\u0442\u043D\u044B\u043C URL path");
  }
  const normalized = posix.normalize(raw2);
  return normalized === "/" ? "/" : normalized.replace(/\/$/, "");
}
function appDataPath(relativePath, env = process.env) {
  const root = env.DATA_DIR;
  if (!root || !posix.isAbsolute(root))
    throw new Error("DATA_DIR \u043E\u0431\u044F\u0437\u0430\u043D \u0431\u044B\u0442\u044C \u0430\u0431\u0441\u043E\u043B\u044E\u0442\u043D\u044B\u043C \u043F\u0443\u0442\u0451\u043C");
  if (!relativePath || posix.isAbsolute(relativePath) || relativePath.split("/").includes("..")) {
    throw new Error("\u043F\u0443\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0431\u044F\u0437\u0430\u043D \u043E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u0432\u043D\u0443\u0442\u0440\u0438 DATA_DIR");
  }
  return posix.join(root, relativePath);
}

// ../../usr/local/lib/node_modules/@iskra/apps/dist/starter.js
var APP_STYLES = ["iskra", "strict", "showcase"];
function isAppStyle(value) {
  return APP_STYLES.includes(value);
}

// ../../usr/local/lib/node_modules/@iskra/apps/dist/ui.js
import { createHash } from "node:crypto";

// ../../usr/local/lib/node_modules/@iskra/apps/dist/styles.generated.js
var appStylesheet = '/* \u041E\u0431\u0449\u0438\u0439 \u0432\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u043B\u043E\u0439 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439 \u0418\u0441\u043A\u0440\u044B.\n\n   \u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u0435\u0433\u043E \u0446\u0435\u043B\u0438\u043A\u043E\u043C: `appStylesheetResponse` \u043E\u0442\u0434\u0430\u0451\u0442 \u044D\u0442\u043E\u0442 \u0444\u0430\u0439\u043B\n   \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u043E\u043C \u0441\u0430\u043C\u043E\u0433\u043E \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F, \u0430 `appPage` \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0430\u0435\u0442 \u0441\u0441\u044B\u043B\u043A\u043E\u0439. \u0410\u0432\u0442\u043E\u0440\u0443 \u043D\u0435 \u043D\u0443\u0436\u043D\u043E\n   \u043D\u0438 \u043F\u0438\u0441\u0430\u0442\u044C \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435, \u043D\u0438 \u043A\u043B\u0430\u0441\u0442\u044C \u0444\u0430\u0439\u043B \u0432 \u0431\u0430\u043D\u0434\u043B \u2014 \u0441\u043B\u043E\u0439 \u0435\u0434\u0435\u0442 \u0432\u043D\u0443\u0442\u0440\u0438 @iskra/apps\n   \u0438 \u043F\u0440\u0438\u0441\u0442\u0451\u0433\u043D\u0443\u0442 \u043A \u0432\u0435\u0440\u0441\u0438\u0438 \u0431\u0430\u043D\u0434\u043B\u0430, \u043A\u0430\u043A \u0438 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0435 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438.\n\n   \u041F\u0430\u043B\u0438\u0442\u0440\u0430 \u0432\u0437\u044F\u0442\u0430 \u0438\u0437 design-guide \u0418\u0441\u043A\u0440\u044B, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043D\u0435 \u0432\u044B\u0433\u043B\u044F\u0434\u0435\u043B\u043E \u0447\u0443\u0436\u0438\u043C\n   \u0440\u044F\u0434\u043E\u043C \u0441 \u043D\u0435\u0439: \u0442\u0451\u043F\u043B\u044B\u0439 \u043D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u043E\u043D, \u0430\u043C\u0431\u0435\u0440 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u043C \u0430\u043A\u0446\u0435\u043D\u0442\u043E\u043C, \u0433\u0440\u0430\u043D\u0438\u0446\u044B\n   \u043D\u0438\u0437\u043A\u043E\u0439 \u043A\u043E\u043D\u0442\u0440\u0430\u0441\u0442\u043D\u043E\u0441\u0442\u0438. \u0417\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0434\u0443\u0431\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u044B \u0437\u0434\u0435\u0441\u044C \u043D\u0430\u043C\u0435\u0440\u0435\u043D\u043D\u043E \u2014 \u0431\u0430\u043D\u0434\u043B\n   \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0439, \u0442\u044F\u043D\u0443\u0442\u044C \u0441\u0442\u0438\u043B\u0438 \u0418\u0441\u043A\u0440\u044B \u0435\u043C\u0443 \u043D\u0435\u043E\u0442\u043A\u0443\u0434\u0430.\n\n   \u0412\u043D\u0435\u0448\u043D\u0438\u0445 \u0440\u0435\u0441\u0443\u0440\u0441\u043E\u0432 \u043D\u0435\u0442 \u043D\u0438 \u043E\u0434\u043D\u043E\u0433\u043E: \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u043C\u0430\u044F \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0433\u043E\n   (default-src \'self\') \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443 \u0441\u043E \u0441\u0442\u043E\u0440\u043E\u043D\u044B \u0437\u0430\u043F\u0440\u0435\u0449\u0430\u0435\u0442, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0448\u0440\u0438\u0444\u0442 \u2014\n   \u0441\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0439 \u0441\u0442\u0435\u043A, \u0437\u043D\u0430\u043A \u0431\u0440\u0435\u043D\u0434\u0430 \u2014 inline SVG \u0432 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0435, \u0430 \u043C\u0430\u0440\u043A\u0435\u0440\u044B \u0438 \u043A\u0440\u0443\u0442\u0438\u043B\u043A\u0430\n   \u043D\u0430\u0440\u0438\u0441\u043E\u0432\u0430\u043D\u044B \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0430\u043C\u0438 CSS.\n\n   \u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u044B \u0438 \u0433\u043E\u043B\u044B\u0435 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B (main, h1, table, button, input), \u0430 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E\n   \u043A\u043B\u0430\u0441\u0441\u044B: \u044D\u043A\u0440\u0430\u043D, \u0441\u043E\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u0431\u0435\u0437 \u0435\u0434\u0438\u043D\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430, \u043E\u0431\u044F\u0437\u0430\u043D \u0432\u044B\u0433\u043B\u044F\u0434\u0435\u0442\u044C \u0437\u0430\u043A\u043E\u043D\u0447\u0435\u043D\u043D\u044B\u043C \u2014\n   \u043A\u043B\u0430\u0441\u0441\u044B \u0443\u0442\u043E\u0447\u043D\u044F\u044E\u0442 \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u043A\u0443, \u0430 \u043D\u0435 \u0432\u043A\u043B\u044E\u0447\u0430\u044E\u0442 \u0435\u0451. */\n\n:root {\n  color-scheme: light dark;\n\n  --bg: #fbf9f7;\n  --panel: #f6f3f1;\n  --surface: #ffffff;\n  --surface-sunken: #faf8f6;\n\n  --text: #171717;\n  --text-soft: #6e6e6e;\n  --text-muted: #959595;\n\n  --border: rgb(55 50 47 / 12%);\n  --border-strong: rgb(55 50 47 / 22%);\n  --hover: rgb(131 121 114 / 10%);\n\n  --accent: #aa5c03;\n  --accent-hover: #d97706;\n  --accent-contrast: #ffffff;\n  --accent-soft: rgb(253 205 166 / 35%);\n  --accent-border: rgb(170 92 3 / 35%);\n\n  --success: #047857;\n  --success-soft: rgb(4 120 87 / 10%);\n  --danger: #dc2626;\n  --danger-soft: rgb(220 38 38 / 10%);\n  --danger-border: rgb(220 38 38 / 25%);\n\n  --radius: 10px;\n  --radius-sm: 7px;\n  --shadow: 0 1px 2px rgb(23 23 23 / 4%), 0 4px 16px rgb(23 23 23 / 5%);\n\n  --font: 14px/1.55 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;\n  --page-width: 1180px;\n\n  /* \u0426\u0432\u0435\u0442\u0430 \u0448\u0430\u043F\u043A\u0438. \u0412 \u0431\u0430\u0437\u0435 \u0448\u0430\u043F\u043A\u0430 \u2014 \u0442\u0430 \u0436\u0435 \u043F\u0430\u043D\u0435\u043B\u044C, \u0447\u0442\u043E \u0438 \u0431\u043E\u043A\u043E\u0432\u043E\u0435 \u043C\u0435\u043D\u044E; \u0441\u0442\u0438\u043B\u044C\n     \xAB\u0421\u0442\u0440\u043E\u0433\u0438\u0439\xBB \u0434\u0435\u043B\u0430\u0435\u0442 \u0435\u0451 \u0442\u0451\u043C\u043D\u043E\u0439, \u043D\u0435 \u0442\u0440\u043E\u0433\u0430\u044F --panel. \u0421\u0441\u044B\u043B\u043A\u0438 \u043D\u0430 \u0442\u043E\u043A\u0435\u043D\u044B\n     \u0432\u044B\u0447\u0438\u0441\u043B\u044F\u044E\u0442\u0441\u044F \u043D\u0430 :root, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0441\u043B\u0435\u0434\u0443\u044E\u0442 \u0438 \u0437\u0430 \u0442\u0451\u043C\u043D\u043E\u0439 \u0442\u0435\u043C\u043E\u0439, \u0438 \u0437\u0430 \u0441\u0442\u0438\u043B\u0435\u043C. */\n  --bar-bg: var(--panel);\n  --bar-text: var(--text);\n  --bar-text-soft: var(--text-soft);\n  --bar-hover: var(--hover);\n  --bar-border: var(--border);\n}\n\n/* \u0422\u0451\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430 \u0438\u0434\u0451\u0442 \u043F\u043E \u0441\u0438\u0441\u0442\u0435\u043C\u043D\u043E\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0435: \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u044E\u0442 \u0438\u0437 \u0418\u0441\u043A\u0440\u044B, \u0438\n   \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u044F \u0443 \u043D\u0435\u0433\u043E \u043D\u0435\u0442 \u2014 \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435 \u0441 \u043E\u043A\u043D\u043E\u043C \u0432\u043E\u043A\u0440\u0443\u0433 \u0447\u0438\u0442\u0430\u043B\u043E\u0441\u044C\n   \u0431\u044B \u043A\u0430\u043A \u0447\u0443\u0436\u0430\u044F \u0432\u043A\u043B\u0430\u0434\u043A\u0430. */\n@media (prefers-color-scheme: dark) {\n  :root {\n    --bg: #1d1d1c;\n    --panel: #191818;\n    --surface: #2b2a29;\n    --surface-sunken: #232221;\n\n    --text: #ffffff;\n    --text-soft: #bfbfbf;\n    --text-muted: #858585;\n\n    --border: rgb(232 224 217 / 12%);\n    --border-strong: rgb(241 239 237 / 22%);\n    --hover: rgb(170 165 160 / 10%);\n\n    --accent: #f4cd74;\n    --accent-hover: #eaba4d;\n    --accent-contrast: #1d1d1c;\n    --accent-soft: rgb(199 93 7 / 22%);\n    --accent-border: rgb(244 205 116 / 35%);\n\n    --success: #3dd2a8;\n    --success-soft: rgb(61 210 168 / 12%);\n    --danger: #ff4848;\n    --danger-soft: rgb(255 72 72 / 12%);\n    --danger-border: rgb(255 72 72 / 28%);\n\n    --shadow: 0 1px 2px rgb(0 0 0 / 20%), 0 4px 16px rgb(0 0 0 / 24%);\n  }\n}\n\n/* \u2500\u2500 \u0421\u0442\u0438\u043B\u0438 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n/* \u0421\u0442\u0438\u043B\u044C \u2014 \u0430\u0442\u0440\u0438\u0431\u0443\u0442 data-style \u043D\u0430 <html>, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0441\u0442\u0430\u0432\u0438\u0442 appPage. \u0411\u043B\u043E\u043A \u0441\u0442\u0438\u043B\u044F\n   \u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u043E\u043A\u0435\u043D\u044B: \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u044B \u043D\u0438\u0436\u0435 \u043E\u0434\u043D\u0438 \u043D\u0430 \u0432\u0441\u0435 \u0441\u0442\u0438\u043B\u0438.\n\n   \u0421\u0435\u043B\u0435\u043A\u0442\u043E\u0440 :root[data-style=\u2026] \u0441\u0438\u043B\u044C\u043D\u0435\u0435 \u0442\u0451\u043C\u043D\u043E\u0433\u043E :root \u0432\u043D\u0443\u0442\u0440\u0438 @media, \u043F\u043E\u044D\u0442\u043E\u043C\u0443\n   \u0442\u0451\u043C\u043D\u044B\u0439 \u0431\u043B\u043E\u043A \u0441\u0442\u0438\u043B\u044F \u043E\u0431\u044F\u0437\u0430\u043D \u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0442\u044C \u0412\u0421\u0415 \u0442\u043E\u043A\u0435\u043D\u044B \u0441\u0432\u0435\u0442\u043B\u043E\u0433\u043E \u0431\u043B\u043E\u043A\u0430 \u0442\u043E\u0433\u043E \u0436\u0435\n   \u0441\u0442\u0438\u043B\u044F: \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043D\u044B\u0439 \u0442\u043E\u043A\u0435\u043D \u043E\u0441\u0442\u0430\u043B\u0441\u044F \u0431\u044B \u0441\u0432\u0435\u0442\u043B\u044B\u043C \u043D\u0430 \u0442\u0451\u043C\u043D\u043E\u043C \u0444\u043E\u043D\u0435. \u041F\u0430\u0440\u0438\u0442\u0435\u0442\n   \u043D\u0430\u0431\u043E\u0440\u043E\u0432 \u0441\u0432\u0435\u0440\u044F\u0435\u0442 \u0442\u0435\u0441\u0442 SDK.\n\n   \u041A\u043E\u043D\u0442\u0440\u0430\u0441\u0442 (WCAG, \u0432\u044B\u0447\u0438\u0441\u043B\u0435\u043D \u043F\u043E \u0444\u043E\u0440\u043C\u0443\u043B\u0435 \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0439 \u044F\u0440\u043A\u043E\u0441\u0442\u0438), \u0432\u0441\u0435 \u2265 4.5:1:\n   strict, \u0441\u0432\u0435\u0442\u043B\u0430\u044F:  --accent #2f5d8a / --accent-contrast #ffffff   6.88\n                     --accent-hover #244a70 / #ffffff               9.18\n                     --bar-text #e8edf3 / --bar-bg #1f2a37         12.35\n                     --bar-text-soft #aab6c3 / --bar-bg #1f2a37     7.05\n                     --text #1b2430 / --bg #f4f6f8                 14.45\n   strict, \u0442\u0451\u043C\u043D\u0430\u044F:   --accent #7fb0e0 / --accent-contrast #0f151b   8.04\n                     --accent-hover #9cc3ea / #0f151b               9.98\n                     --bar-text #e8edf3 / --bar-bg #0f151b         15.60\n                     --bar-text-soft #aab6c3 / --bar-bg #0f151b     8.91\n                     --text #e8edf3 / --bg #141a21                 14.87\n   showcase, \u0441\u0432\u0435\u0442\u043B\u0430\u044F: --accent #c2461d / --accent-contrast #ffffff  5.01\n                     --accent-hover #a63a15 / #ffffff               6.49\n                     --text #2a1a0f / \u0448\u0430\u043F\u043A\u0430 #fff8ee                15.89\n                     --text-soft #7a5a44 / \u0448\u0430\u043F\u043A\u0430 #fff8ee            5.90\n                     --accent #c2461d / --bg #fff8ee (\u0441\u0441\u044B\u043B\u043A\u0430)       4.76\n   showcase, \u0442\u0451\u043C\u043D\u0430\u044F: --accent #ff9a6b / --accent-contrast #1f1712   8.48\n                     --accent-hover #ffb28e / #1f1712              10.10\n                     --text #fbeee0 / \u0448\u0430\u043F\u043A\u0430 #1f1712                15.47\n                     --text-soft #d2b8a3 / \u0448\u0430\u043F\u043A\u0430 #1f1712            9.35 */\n\n/* \xAB\u0421\u0442\u0440\u043E\u0433\u0438\u0439\xBB: \u043F\u043B\u043E\u0442\u043D\u044B\u0439, \u0434\u043B\u044F \u0443\u0447\u0451\u0442\u0430 \u0438 \u043E\u0442\u0447\u0451\u0442\u043E\u0432 \u2014 \u0445\u043E\u043B\u043E\u0434\u043D\u044B\u0439 \u0441\u0435\u0440\u043E-\u0441\u0438\u043D\u0438\u0439, \u043C\u0435\u043B\u043A\u0438\u0439\n   \u0440\u0430\u0434\u0438\u0443\u0441, \u0442\u0451\u043C\u043D\u0430\u044F \u0448\u0430\u043F\u043A\u0430. */\n:root[data-style="strict"] {\n  --bg: #f4f6f8;\n  --panel: #eef1f4;\n  --surface: #ffffff;\n  --surface-sunken: #f7f9fb;\n\n  --text: #1b2430;\n  --text-soft: #556270;\n  --text-muted: #7d8a98;\n\n  --border: rgb(27 36 48 / 12%);\n  --border-strong: rgb(27 36 48 / 22%);\n  --hover: rgb(47 93 138 / 8%);\n\n  --accent: #2f5d8a;\n  --accent-hover: #244a70;\n  --accent-contrast: #ffffff;\n  --accent-soft: rgb(47 93 138 / 12%);\n  --accent-border: rgb(47 93 138 / 35%);\n\n  --radius: 4px;\n  --radius-sm: 3px;\n  --font: 13px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;\n\n  --bar-bg: #1f2a37;\n  --bar-text: #e8edf3;\n  --bar-text-soft: #aab6c3;\n  --bar-hover: rgb(232 237 243 / 10%);\n  --bar-border: rgb(232 237 243 / 22%);\n}\n\n/* \xAB\u0412\u0438\u0442\u0440\u0438\u043D\u0430\xBB: \u043A\u0440\u0443\u043F\u043D\u044B\u0439, \u0434\u043B\u044F \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432 \u2014 \u0441\u0432\u0435\u0442\u043B\u044B\u0439 \u0442\u0451\u043F\u043B\u044B\u0439 \u0444\u043E\u043D, \u043A\u0440\u0443\u043F\u043D\u044B\u0439 \u043A\u0435\u0433\u043B\u044C,\n   \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0440\u0430\u0434\u0438\u0443\u0441, \u0437\u0430\u0441\u0435\u0447\u043A\u0438 \u0432 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430\u0445, \u043A\u043E\u0440\u0430\u043B\u043B\u043E\u0432\u044B\u0439 \u0430\u043A\u0446\u0435\u043D\u0442. */\n:root[data-style="showcase"] {\n  --bg: #fff8ee;\n  --panel: #fff8ee;\n  --surface: #ffffff;\n  --surface-sunken: #fdf1e2;\n\n  --text: #2a1a0f;\n  --text-soft: #7a5a44;\n  --text-muted: #a88c77;\n\n  --border: rgb(122 70 30 / 14%);\n  --border-strong: rgb(122 70 30 / 26%);\n  --hover: rgb(194 70 29 / 8%);\n\n  --accent: #c2461d;\n  --accent-hover: #a63a15;\n  --accent-contrast: #ffffff;\n  --accent-soft: rgb(224 88 43 / 14%);\n  --accent-border: rgb(194 70 29 / 35%);\n\n  --radius: 16px;\n  --radius-sm: 12px;\n  --font: 15px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;\n  --font-display: Georgia, "Times New Roman", serif;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root[data-style="strict"] {\n    --bg: #141a21;\n    --panel: #10161c;\n    --surface: #1c242e;\n    --surface-sunken: #182028;\n\n    --text: #e8edf3;\n    --text-soft: #aab6c3;\n    --text-muted: #7d8a98;\n\n    --border: rgb(232 237 243 / 12%);\n    --border-strong: rgb(232 237 243 / 22%);\n    --hover: rgb(170 182 195 / 10%);\n\n    --accent: #7fb0e0;\n    --accent-hover: #9cc3ea;\n    --accent-contrast: #0f151b;\n    --accent-soft: rgb(127 176 224 / 16%);\n    --accent-border: rgb(127 176 224 / 35%);\n\n    --radius: 4px;\n    --radius-sm: 3px;\n    --font: 13px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;\n\n    --bar-bg: #0f151b;\n    --bar-text: #e8edf3;\n    --bar-text-soft: #aab6c3;\n    --bar-hover: rgb(232 237 243 / 10%);\n    --bar-border: rgb(232 237 243 / 20%);\n  }\n\n  :root[data-style="showcase"] {\n    --bg: #1f1712;\n    --panel: #1f1712;\n    --surface: #2a2019;\n    --surface-sunken: #251b15;\n\n    --text: #fbeee0;\n    --text-soft: #d2b8a3;\n    --text-muted: #a08a78;\n\n    --border: rgb(251 238 224 / 12%);\n    --border-strong: rgb(251 238 224 / 22%);\n    --hover: rgb(255 154 107 / 10%);\n\n    --accent: #ff9a6b;\n    --accent-hover: #ffb28e;\n    --accent-contrast: #1f1712;\n    --accent-soft: rgb(255 154 107 / 16%);\n    --accent-border: rgb(255 154 107 / 35%);\n\n    --radius: 16px;\n    --radius-sm: 12px;\n    --font: 15px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;\n    --font-display: Georgia, "Times New Roman", serif;\n  }\n}\n\n/* \u0417\u0430\u0441\u0435\u0447\u043A\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u0443 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u0432 \xAB\u0412\u0438\u0442\u0440\u0438\u043D\u044B\xBB: \u0442\u043E\u043A\u0435\u043D \u0437\u0430\u0434\u0430\u043D \u043B\u0438\u0448\u044C \u0435\u0451 \u0431\u043B\u043E\u043A\u0430\u043C\u0438, \u0438\n   \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043E \u0441\u0442\u0438\u043B\u0435\u043C, \u0447\u0442\u043E\u0431\u044B \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438 \u043D\u0430\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043B\u0438 \u0448\u0440\u0438\u0444\u0442. */\n:root[data-style="showcase"] :is(h1, h2, .app-bar__title) {\n  font-family: var(--font-display);\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  font: var(--font);\n  margin: 0;\n  color: var(--text);\n  background: var(--bg);\n}\n\n/* [hidden] \u043E\u0431\u044F\u0437\u0430\u043D \u043F\u043E\u0431\u0435\u0436\u0434\u0430\u0442\u044C \u043B\u044E\u0431\u043E\u0439 display \u044D\u0442\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430: \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430\n   \u0430\u0432\u0442\u043E\u0440\u0441\u043A\u043E\u043C\u0443 \u043F\u0440\u043E\u0438\u0433\u0440\u044B\u0432\u0430\u0435\u0442, \u0438 \u0441\u043A\u0440\u044B\u0442\u044B\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u043C display \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043D\u0430\n   \u044D\u043A\u0440\u0430\u043D\u0435. */\n[hidden] {\n  display: none !important;\n}\n\n/* \u2500\u2500 \u041A\u0430\u0440\u043A\u0430\u0441 \u044D\u043A\u0440\u0430\u043D\u0430 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n/* \u0428\u0430\u043F\u043A\u0430 \u043B\u0438\u043F\u043A\u0430\u044F: \u0440\u0430\u0431\u043E\u0447\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u043E\u0431\u044B\u0447\u043D\u043E \u0434\u043B\u0438\u043D\u043D\u0435\u0435 \u044D\u043A\u0440\u0430\u043D\u0430, \u0438 \u0431\u0435\u0437 \u043D\u0435\u0451 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u0432\n   \u0441\u043E\u0441\u0435\u0434\u043D\u0438\u0439 \u0440\u0430\u0437\u0434\u0435\u043B \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0438 \u0432 \u043D\u0430\u0447\u0430\u043B\u043E. */\n.app-bar {\n  position: sticky;\n  top: 0;\n  z-index: 5;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 12px 14px;\n  padding: 14px 24px;\n  background: var(--bar-bg);\n  border-bottom: 1px solid var(--border);\n  /* \u0412\u043D\u0443\u0442\u0440\u0438 \u0448\u0430\u043F\u043A\u0438 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0435 \u0442\u043E\u043A\u0435\u043D\u044B \u043F\u0435\u0440\u0435\u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u044B \u043D\u0430 \u0442\u043E\u043A\u0435\u043D\u044B \u0448\u0430\u043F\u043A\u0438: \u0431\u0440\u0435\u043D\u0434,\n     \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435, \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u0438 \u0437\u0440\u0438\u0442\u0435\u043B\u044C \u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u0438 \u043D\u0430 \u0442\u0451\u043C\u043D\u043E\u0439 \u0448\u0430\u043F\u043A\u0435 \xAB\u0421\u0442\u0440\u043E\u0433\u043E\u0433\u043E\xBB;\n     \u0433\u0440\u0430\u043D\u0438\u0446\u0430 \u2014 \u0442\u043E\u0436\u0435, \u0438\u043D\u0430\u0447\u0435 \u043E\u0431\u0432\u043E\u0434\u043A\u0430 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u043F\u0443\u043D\u043A\u0442\u0430 \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u0438 \u043D\u0430 \u043D\u0435\u0439 \u043F\u0440\u043E\u043F\u0430\u0434\u0430\u0435\u0442. */\n  --text: var(--bar-text);\n  --text-soft: var(--bar-text-soft);\n  --hover: var(--bar-hover);\n  --border: var(--bar-border);\n  color: var(--text);\n}\n\n/* \u0411\u0440\u0435\u043D\u0434 \u0432\u0435\u0434\u0451\u0442 \u0432 \u0440\u0430\u0437\u0434\u0435\u043B \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439 \u0418\u0441\u043A\u0440\u044B \u2014 \u0434\u043E\u0440\u043E\u0433\u0430 \u043D\u0430\u0437\u0430\u0434 \u0438\u0437 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0433\u043E\n   \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F. \u0417\u043D\u0430\u043A \u0440\u0438\u0441\u0443\u0435\u0442 inline SVG, \u0446\u0432\u0435\u0442\u0430 \u2014 \u043A\u043B\u0430\u0441\u0441\u044B \u043D\u0438\u0436\u0435: \u0430\u0442\u0440\u0438\u0431\u0443\u0442 style\n   \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0433\u043E \u0437\u0430\u043F\u0440\u0435\u0449\u0430\u0435\u0442. */\n.app-bar__brand {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  padding: 3px 8px 3px 4px;\n  margin-left: -4px;\n  border-radius: var(--radius-sm);\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--text-soft);\n  text-decoration: none;\n  white-space: nowrap;\n}\n\na.app-bar__brand:hover {\n  color: var(--text);\n  background: var(--hover);\n}\n\n.app-bar__brand b {\n  color: var(--text);\n  font-weight: 650;\n}\n\n.app-bar__logo {\n  flex: none;\n}\n\n.app-bar__logo-bg {\n  fill: var(--accent);\n}\n\n.app-bar__logo-spark {\n  fill: var(--accent-contrast);\n}\n\n.app-bar__sep {\n  color: var(--text-muted);\n}\n\n.app-bar__title {\n  margin: 0;\n  font-size: 17px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n  min-width: 0;\n}\n\n.app-bar__spacer {\n  flex: 1 1 auto;\n}\n\n/* \u0417\u0440\u0438\u0442\u0435\u043B\u044C: \u043A\u0442\u043E \u0441\u043C\u043E\u0442\u0440\u0438\u0442 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435. \u0422\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u043A\u0430\u0437 \u2014 \u0434\u043E\u0441\u0442\u0443\u043F \u0440\u0435\u0448\u0430\u0435\u0442 JWT. */\n.app-bar__viewer {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  font-size: 13px;\n  color: var(--text-soft);\n}\n\n/* \u0414\u043B\u0438\u043D\u043D\u043E\u0435 \u0438\u043C\u044F \u043E\u0431\u0440\u0435\u0437\u0430\u0435\u0442\u0441\u044F \u043C\u043D\u043E\u0433\u043E\u0442\u043E\u0447\u0438\u0435\u043C, \u0430 \u043D\u0435 \u0440\u0430\u0441\u043F\u0438\u0440\u0430\u0435\u0442 \u0448\u0430\u043F\u043A\u0443 \u0448\u0438\u0440\u0435 \u043E\u043A\u043D\u0430. */\n.app-bar__viewer-name {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.app-bar__avatar {\n  display: inline-grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--text);\n  background: var(--accent-soft);\n  border: 1px solid var(--accent-border);\n  flex: none;\n}\n\n/* \u041D\u0430 \u0443\u0437\u043A\u043E\u0439 \u0448\u0438\u0440\u0438\u043D\u0435 \u0431\u0440\u0435\u043D\u0434, \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u0438 \u0437\u0440\u0438\u0442\u0435\u043B\u044C \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u043F\u0435\u0440\u0432\u043E\u0439 \u0441\u0442\u0440\u043E\u043A\u043E\u0439, \u0430\n   \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0443\u0445\u043E\u0434\u0438\u0442 \u0432\u0442\u043E\u0440\u043E\u0439 \u0432\u043E \u0432\u0441\u044E \u0448\u0438\u0440\u0438\u043D\u0443. */\n@media (max-width: 560px) {\n  .app-bar__sep {\n    display: none;\n  }\n\n  .app-bar__title {\n    order: 1;\n    flex: 1 0 100%;\n  }\n\n  /* \u041E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0430\u0432\u0430\u0442\u0430\u0440; \u0438\u043C\u044F \u0441\u043A\u0440\u044B\u0442\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u043E \u2014 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430 \u0447\u0442\u0435\u043D\u0438\u044F \u044D\u043A\u0440\u0430\u043D\u0430\n     \u0435\u0433\u043E \u0447\u0438\u0442\u0430\u0435\u0442, \u0430 \u043C\u044B\u0448\u044C \u0432\u0438\u0434\u0438\u0442 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0443 title. */\n  .app-bar__viewer-name {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip-path: inset(50%);\n    white-space: nowrap;\n  }\n}\n\n/* \u041F\u043E\u043B\u043E\u0441\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0433\u043E \u0437\u0430\u0434\u0430\u0451\u0442\u0441\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u043C, \u0430 \u043D\u0435 \u043A\u043B\u0430\u0441\u0441\u043E\u043C: \u044D\u043A\u0440\u0430\u043D \u0431\u0435\u0437 \u0435\u0434\u0438\u043D\u043E\u0433\u043E\n   \u043A\u043B\u0430\u0441\u0441\u0430 \u043E\u0431\u044F\u0437\u0430\u043D \u0431\u044B\u0442\u044C \u0441\u0432\u0451\u0440\u0441\u0442\u0430\u043D. .page \u2014 \u0442\u043E \u0436\u0435 \u0441\u0430\u043C\u043E\u0435 \u044F\u0432\u043D\u043E, \u0434\u043B\u044F \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0438, \u0433\u0434\u0435\n   main \u0437\u0430\u043D\u044F\u0442 \u0434\u0440\u0443\u0433\u0438\u043C. */\nmain,\n.page {\n  max-width: var(--page-width);\n  margin: 0 auto;\n  padding: 24px;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n\n/* \u0421\u043F\u0438\u0441\u043E\u043A \u0432\u043E \u0432\u0441\u044E \u0448\u0438\u0440\u0438\u043D\u0443 \u043E\u043A\u043D\u0430: \u0432\u043E\u0441\u0435\u043C\u044C \u043A\u043E\u043B\u043E\u043D\u043E\u043A \u0432 1180 \u043F\u0438\u043A\u0441\u0435\u043B\u044F\u0445 \u0441\u0436\u0438\u043C\u0430\u044E\u0442 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0435\n   \u0434\u043E \u043D\u0435\u0443\u0437\u043D\u0430\u0432\u0430\u0435\u043C\u043E\u0441\u0442\u0438, \u043F\u0440\u0438 \u0442\u043E\u043C \u0447\u0442\u043E \u043C\u0435\u0441\u0442\u043E \u043D\u0430 \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0435 \u0435\u0441\u0442\u044C. */\n.page--wide {\n  max-width: none;\n}\n\nmain > h1,\n.page > h1 {\n  margin: 0;\n  font-size: 21px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n\nmain > h2,\n.page > h2 {\n  margin: 8px 0 0;\n  font-size: 15px;\n  font-weight: 600;\n}\n\n/* \u041C\u0435\u0440\u0430 \u0441\u0442\u0440\u043E\u043A\u0438: \u043D\u0430 \u0448\u0438\u0440\u043E\u043A\u043E\u043C \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0435 \u0441\u0442\u0440\u043E\u043A\u0430 \u0432 200 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 \u0442\u0435\u0440\u044F\u0435\u0442\u0441\u044F \u043F\u0440\u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0435\n   \u043A \u043D\u0430\u0447\u0430\u043B\u0443. \u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435 \u0431\u0435\u0440\u0443\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0430\u0431\u0437\u0430\u0446\u044B \u0431\u0435\u0437 \u043A\u043B\u0430\u0441\u0441\u0430 \u2014 \u043A\u043B\u0430\u0441\u0441\u043E\u043C \u0440\u0430\u0437\u043C\u0435\u0447\u0430\u044E\u0442 \u0438\n   \u0441\u0442\u0440\u043E\u043A\u0443 \u043A\u043D\u043E\u043F\u043E\u043A, \u0438 \u0441\u0442\u0440\u043E\u043A\u0443 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F, \u0430 \u0438\u043C \u0448\u0438\u0440\u0438\u043D\u0430 \u043D\u0443\u0436\u043D\u0430 \u0441\u0432\u043E\u044F. */\nmain > p:not([class]),\n.page > p:not([class]),\n.hint {\n  max-width: 70ch;\n}\n\n/* \u041F\u043E\u044F\u0441\u043D\u0435\u043D\u0438\u0435 \u043A \u044D\u043A\u0440\u0430\u043D\u0443: \u0442\u043E\u043D \u043D\u0438\u0436\u0435 \u0434\u0430\u043D\u043D\u044B\u0445, \u0438\u043D\u0430\u0447\u0435 \u0441\u043F\u043E\u0440\u0438\u0442 \u0441 \u043D\u0438\u043C\u0438 \u0437\u0430 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435. */\n.hint {\n  color: var(--text-soft);\n  margin: 0;\n}\n\n/* \u2500\u2500 \u0421\u0441\u044B\u043B\u043A\u0438 \u0438 \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\na {\n  color: var(--accent);\n  text-decoration-color: var(--accent-border);\n  text-underline-offset: 3px;\n}\n\na:hover {\n  color: var(--accent-hover);\n}\n\n.nav {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin: 0;\n}\n\n.nav a {\n  padding: 5px 11px;\n  border-radius: 999px;\n  color: var(--text-soft);\n  text-decoration: none;\n  border: 1px solid transparent;\n}\n\n.nav a:hover,\n.nav a[aria-current="page"] {\n  color: var(--text);\n  background: var(--hover);\n  border-color: var(--border);\n}\n\n.nav a[aria-current="page"] {\n  font-weight: 600;\n}\n\n/* \u2500\u2500 \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow);\n}\n\n.card--pad {\n  padding: 16px;\n}\n\n/* \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043F\u043E\u0434 \u0442\u0430\u0431\u043B\u0438\u0446\u0443 \xAB\u043F\u043E\u0434\u043F\u0438\u0441\u044C \u2014 \u0447\u0438\u0441\u043B\u043E\xBB: \u0432\u043E \u0432\u0441\u044E \u0448\u0438\u0440\u0438\u043D\u0443 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043E\u043D\u0430 \u0432\u044B\u0433\u043B\u044F\u0434\u0438\u0442\n   \u043F\u0443\u0441\u0442\u043E\u0439, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0434\u0430\u043D\u043D\u044B\u0445 \u0432 \u043D\u0435\u0439 \u0434\u0432\u0430 \u0441\u0442\u043E\u043B\u0431\u0446\u0430. */\n.card--narrow {\n  max-width: 560px;\n}\n\n/* \u2500\u2500 \u041A\u043D\u043E\u043F\u043A\u0438 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n/* \u0422\u0440\u0438 \u0440\u043E\u043B\u0438: \u043E\u0431\u044B\u0447\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 (\u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E), \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u044D\u043A\u0440\u0430\u043D\u0430\n   (.btn-primary) \u0438 \u0440\u0430\u0437\u0440\u0443\u0448\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 (.btn-danger). \u0427\u0435\u0442\u0432\u0451\u0440\u0442\u043E\u0439 \u0440\u043E\u043B\u0438 \u043D\u0435\u0442 \u043D\u0430\u043C\u0435\u0440\u0435\u043D\u043D\u043E \u2014\n   \u044D\u043A\u0440\u0430\u043D, \u0433\u0434\u0435 \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u044B \u0432\u0441\u0435 \u043A\u043D\u043E\u043F\u043A\u0438, \u043D\u0435 \u0432\u044B\u0434\u0435\u043B\u044F\u0435\u0442 \u043D\u0438 \u043E\u0434\u043D\u043E\u0439. */\nbutton {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  font: inherit;\n  font-weight: 500;\n  padding: 8px 16px;\n  border-radius: var(--radius-sm);\n  border: 1px solid var(--border-strong);\n  background: var(--surface);\n  color: var(--text);\n  cursor: pointer;\n  transition: background-color 0.12s ease, border-color 0.12s ease, opacity 0.12s ease;\n}\n\nbutton:hover:not(:disabled) {\n  background: var(--hover);\n}\n\n/* \u0424\u043E\u043A\u0443\u0441 \u0432\u0438\u0434\u0435\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043A\u043B\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u044B: \u043A\u043E\u043B\u044C\u0446\u043E \u043F\u043E\u0441\u043B\u0435 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u043A\u043B\u0438\u043A\u0430 \u043C\u044B\u0448\u044C\u044E \u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F\n   \u043A\u0430\u043A \xAB\u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u043E\u0441\u0442\u0430\u043B\u0441\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u043C\xBB \u0438 \u0441\u0431\u0438\u0432\u0430\u0435\u0442 \u043F\u0440\u0438 \u0431\u044B\u0441\u0442\u0440\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u0435. */\nbutton:focus-visible,\na:focus-visible,\ninput:focus-visible,\nselect:focus-visible,\ntextarea:focus-visible,\n[tabindex]:focus-visible {\n  outline: 2px solid var(--accent);\n  outline-offset: 2px;\n}\n\nbutton:disabled {\n  opacity: 0.45;\n  cursor: not-allowed;\n}\n\n.btn-primary {\n  background: var(--accent);\n  border-color: var(--accent);\n  color: var(--accent-contrast);\n}\n\n.btn-primary:hover:not(:disabled) {\n  background: var(--accent-hover);\n  border-color: var(--accent-hover);\n}\n\n.btn-danger {\n  color: var(--danger);\n  border-color: var(--danger-border);\n  background: transparent;\n}\n\n.btn-danger:hover:not(:disabled) {\n  background: var(--danger-soft);\n}\n\n/* \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0432\u043D\u0443\u0442\u0440\u0438 \u0441\u0442\u0440\u043E\u043A\u0438 \u0442\u0430\u0431\u043B\u0438\u0446\u044B: \u043C\u0435\u043D\u044C\u0448\u0435 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u043A\u043D\u043E\u043F\u043A\u0438, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u0441\u043F\u043E\u0440\u0438\u0442\u044C \u0441\n   \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435\u043C \u0432\u0441\u0435\u0433\u043E \u044D\u043A\u0440\u0430\u043D\u0430. */\n.btn-row {\n  margin-left: 10px;\n  padding: 3px 10px;\n  font-size: 12.5px;\n  border-radius: 999px;\n}\n\n.actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin: 0;\n}\n\n/* \u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u043F\u043A\u0430 \u0441 \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u044B\u043C \u043F\u0440\u043E\u0441\u0432\u0435\u0442\u043E\u043C: \u0431\u0435\u0437 \u043D\u0435\u0451 \u0441\u043E\u0441\u0435\u0434\u043D\u0438\u0435 \u0431\u043B\u043E\u043A\u0438 \u0432\u043D\u0443\u0442\u0440\u0438\n   \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0441\u043B\u0438\u043F\u0430\u044E\u0442\u0441\u044F, \u0430 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 margin \u0443 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0438\u0437 \u043D\u0438\u0445 \u0440\u0430\u0437\u044A\u0435\u0437\u0436\u0430\u044E\u0442\u0441\u044F \u043F\u043E\n   \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C. */\n.stack {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n/* \u041F\u0430\u043D\u0435\u043B\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439: \u043A\u043D\u043E\u043F\u043A\u0438 \u0438 \u0441\u0442\u0440\u043E\u043A\u0430 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F \u043E\u0434\u043D\u043E\u0439 \u0441\u0442\u0440\u043E\u043A\u043E\u0439. \u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u0441\u0442\u043E\u0438\u0442\n   \u0441\u043F\u0440\u0430\u0432\u0430 \u043E\u0442 \u043A\u043D\u043E\u043F\u043E\u043A, \u0430 \u043D\u0435 \u043F\u043E\u0434 \u043D\u0438\u043C\u0438: \u043F\u043E\u0434 \u043A\u043D\u043E\u043F\u043A\u043E\u0439 \u043E\u043D\u043E \u043E\u0442\u043E\u0434\u0432\u0438\u0433\u0430\u0435\u0442 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0432\u043D\u0438\u0437\n   \u0440\u043E\u0432\u043D\u043E \u0432 \u0442\u043E\u0442 \u043C\u043E\u043C\u0435\u043D\u0442, \u043A\u043E\u0433\u0434\u0430 \u0447\u0435\u043B\u043E\u0432\u0435\u043A \u0446\u0435\u043B\u0438\u0442\u0441\u044F \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0443\u044E \u0441\u0442\u0440\u043E\u043A\u0443 \u0441\u043F\u0438\u0441\u043A\u0430. \u041D\u0430\n   \u0443\u0437\u043A\u043E\u043C \u044D\u043A\u0440\u0430\u043D\u0435 \u0441\u0442\u0440\u043E\u043A\u0430 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0442\u0441\u044F, \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u0443\u0445\u043E\u0434\u0438\u0442 \u043F\u043E\u0434 \u043A\u043D\u043E\u043F\u043A\u0438. */\n.toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px 14px;\n}\n\n.toolbar .actions {\n  flex: 0 0 auto;\n}\n\n/* \u041E\u0441\u0442\u0430\u0442\u043E\u043A \u0448\u0438\u0440\u0438\u043D\u044B \u043E\u0442\u0434\u0430\u0451\u0442\u0441\u044F \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044E; 320px \u2014 \u043F\u043E\u0440\u043E\u0433, \u043D\u0438\u0436\u0435 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u043E\u043D\u043E \u0443\u0436\u0435 \u043D\u0435\n   \u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u0432 \u0441\u0442\u0440\u043E\u043A\u0443 \u0438 \u0443\u0435\u0437\u0436\u0430\u0435\u0442 \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0443\u044E. */\n.toolbar .status {\n  flex: 1 1 320px;\n  min-width: 0;\n}\n\n/* \u2500\u2500 \u0421\u0442\u0440\u043E\u043A\u0430 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n/* \u0412\u044B\u0441\u043E\u0442\u0430 \u0434\u0435\u0440\u0436\u0438\u0442\u0441\u044F \u0432\u0441\u0435\u0433\u0434\u0430: \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0434\u0451\u0440\u0433\u0430\u043B\u043E \u0431\u044B \u043A\u043D\u043E\u043F\u043A\u0438 \u0438 \u0442\u0430\u0431\u043B\u0438\u0446\u0443 \u0432\u043D\u0438\u0437\n   \u0440\u043E\u0432\u043D\u043E \u0432 \u0442\u043E\u0442 \u043C\u043E\u043C\u0435\u043D\u0442, \u043A\u043E\u0433\u0434\u0430 \u0447\u0435\u043B\u043E\u0432\u0435\u043A \u0446\u0435\u043B\u0438\u0442\u0441\u044F \u0432 \u043A\u043D\u043E\u043F\u043A\u0443. */\n.status {\n  min-height: 34px;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  color: var(--text-soft);\n}\n\n.status--ok,\n.status--warn,\n.status--error {\n  padding: 6px 12px;\n  border-radius: var(--radius-sm);\n  border-left: 3px solid transparent;\n}\n\n/* \u0418\u0442\u043E\u0433 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0438 \u043E\u0442\u043A\u0430\u0437 \u0440\u0430\u0437\u043B\u0438\u0447\u0430\u044E\u0442\u0441\u044F \u0446\u0432\u0435\u0442\u043E\u043C: \xAB\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u043E\u0432: 12\xBB \u0442\u0435\u043C \u0436\u0435\n   \u043A\u0440\u0430\u0441\u043D\u044B\u043C, \u0447\u0442\u043E \u0438 \xAB\u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D\xBB, \u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u043E\u0448\u0438\u0431\u043A\u0430. */\n.status--ok {\n  color: var(--success);\n  background: var(--success-soft);\n  border-left-color: var(--success);\n}\n\n/* \u0427\u0430\u0441\u0442\u0438\u0447\u043D\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u2014 \u043D\u0435 \u043E\u0442\u043A\u0430\u0437 \u0438 \u043D\u0435 \u0443\u0441\u043F\u0435\u0445. */\n.status--warn {\n  color: var(--accent);\n  background: var(--accent-soft);\n  border-left-color: var(--accent);\n}\n\n.status--error {\n  color: var(--danger);\n  background: var(--danger-soft);\n  border-left-color: var(--danger);\n}\n\n/* \u2500\u2500 \u0422\u0430\u0431\u043B\u0438\u0446\u044B \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.table-wrap {\n  overflow: auto;\n  border-radius: var(--radius);\n}\n\ntable {\n  border-collapse: separate;\n  border-spacing: 0;\n  width: 100%;\n  /* \u0421\u0443\u043C\u043C\u044B \u0438 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0432\u044B\u0440\u0430\u0432\u043D\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u043F\u043E \u0440\u0430\u0437\u0440\u044F\u0434\u0443: \u043F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0446\u0438\u0444\u0440\u044B \u0432\n     \u0441\u0442\u043E\u043B\u0431\u0446\u0435 \u0447\u0438\u0441\u0435\u043B \u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u043A\u0430\u043A \u0447\u0438\u0441\u043B\u0430 \u0440\u0430\u0437\u043D\u043E\u0439 \u0434\u043B\u0438\u043D\u044B. */\n  font-variant-numeric: tabular-nums;\n}\n\nth {\n  position: sticky;\n  top: 0;\n  z-index: 1;\n  text-align: left;\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.02em;\n  text-transform: uppercase;\n  color: var(--text-muted);\n  background: var(--surface-sunken);\n  padding: 10px 14px;\n  border-bottom: 1px solid var(--border);\n  white-space: nowrap;\n}\n\ntd {\n  padding: 11px 14px;\n  border-bottom: 1px solid var(--border);\n  vertical-align: top;\n}\n\ntbody tr:last-child td {\n  border-bottom: 0;\n}\n\ntbody tr:hover td {\n  background: var(--hover);\n}\n\n/* \u0427\u0438\u0441\u043B\u043E\u0432\u0430\u044F \u043A\u043E\u043B\u043E\u043D\u043A\u0430: \u043F\u0440\u0430\u0432\u043E\u0435 \u0432\u044B\u0440\u0430\u0432\u043D\u0438\u0432\u0430\u043D\u0438\u0435 \u0438 \u0437\u0430\u043F\u0440\u0435\u0442 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0430. \xAB49656.24\xBB,\n   \u0440\u0430\u0437\u043E\u0440\u0432\u0430\u043D\u043D\u043E\u0435 \u043D\u0430 \u0434\u0432\u0435 \u0441\u0442\u0440\u043E\u043A\u0438, \u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u0434\u0432\u0430 \u0440\u0430\u0437\u043D\u044B\u0445 \u0447\u0438\u0441\u043B\u0430. */\ntd.num,\nth.num {\n  text-align: right;\n}\n\ntd.num {\n  white-space: nowrap;\n}\n\n/* \u0422\u0430\u0431\u043B\u0438\u0446\u0430 \xAB\u043F\u043E\u0434\u043F\u0438\u0441\u044C \u2014 \u0447\u0438\u0441\u043B\u043E\xBB: \u0432\u043E \u0432\u0441\u044E \u0448\u0438\u0440\u0438\u043D\u0443 \u044D\u043A\u0440\u0430\u043D\u0430 \u0447\u0438\u0441\u043B\u043E \u0443\u0435\u0437\u0436\u0430\u0435\u0442 \u043E\u0442 \u0441\u0432\u043E\u0435\u0439\n   \u043F\u043E\u0434\u043F\u0438\u0441\u0438 \u043D\u0430 \u043F\u043E\u043B\u043C\u0435\u0442\u0440\u0430 \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0430, \u0438 \u0441\u0442\u0440\u043E\u043A\u0443 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0447\u0438\u0442\u0430\u0442\u044C \u043B\u0438\u043D\u0435\u0439\u043A\u043E\u0439. */\n.pairs {\n  max-width: 520px;\n}\n\n.pairs td:last-child,\n.pairs th:last-child {\n  text-align: right;\n}\n\n/* \u041F\u0443\u0441\u0442\u043E\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u2014 \u044D\u0442\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435, \u0430 \u043D\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u0435 \u043E\u0442\u0432\u0435\u0442\u0430: \u0442\u0430\u0431\u043B\u0438\u0446\u0430 \u0441 \u043E\u0434\u043D\u0438\u043C\u0438\n   \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430\u043C\u0438 \u0432\u044B\u0433\u043B\u044F\u0434\u0438\u0442 \u043A\u0430\u043A \u043D\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0432\u0448\u0438\u0439\u0441\u044F \u044D\u043A\u0440\u0430\u043D. */\n.empty {\n  color: var(--text-muted);\n  text-align: center;\n  padding: 28px 14px;\n}\n\n/* \u2500\u2500 \u0411\u0435\u0439\u0434\u0436\u0438 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n/* \u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043F\u0438\u043B\u044E\u043B\u0435\u0439: \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0438\u0437 \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u044B\u0445 \u0441\u043B\u043E\u0432 \u0433\u043B\u0430\u0437 \u0438\u0449\u0435\u0442 \u043D\u0443\u0436\u043D\u0443\u044E \u0441\u0442\u0440\u043E\u043A\u0443\n   \u0434\u043E\u043B\u044C\u0448\u0435, \u0447\u0435\u043C \u043F\u043E \u0446\u0432\u0435\u0442\u043E\u0432\u043E\u043C\u0443 \u043F\u044F\u0442\u043D\u0443. \u0412\u0430\u0440\u0438\u0430\u043D\u0442\u044B \u043D\u0430\u0437\u0432\u0430\u043D\u044B \u043F\u043E \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044E, \u0430 \u043D\u0435 \u043F\u043E\n   \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044E \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043D\u043E\u0439 \u043E\u0431\u043B\u0430\u0441\u0442\u0438: \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0441\u043E\u043F\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u0441\u0432\u043E\u0438 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F\n   \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C, \u0438 \u043F\u0430\u043B\u0438\u0442\u0440\u0430 \u043D\u0435 \u0440\u0430\u0441\u0442\u0451\u0442 \u0432\u043C\u0435\u0441\u0442\u0435 \u0441 \u0438\u0445 \u0447\u0438\u0441\u043B\u043E\u043C. */\n.badge {\n  display: inline-block;\n  padding: 3px 10px;\n  border-radius: 999px;\n  font-size: 12.5px;\n  font-weight: 500;\n  white-space: nowrap;\n  color: var(--text-soft);\n  background: var(--hover);\n  border: 1px solid var(--border);\n}\n\n.badge--accent {\n  color: var(--accent);\n  background: var(--accent-soft);\n  border-color: var(--accent-border);\n}\n\n.badge--success {\n  color: var(--success);\n  background: var(--success-soft);\n  border-color: transparent;\n}\n\n.badge--danger {\n  color: var(--danger);\n  background: var(--danger-soft);\n  border-color: var(--danger-border);\n}\n\n/* \u041F\u043E\u043C\u0435\u0442\u043A\u0430 \u0440\u044F\u0434\u043E\u043C \u0441 \u0431\u0435\u0439\u0434\u0436\u0435\u043C \u2014 \u043D\u0435 \u0447\u0430\u0441\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F: \u0441\u0432\u043E\u0438\u043C \u0446\u0432\u0435\u0442\u043E\u043C \u043E\u043D\u0430 \u0441\u043F\u043E\u0440\u0438\u043B\u0430 \u0431\u044B \u0441\n   \u043F\u0438\u043B\u044E\u043B\u0435\u0439, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0438\u0434\u0451\u0442 \u0442\u043E\u043D\u043E\u043C \u043D\u0438\u0436\u0435 \u0438 \u0440\u044F\u0434\u043E\u043C. */\n.badge-note {\n  margin-left: 6px;\n  color: var(--text-muted);\n  font-size: 12.5px;\n}\n\n/* \u2500\u2500 \u041F\u043E\u043B\u044F \u0444\u043E\u0440\u043C\u044B \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n/* \u0420\u0430\u0437\u0434\u0435\u043B \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u0443\u0435\u0442 \u043F\u043E\u043B\u044F \u043F\u043E \u0441\u043C\u044B\u0441\u043B\u0443: \u043F\u044F\u0442\u043D\u0430\u0434\u0446\u0430\u0442\u044C \u043F\u043E\u043B\u0435\u0439 \u043F\u043E\u0434\u0440\u044F\u0434 \u0431\u0435\u0437 \u0434\u0435\u043B\u0435\u043D\u0438\u044F\n   \u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u043A\u0430\u043A \u0430\u043D\u043A\u0435\u0442\u0430, \u0432 \u043A\u043E\u0442\u043E\u0440\u043E\u0439 \u043A\u0430\u0436\u0434\u044B\u0439 \u0440\u0430\u0437 \u0438\u0449\u0435\u0448\u044C \u043D\u0443\u0436\u043D\u0443\u044E \u0441\u0442\u0440\u043E\u043A\u0443 \u0437\u0430\u043D\u043E\u0432\u043E. */\n.section__title {\n  margin: 0 0 8px;\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--text-muted);\n}\n\n.fields-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 10px 12px;\n}\n\n.field {\n  display: block;\n  margin: 0;\n  min-width: 0;\n}\n\n/* \u041F\u043E\u043B\u0435 \u0432\u043E \u0432\u0441\u044E \u0448\u0438\u0440\u0438\u043D\u0443 \u0441\u0435\u0442\u043A\u0438: \u0430\u0434\u0440\u0435\u0441 \u0438\u043B\u0438 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0432 \u0434\u0432\u0435 \u043A\u043E\u043B\u043E\u043D\u043A\u0438 \u043D\u0435 \u043F\u043E\u043C\u0435\u0449\u0430\u0435\u0442\u0441\u044F\n   \u0438 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u0442\u0430\u043C, \u0433\u0434\u0435 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0442\u044C \u043D\u0435\u0447\u0435\u0433\u043E. */\n.field--wide {\n  grid-column: 1 / -1;\n}\n\n.field__label {\n  display: block;\n  margin-bottom: 4px;\n  font-size: 12.5px;\n  color: var(--text-soft);\n}\n\ninput,\nselect,\ntextarea {\n  display: block;\n  width: 100%;\n  padding: 8px 10px;\n  font: inherit;\n  color: var(--text);\n  background: var(--surface);\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius-sm);\n  font-variant-numeric: tabular-nums;\n}\n\ninput:focus,\nselect:focus,\ntextarea:focus {\n  border-color: var(--accent);\n}\n\n/* \u041E\u0434\u0438\u043D\u043E\u0447\u043D\u043E\u0435 \u043F\u043E\u043B\u0435 \u043D\u0435 \u0440\u0430\u0441\u0442\u044F\u0433\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0432\u043E \u0432\u0441\u044E \u0448\u0438\u0440\u0438\u043D\u0443 \u044D\u043A\u0440\u0430\u043D\u0430: \u0441\u0442\u0440\u043E\u043A\u0430 \u0432\u0432\u043E\u0434\u0430 \u0432 \u0442\u044B\u0441\u044F\u0447\u0443\n   \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439 \u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u043F\u0440\u043E\u043C\u0430\u0445 \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u043A\u0438, \u0430 \u043D\u0435 \u043A\u0430\u043A \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u043F\u0438\u0441\u0430\u0442\u044C \u0434\u043B\u0438\u043D\u043D\u043E.\n   \u0412 \u0441\u0435\u0442\u043A\u0435 \u0448\u0438\u0440\u0438\u043D\u0443 \u0437\u0430\u0434\u0430\u0451\u0442 \u043A\u043E\u043B\u043E\u043D\u043A\u0430, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0442\u0430\u043C \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435 \u0441\u043D\u0438\u043C\u0430\u0435\u0442\u0441\u044F. */\ninput,\nselect,\ntextarea {\n  max-width: 32rem;\n}\n\n.field input,\n.field select,\n.field textarea {\n  max-width: none;\n}\n\nfieldset {\n  border: 0;\n  padding: 0;\n  margin: 0;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n\n/* \u041D\u0435\u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u043E\u0435 \u043F\u043E\u043B\u0435 \u0432\u0438\u0434\u043D\u043E \u0434\u043E \u0432\u0441\u044F\u043A\u043E\u0439 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438: \u0438\u0441\u043A\u0430\u0442\u044C \u0435\u0433\u043E \u043F\u0435\u0440\u0435\u0447\u0438\u0442\u044B\u0432\u0430\u043D\u0438\u0435\u043C \u0444\u043E\u0440\u043C\u044B\n   \u2014 \u0441\u0430\u043C\u0430\u044F \u0434\u043E\u043B\u0433\u0430\u044F \u0447\u0430\u0441\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u044B. \u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430 \u0441\u043D\u0438\u043C\u0430\u0435\u0442\u0441\u044F \u0441\u0430\u043C\u0430, \u043A\u0430\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043F\u043E\u043B\u0435\n   \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435. */\n.is-empty {\n  background: var(--accent-soft);\n  border-color: var(--accent-border);\n}\n\n/* \u041E\u0442\u043A\u0430\u0437 \u043F\u0440\u0438\u0451\u043C\u043D\u0438\u043A\u0430 \u043F\u043E\u0432\u0435\u0440\u0445 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438: \u043A\u0440\u0430\u0441\u043D\u044B\u0439 \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \xAB\u044D\u0442\u043E \u0443\u0436\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u043B\u0438 \u0438 \u043D\u0435\n   \u043F\u0440\u0438\u043D\u044F\u043B\u0438\xBB, \u0440\u044B\u0436\u0438\u0439 \u2014 \xAB\u0437\u0434\u0435\u0441\u044C \u043F\u0443\u0441\u0442\u043E\xBB. */\n.invalid {\n  border-color: var(--danger);\n  background: var(--danger-soft);\n}\n\n/* \u2500\u2500 \u041A\u0440\u0443\u0442\u0438\u043B\u043A\u0430 \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n/* \u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043A\u043B\u0430\u0441\u0441\u043E\u043C is-busy \u043D\u0430 \u0441\u0430\u043C\u043E\u043C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0438: \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F\n   \u0443\u0432\u043E\u0434\u0438\u0442 \u0432\u0437\u0433\u043B\u044F\u0434 \u0441 \u0442\u043E\u0433\u043E \u043C\u0435\u0441\u0442\u0430, \u043A\u0443\u0434\u0430 \u0447\u0435\u043B\u043E\u0432\u0435\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u043E \u043D\u0430\u0436\u0430\u043B. \u041A\u043D\u043E\u043F\u043A\u0430 \u043D\u0430 \u044D\u0442\u043E\n   \u0432\u0440\u0435\u043C\u044F \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0430, \u043D\u043E \u043F\u0440\u0438\u0433\u043B\u0443\u0448\u0435\u043D\u0430 \u043C\u0435\u043D\u044C\u0448\u0435 \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E disabled \u2014 \u0438\u043D\u0430\u0447\u0435 \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u044F\n   \u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u043F\u043E\u0434\u0432\u0438\u0441\u0448\u0430\u044F. */\n.spinner {\n  display: none;\n  width: 14px;\n  height: 14px;\n  border: 2px solid currentColor;\n  border-right-color: transparent;\n  border-radius: 50%;\n  opacity: 0.75;\n  animation: spin 0.7s linear infinite;\n}\n\n.is-busy .spinner {\n  display: inline-block;\n}\n\nbutton.is-busy:disabled {\n  opacity: 0.8;\n  cursor: progress;\n}\n\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n/* \u0423\u0432\u0430\u0436\u0435\u043D\u0438\u0435 \u043A \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0435 \xAB\u043C\u0435\u043D\u044C\u0448\u0435 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F\xBB: \u0432\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043F\u0440\u0438\u0437\u043D\u0430\u043A\u043E\u043C \u0440\u0430\u0431\u043E\u0442\u044B,\n   \u043D\u043E \u043F\u0435\u0440\u0435\u0441\u0442\u0430\u0451\u0442 \u043C\u0435\u043B\u044C\u0442\u0435\u0448\u0438\u0442\u044C. */\n@media (prefers-reduced-motion: reduce) {\n  .spinner {\n    animation-duration: 2.4s;\n  }\n}\n\n/* \u2500\u2500 \u0420\u0430\u0441\u043A\u043B\u0430\u0434\u043A\u0438 \u043C\u0430\u043A\u0435\u0442\u043E\u0432 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n/* \u041C\u0435\u043D\u044E \u0441\u043B\u0435\u0432\u0430 (navPosition: "side"): \u0448\u0430\u043F\u043A\u0430 \u0432\u043E \u0432\u0441\u044E \u0448\u0438\u0440\u0438\u043D\u0443, \u043F\u043E\u0434 \u043D\u0435\u0439 \u043C\u0435\u043D\u044E \u0438\n   \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435. \u0420\u0430\u0437\u0434\u0435\u043B\u043E\u0432 \u0431\u043E\u043B\u044C\u0448\u0435, \u0447\u0435\u043C \u043F\u043E\u043C\u0435\u0449\u0430\u0435\u0442\u0441\u044F \u0432 \u0441\u0442\u0440\u043E\u043A\u0443 \u0448\u0430\u043F\u043A\u0438. */\n.app-shell--side {\n  display: grid;\n  grid-template-columns: 220px minmax(0, 1fr);\n  grid-template-rows: auto 1fr;\n  min-height: 100vh;\n}\n\n.app-shell--side > .app-bar {\n  grid-column: 1 / -1;\n}\n\n.app-shell--side > main {\n  width: 100%;\n}\n\n.side-nav {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 16px 10px;\n  background: var(--panel);\n  border-right: 1px solid var(--border);\n}\n\n.side-nav a {\n  display: block;\n  padding: 7px 12px;\n  border-radius: var(--radius-sm);\n  color: var(--text-soft);\n  text-decoration: none;\n}\n\n.side-nav a:hover {\n  color: var(--text);\n  background: var(--hover);\n}\n\n.side-nav a[aria-current="page"] {\n  color: var(--text);\n  background: var(--hover);\n  font-weight: 600;\n}\n\n/* \u041F\u043B\u0438\u0442\u043A\u0438 \u0446\u0438\u0444\u0440 \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u0430: \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0432\u043B\u0435\u0437\u0435\u0442 \u0432 \u0441\u0442\u0440\u043E\u043A\u0443, \u043D\u0435 \u0443\u0436\u0435 160px. */\n.kpis {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n  gap: 12px;\n}\n\n.kpi {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 14px 16px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n}\n\n.kpi__label {\n  font-size: 12.5px;\n  color: var(--text-soft);\n}\n\n.kpi__value {\n  font-size: 22px;\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n  letter-spacing: -0.01em;\n}\n\n/* \xAB\u0421\u043F\u0438\u0441\u043E\u043A + \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\xBB: \u0441\u043F\u0438\u0441\u043E\u043A \u0443\u0436\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438, \u043D\u0430 \u0443\u0437\u043A\u043E\u043C \u2014 \u043E\u0434\u043D\u0430 \u043A\u043E\u043B\u043E\u043D\u043A\u0430. */\n.split {\n  display: grid;\n  grid-template-columns: minmax(220px, 1fr) 2fr;\n  gap: 16px;\n  align-items: start;\n}\n\n/* \u0412\u044B\u0431\u0438\u0440\u0430\u0435\u043C\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A: \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430 \u043F\u043E\u043C\u0435\u0447\u0430\u0435\u0442\u0441\u044F aria-current="true". */\n.list-select {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  margin: 0;\n  padding: 6px;\n  list-style: none;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n}\n\n.list-select__item {\n  display: block;\n  padding: 8px 10px;\n  border-radius: var(--radius-sm);\n  color: var(--text);\n  text-decoration: none;\n}\n\n.list-select__item:hover {\n  background: var(--hover);\n}\n\n.list-select__item[aria-current="true"] {\n  background: var(--accent-soft);\n  box-shadow: inset 3px 0 0 var(--accent);\n  font-weight: 600;\n}\n\n/* \u0428\u0430\u0433\u0438 \u043C\u0430\u0441\u0442\u0435\u0440\u0430: \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043D\u044B\u0435, \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u0438 \u043E\u0441\u0442\u0430\u0432\u0448\u0438\u0435\u0441\u044F \u0440\u0430\u0437\u043B\u0438\u0447\u0430\u044E\u0442\u0441\u044F \u043A\u0440\u0443\u0436\u043A\u043E\u043C. */\n.steps {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px 20px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  counter-reset: step;\n}\n\n.step {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  color: var(--text-muted);\n  counter-increment: step;\n}\n\n.step::before {\n  content: counter(step);\n  display: inline-grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  font-size: 12px;\n  font-weight: 600;\n  border: 1px solid var(--border-strong);\n  background: var(--surface);\n}\n\n.step--done {\n  color: var(--text-soft);\n}\n\n.step--done::before {\n  content: "\u2713";\n  color: var(--accent);\n  border-color: var(--accent-border);\n  background: var(--accent-soft);\n}\n\n.step--current {\n  color: var(--text);\n  font-weight: 600;\n}\n\n.step--current::before {\n  color: var(--accent-contrast);\n  background: var(--accent);\n  border-color: var(--accent);\n}\n\n@media (max-width: 720px) {\n  .app-shell--side {\n    grid-template-columns: minmax(0, 1fr);\n    grid-template-rows: auto auto 1fr;\n  }\n\n  /* \u041C\u0435\u043D\u044E \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u043E\u0439 \u043F\u043E\u043B\u043E\u0441\u043E\u0439 \u043F\u043E\u0434 \u0448\u0430\u043F\u043A\u043E\u0439. */\n  .side-nav {\n    flex-direction: row;\n    overflow-x: auto;\n    padding: 8px 16px;\n    border-right: 0;\n    border-bottom: 1px solid var(--border);\n  }\n\n  .side-nav a {\n    white-space: nowrap;\n  }\n\n  .split {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n\n/* \u2500\u2500 \u0423\u0437\u043A\u043E\u0435 \u043E\u043A\u043D\u043E \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n@media (max-width: 700px) {\n  main,\n  .page {\n    padding: 16px;\n  }\n\n  .app-bar {\n    padding: 12px 16px;\n  }\n\n  .fields-grid {\n    grid-template-columns: 1fr;\n  }\n}\n';

// ../../usr/local/lib/node_modules/@iskra/apps/dist/ui.js
var APP_STYLESHEET_PATH = "iskra.css";
var APP_STYLESHEET_CONTENT_TYPE = "text/css; charset=utf-8";
var APP_CSP = "default-src 'self'; object-src 'none'; frame-ancestors 'none'";
var stylesheetETag = `"${createHash("sha256").update(appStylesheet).digest("base64url")}"`;
function appStylesheetResponse(request) {
  const headers = {
    "content-type": APP_STYLESHEET_CONTENT_TYPE,
    "cache-control": "no-cache",
    etag: stylesheetETag
  };
  if (request?.headers.get("if-none-match") === stylesheetETag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(appStylesheet, { status: 200, headers });
}
var APP_TITLE_HEADER = "x-iskra-app-title";
function appTitle(request, fallback) {
  const raw2 = request.headers.get(APP_TITLE_HEADER);
  if (!raw2)
    return fallback;
  try {
    const title = decodeURIComponent(raw2).trim();
    return title || fallback;
  } catch {
    return fallback;
  }
}
var APP_HOME_URL_HEADER = "x-iskra-home-url";
var APP_VIEWER_NAME_HEADER = "x-iskra-viewer-name";
function appHomeURL(request) {
  const raw2 = request.headers.get(APP_HOME_URL_HEADER)?.trim();
  if (!raw2)
    return null;
  try {
    const url = new URL(raw2);
    if (url.protocol !== "https:" && url.protocol !== "http:" || url.username || url.password)
      return null;
    return raw2;
  } catch {
    return null;
  }
}
function appViewerName(request) {
  const raw2 = request.headers.get(APP_VIEWER_NAME_HEADER);
  if (!raw2)
    return null;
  try {
    return decodeURIComponent(raw2).trim() || null;
  } catch {
    return null;
  }
}
function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => [...word][0].toUpperCase()).join("");
}
var BRAND_LOGO = '<svg class="app-bar__logo" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect class="app-bar__logo-bg" width="24" height="24" rx="6"/><path class="app-bar__logo-spark" d="M12 5l1.7 4.9 4.9 1.7-4.9 1.7L12 18.2l-1.7-4.9-4.9-1.7 4.9-1.7z"/></svg>';
var BRAND_TEXT = `${BRAND_LOGO}<b>Iskra</b> Apps`;
var PAGE_STRINGS = {
  ru: { home: "\u0412\u0441\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0432 \u0418\u0441\u043A\u0440\u0435", sections: "\u0420\u0430\u0437\u0434\u0435\u043B\u044B" },
  en: { home: "All apps in Iskra", sections: "Sections" }
};
function pageStrings(lang) {
  return lang.trim().toLowerCase().split("-")[0] === "en" ? PAGE_STRINGS.en : PAGE_STRINGS.ru;
}
function appPage(options) {
  const style = options.style ?? "iskra";
  if (!isAppStyle(style)) {
    throw new Error(`\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F ${JSON.stringify(style)}; \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B: ${APP_STYLES.join(", ")}`);
  }
  const styleAttr = style === "iskra" ? "" : ` data-style="${style}"`;
  const lang = options.lang ?? "ru";
  const strings = pageStrings(lang);
  const links = (options.nav ?? []).map((link) => `<a href="${escapeHTML(link.href)}"${link.current ? ' aria-current="page"' : ""}>${escapeHTML(link.label)}</a>`).join("");
  const side = options.navPosition === "side" && links !== "";
  const title = escapeHTML(options.title);
  const homeURL = options.request ? appHomeURL(options.request) : null;
  const viewer = options.request ? appViewerName(options.request) : null;
  const brand = homeURL ? `<a class="app-bar__brand" href="${escapeHTML(homeURL)}" title="${escapeHTML(strings.home)}">${BRAND_TEXT}</a>` : `<span class="app-bar__brand">${BRAND_TEXT}</span>`;
  const viewerBlock = viewer ? `<span class="app-bar__viewer" title="${escapeHTML(viewer)}"><span class="app-bar__avatar" aria-hidden="true">${escapeHTML(initials(viewer))}</span><span class="app-bar__viewer-name">${escapeHTML(viewer)}</span></span>` : "";
  const topNav = links && !side ? `<nav class="nav">${links}</nav>` : "";
  const sideNav = side ? `<nav class="side-nav" aria-label="${escapeHTML(strings.sections)}">${links}</nav>
` : "";
  return `<!doctype html>
<html lang="${escapeHTML(lang)}"${styleAttr}>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<link rel="stylesheet" href="${APP_STYLESHEET_PATH}" />
${options.head ?? ""}
</head>
<body${side ? ' class="app-shell--side"' : ""}>
<header class="app-bar">
${brand}
<span class="app-bar__sep" aria-hidden="true">/</span>
<h1 class="app-bar__title">${title}</h1>
<span class="app-bar__spacer"></span>
${topNav}
${viewerBlock}
</header>
${sideNav}<main class="page${options.wide ? " page--wide" : ""}">
${options.body}
</main>
</body>
</html>
`;
}
function escapeHTML(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ../../usr/local/lib/node_modules/@iskra/apps/dist/app-api.js
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/http-exception.js
var HTTPException = class extends Error {
  res;
  status;
  /**
  * Creates an instance of `HTTPException`.
  * @param status - HTTP status code for the exception. Defaults to 500.
  * @param options - Additional options for the exception.
  */
  constructor(status = 500, options) {
    super(options?.message, { cause: options?.cause });
    this.res = options?.res;
    this.status = status;
  }
  /**
  * Returns the response object associated with the exception.
  * If a response object is not provided, a new response is created with the error message and status code.
  * @returns The response object.
  */
  getResponse() {
    if (this.res) return new Response(this.res.body, {
      status: this.status,
      headers: this.res.headers
    });
    return new Response(this.message, { status: this.status });
  }
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType2) => {
  return new Response(arrayBuffer, { headers: { "Content-Type": contentType2.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase()) } }).formData();
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/utils/body.js
var MAX_NESTED_OBJECTS = 1e4;
var isRawRequest = (request) => "headers" in request;
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const mediaType = (isRawRequest(request) ? request.headers : request.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") return parseFormData(request, {
    all,
    dot
  });
  return {};
};
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) return convertFormDataToBodyData(await request.bodyCache.formData, options);
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) request.bodyCache.formData = formDataPromise;
  const formData = await formDataPromise;
  if (formData) return convertFormDataToBodyData(formData, options);
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  const nestingState = { count: 0 };
  formData.forEach((value, key) => {
    if (!(options.all || key.endsWith("[]"))) form[key] = value;
    else handleParsingAllValues(form, key, value);
  });
  if (options.dot) Object.entries(form).forEach(([key, value]) => {
    if (key.includes(".")) {
      handleParsingNestedValues(form, key, value, nestingState);
      delete form[key];
    }
  });
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) form[key].push(value);
    else form[key] = [form[key], value];
  } else if (!key.endsWith("[]")) form[key] = value;
  else form[key] = [value];
};
var handleParsingNestedValues = (form, key, value, state) => {
  if (/(?:^|\.)__proto__\./.test(key)) return;
  let nestedForm = form;
  const keys = key.split(".", 34);
  if (keys.length > 33) throwNestingLimitExceeded();
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) nestedForm[key2] = value;
    else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        if (state.count++ >= MAX_NESTED_OBJECTS) throwNestingLimitExceeded();
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};
var throwNestingLimitExceeded = () => {
  throw new Error("Nesting limit exceeded");
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") paths.shift();
  return paths;
};
var splitRoutingPath = (routePath2) => {
  const { groups, path } = extractGroupsFromPath(routePath2);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return {
    groups,
    path
  };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) if (paths[j].includes(mark)) {
      paths[j] = paths[j].replace(mark, groups[i][1]);
      break;
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") return "*";
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey2 = `${label}#${next}`;
    if (!patternCache[cacheKey2]) {
      if (match2[2]) patternCache[cacheKey2] = next && next[0] !== ":" && next[0] !== "*" ? [
        cacheKey2,
        match2[1],
        new RegExp(`^${match2[2]}(?=/${next})`)
      ] : [
        label,
        match2[1],
        new RegExp(`^${match2[2]}$`)
      ];
      else patternCache[cacheKey2] = [
        label,
        match2[1],
        true
      ];
    }
    return patternCache[cacheKey2];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var decodeURIWithPreservedPercent = (value) => decodeURI(value.includes("%25") ? value.replace(/%25/g, "%2525") : value);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      const decoded = tryDecode(path, decodeURIWithPreservedPercent);
      if (/%(?![0-9A-Fa-f]{2})/.test(path)) {
        const rewritten = new URL("http://localhost");
        rewritten.pathname = decoded.replace(/[\\\t\n\r]/g, encodeURIComponent);
        if (tryDecode(rewritten.pathname, decodeURIWithPreservedPercent) !== decoded) return tryDecode(path.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"), decodeURIWithPreservedPercent);
      }
      return decoded;
    } else if (charCode === 63 || charCode === 35) break;
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) sub = mergePath(sub, ...rest);
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) return null;
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) basePath += "/" + segment;
    else if (/\:/.test(segment)) {
      if (segment.charCodeAt(segment.length - 1) === 63) {
        if (results.length === 0 && basePath === "") results.push("/");
        else results.push(basePath);
        const optionalSegment = segment.slice(0, -1);
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else basePath += "/" + segment;
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var tryDecodeURIComponent = (str) => str.indexOf("%") !== -1 ? tryDecode(str, decodeURIComponent_) : str;
var _decodeURI = (value) => {
  if (value.indexOf("+") !== -1) value = value.replace(/\+/g, " ");
  return tryDecodeURIComponent(value);
};
var _getQueryParam = (url, key, multiple) => {
  const hashIndex = url.indexOf("#", 8);
  if (hashIndex !== -1) url = url.slice(0, hashIndex);
  let encoded;
  if (!multiple && key && !/[%+&=]/.test(key)) {
    const queryIndex = url.indexOf("?", 8);
    let keyIndex2 = queryIndex;
    if (keyIndex2 === -1) return;
    if (!url.startsWith(key, keyIndex2 + 1)) keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61 || trailingKeyCode === 38 || isNaN(trailingKeyCode)) {
        if (keyIndex2 > queryIndex && /(?:^|&)[^=&]*[%+]/.test(url.slice(queryIndex + 1, keyIndex2))) break;
        if (trailingKeyCode === 61) {
          const valueIndex = keyIndex2 + key.length + 2;
          const endIndex = url.indexOf("&", valueIndex);
          return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
        }
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) return;
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) valueIndex = -1;
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex);
    if (encoded) name = _decodeURI(name);
    keyIndex = nextKeyIndex;
    if (name === "") continue;
    let value;
    if (valueIndex === -1) value = "";
    else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) value = _decodeURI(value);
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) results[name] = [];
      results[name].push(value);
    } else results[name] ??= value;
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/request.js
var HonoRequest = class {
  /**
  * `.raw` can get the raw Request object.
  *
  * @see {@link https://hono.dev/docs/api/request#raw}
  *
  * @example
  * ```ts
  * // For Cloudflare Workers
  * app.post('/', async (c) => {
  *   const metadata = c.req.raw.cf?.hostMetadata?
  *   ...
  * })
  * ```
  */
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  /**
  * `.path` can get the pathname of the request.
  *
  * @see {@link https://hono.dev/docs/api/request#path}
  *
  * @example
  * ```ts
  * app.get('/about/me', (c) => {
  *   const pathname = c.req.path // `/about/me`
  * })
  * ```
  */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex]?.[1][key];
    const param = this.#getParamValue(paramKey);
    return param && tryDecodeURIComponent(param);
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex]?.[1] ?? {});
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) decoded[key] = tryDecodeURIComponent(value);
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) return this.raw.headers.get(name) ?? void 0;
    const headerData = /* @__PURE__ */ Object.create(null);
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) return cachedBody;
    for (const anyCachedKey in bodyCache) return bodyCache[anyCachedKey].then((body) => {
      if (anyCachedKey === "json") body = JSON.stringify(body);
      const contentType2 = anyCachedKey === "formData" ? void 0 : raw2.headers.get("content-type");
      return new Response(body, { headers: contentType2 ? { "Content-Type": contentType2 } : void 0 })[key]();
    });
    return bodyCache[key] = raw2[key]();
  };
  /**
  * `.json()` can parse Request body of type `application/json`
  *
  * @see {@link https://hono.dev/docs/api/request#json}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.json()
  * })
  * ```
  */
  json() {
    return this.#cachedBody("text").then((text2) => JSON.parse(text2));
  }
  /**
  * `.text()` can parse Request body of type `text/plain`
  *
  * @see {@link https://hono.dev/docs/api/request#text}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.text()
  * })
  * ```
  */
  text() {
    return this.#cachedBody("text");
  }
  /**
  * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
  *
  * @see {@link https://hono.dev/docs/api/request#arraybuffer}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.arrayBuffer()
  * })
  * ```
  */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
  * `.bytes()` parses the request body as a `Uint8Array`.
  *
  * @see {@link https://hono.dev/docs/api/request#bytes}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.bytes()
  * })
  * ```
  */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
  * Parses the request body as a `Blob`.
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.blob();
  * });
  * ```
  * @see https://hono.dev/docs/api/request#blob
  */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
  * Parses the request body as `FormData`.
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.formData();
  * });
  * ```
  * @see https://hono.dev/docs/api/request#formdata
  */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
  * Adds validated data to the request.
  *
  * @param target - The target of the validation.
  * @param data - The validated data to add.
  */
  addValidatedData(target, data) {
    (this.#validatedData ??= {})[target] = data;
  }
  valid(target) {
    return this.#validatedData?.[target];
  }
  /**
  * `.url` can get the request url strings.
  *
  * @see {@link https://hono.dev/docs/api/request#url}
  *
  * @example
  * ```ts
  * app.get('/about/me', (c) => {
  *   const url = c.req.url // `http://localhost:8787/about/me`
  *   ...
  * })
  * ```
  */
  get url() {
    return this.raw.url;
  }
  /**
  * `.method` can get the method name of the request.
  *
  * @see {@link https://hono.dev/docs/api/request#method}
  *
  * @example
  * ```ts
  * app.get('/about/me', (c) => {
  *   const method = c.req.method // `GET`
  * })
  * ```
  */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
  * `.matchedRoutes` can return a matched route in the handler
  *
  * @deprecated
  *
  * Use matchedRoutes helper defined in "hono/route" instead.
  *
  * @see {@link https://hono.dev/docs/api/request#matchedroutes}
  *
  * @example
  * ```ts
  * app.use('*', async function logger(c, next) {
  *   await next()
  *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
  *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
  *     console.log(
  *       method,
  *       ' ',
  *       path,
  *       ' '.repeat(Math.max(10 - path.length, 0)),
  *       name,
  *       i === c.req.routeIndex ? '<- respond from here' : ''
  *     )
  *   })
  * })
  * ```
  */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
  * `.routePath` can retrieve the path registered within the handler
  *
  * @deprecated
  *
  * Use routePath helper defined in "hono/route" instead.
  *
  * @see {@link https://hono.dev/docs/api/request#routepath}
  *
  * @example
  * ```ts
  * app.get('/posts/:id', (c) => {
  *   return c.json({ path: c.req.routePath })
  * })
  * ```
  */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) str = str.toString();
    if (str instanceof Promise) str = await str;
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) return Promise.resolve(str);
  if (buffer) buffer[0] += str;
  else buffer = [str];
  const resStr = Promise.all(callbacks.map((c) => c({
    phase,
    buffer,
    context
  }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
  if (preserveCallbacks) return raw(await resStr, callbacks);
  else return resStr;
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType2, headers) => {
  return {
    "Content-Type": contentType2,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  /**
  * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
  *
  * @see {@link https://hono.dev/docs/api/context#env}
  *
  * @example
  * ```ts
  * // Environment object for Cloudflare Workers
  * app.get('*', async c => {
  *   const counter = c.env.COUNTER
  * })
  * ```
  */
  env = {};
  #var;
  finalized = false;
  /**
  * `.error` can get the error object from the middleware if the Handler throws an error.
  *
  * @see {@link https://hono.dev/docs/api/context#error}
  *
  * @example
  * ```ts
  * app.use('*', async (c, next) => {
  *   await next()
  *   if (c.error) {
  *     // do something...
  *   }
  * })
  * ```
  */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
  * Creates an instance of the Context class.
  *
  * @param req - The Request object.
  * @param options - Optional configuration options for the context.
  */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
  * `.req` is the instance of {@link HonoRequest}.
  */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
  * @see {@link https://hono.dev/docs/api/context#event}
  * The FetchEvent associated with the current request.
  *
  * @throws Will throw an error if the context does not have a FetchEvent.
  */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) return this.#executionCtx;
    else throw Error("This context has no FetchEvent");
  }
  /**
  * @see {@link https://hono.dev/docs/api/context#executionctx}
  * The ExecutionContext associated with the current request.
  *
  * @throws Will throw an error if the context does not have an ExecutionContext.
  */
  get executionCtx() {
    if (this.#executionCtx) return this.#executionCtx;
    else throw Error("This context has no ExecutionContext");
  }
  /**
  * @see {@link https://hono.dev/docs/api/context#res}
  * The Response object for the current request.
  */
  get res() {
    return this.#res ||= createResponseInstance(null, { headers: this.#preparedHeaders ??= new Headers() });
  }
  /**
  * Sets the Response object for the current request.
  *
  * @param _res - The Response object to set.
  */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") continue;
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) _res.headers.append("set-cookie", cookie);
        } else _res.headers.set(k, v);
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
  * `.render()` can create a response within a layout.
  *
  * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
  *
  * @example
  * ```ts
  * app.get('/', (c) => {
  *   return c.render('Hello!')
  * })
  * ```
  */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
  * Sets the layout for the response.
  *
  * @param layout - The layout to set.
  * @returns The layout function.
  */
  setLayout = (layout) => this.#layout = layout;
  /**
  * Gets the current layout for the response.
  *
  * @returns The current layout function.
  */
  getLayout = () => this.#layout;
  /**
  * `.setRenderer()` can set the layout in the custom middleware.
  *
  * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
  *
  * @example
  * ```tsx
  * app.use('*', async (c, next) => {
  *   c.setRenderer((content) => {
  *     return c.html(
  *       <html>
  *         <body>
  *           <p>{content}</p>
  *         </body>
  *       </html>
  *     )
  *   })
  *   await next()
  * })
  * ```
  */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
  * `.header()` can set headers.
  *
  * @see {@link https://hono.dev/docs/api/context#header}
  *
  * @example
  * ```ts
  * app.get('/welcome', (c) => {
  *   // Set headers
  *   c.header('X-Message', 'Hello!')
  *   c.header('Content-Type', 'text/plain')
  *
  *   // Append multiple headers using the append option (e.g. Vary)
  *   c.header('Vary', 'Accept-Encoding', { append: true })
  *   c.header('Vary', 'User-Agent', { append: true })
  *
  *   return c.body('Thank you for coming')
  * })
  * ```
  */
  header = (name, value, options) => {
    if (this.finalized && !this.#res.bodyUsed) this.#res = createResponseInstance(this.#res.body, this.#res);
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) headers.delete(name);
    else if (options?.append) headers.append(name, value);
    else headers.set(name, value);
  };
  status = (status) => {
    this.#status = status;
  };
  /**
  * `.set()` can set the value specified by the key.
  *
  * @see {@link https://hono.dev/docs/api/context#set-get}
  *
  * @example
  * ```ts
  * app.use('*', async (c, next) => {
  *   c.set('message', 'Hono is hot!!')
  *   await next()
  * })
  * ```
  */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
  * `.get()` can use the value specified by the key.
  *
  * @see {@link https://hono.dev/docs/api/context#set-get}
  *
  * @example
  * ```ts
  * app.get('/', (c) => {
  *   const message = c.get('message')
  *   return c.text(`The message is "${message}"`)
  * })
  * ```
  */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
  * `.var` can access the value of a variable.
  *
  * @see {@link https://hono.dev/docs/api/context#var}
  *
  * @example
  * ```ts
  * const result = c.var.client.oneMethod()
  * ```
  */
  get var() {
    if (!this.#var) return {};
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
    if (typeof arg === "object" && arg.headers) {
      responseHeaders ??= new Headers();
      for (const [key, value] of new Headers(arg.headers)) if (key === "set-cookie") responseHeaders.append(key, value);
      else responseHeaders.set(key, value);
    }
    if (headers) {
      if (!responseHeaders) {
        let count = 0;
        for (const k in headers) if (++count > 1 || typeof headers[k] !== "string") {
          responseHeaders = new Headers();
          break;
        }
      }
      if (responseHeaders) for (const k in headers) {
        const v = headers[k];
        if (typeof v === "string") responseHeaders.set(k, v);
        else {
          responseHeaders.delete(k);
          for (const v2 of v) responseHeaders.append(k, v2);
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, {
      status,
      headers: responseHeaders ?? headers
    });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
  * `.body()` can return the HTTP response.
  * You can set headers with `.header()` and set HTTP status code with `.status`.
  * This can also be set in `.text()`, `.json()` and so on.
  *
  * @see {@link https://hono.dev/docs/api/context#body}
  *
  * @example
  * ```ts
  * app.get('/welcome', (c) => {
  *   // Set headers
  *   c.header('X-Message', 'Hello!')
  *   c.header('Content-Type', 'text/plain')
  *   // Set HTTP status code
  *   c.status(201)
  *
  *   // Return the response body
  *   return c.body('Thank you for coming')
  * })
  * ```
  */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
  * `.text()` can render text as `Content-Type:text/plain`.
  *
  * @see {@link https://hono.dev/docs/api/context#text}
  *
  * @example
  * ```ts
  * app.get('/say', (c) => {
  *   return c.text('Hello!')
  * })
  * ```
  */
  text = (text2, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text2) : this.#newResponse(text2, arg, setDefaultContentType(TEXT_PLAIN, headers));
  };
  /**
  * `.json()` can render JSON as `Content-Type:application/json`.
  *
  * @see {@link https://hono.dev/docs/api/context#json}
  *
  * @example
  * ```ts
  * app.get('/api', (c) => {
  *   return c.json({ message: 'Hello!' })
  * })
  * ```
  */
  json = (object, arg, headers) => {
    return this.#newResponse(JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
  * `.redirect()` can Redirect, default status code is 302.
  *
  * @see {@link https://hono.dev/docs/api/context#redirect}
  *
  * @example
  * ```ts
  * app.get('/redirect', (c) => {
  *   return c.redirect('/')
  * })
  * app.get('/redirect-permanently', (c) => {
  *   return c.redirect('/', 301)
  * })
  * ```
  */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header("Location", !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString));
    return this.newResponse(null, status ?? 302);
  };
  /**
  * `.notFound()` can return the Not Found Response.
  *
  * @see {@link https://hono.dev/docs/api/context#notfound}
  *
  * @example
  * ```ts
  * app.get('/notfound', (c) => {
  *   return c.notFound()
  * })
  * ```
  */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else handler = i === middleware.length && next || void 0;
      if (handler) try {
        res = await handler(context, () => dispatch(i + 1));
      } catch (err) {
        if (err instanceof Error && onError) {
          context.error = err;
          res = await onError(err, context);
          isError = true;
        } else throw err;
      }
      else if (context.finalized === false && onNotFound) res = await onNotFound(context);
      if (res && (context.finalized === false || isError)) context.res = res;
      return context;
    }
  };
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/helper/route/index.js
var matchedRoutes = (c) => c.req[GET_MATCH_RESULT][0].map(([[, route]]) => route);
var routePath = (c, index) => matchedRoutes(c).at(index ?? c.req.routeIndex)?.path ?? "";

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/router.js
var METHODS = [
  "get",
  "post",
  "put",
  "delete",
  "options",
  "patch",
  "query"
];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/utils/mount.js
var countTrailingSlashes = (path) => {
  let index = path.length;
  while (index > 0 && path.charCodeAt(index - 1) === 47) index--;
  return path.length - index;
};
var getPathPrefixLength = (c, pathPrefix, routePath2) => {
  if (!/[:*]/.test(pathPrefix)) return pathPrefix.length;
  const path = c.req.path;
  const matchResult = c.req[GET_MATCH_RESULT];
  const paramNames = /* @__PURE__ */ new Set();
  let length = 0;
  for (const part of splitRoutingPath(pathPrefix)) {
    if (part[0] === ":" && part.endsWith("}?")) throw new Error(`mount(): Optional regular expression parameters are not supported in "${routePath2}".`);
    const pattern = getPattern(part);
    if (pattern && pattern !== "*") {
      const name = pattern[1];
      if (paramNames.has(name)) throw new Error(`mount(): Duplicate path parameter "${name}" in "${routePath2}".`);
      paramNames.add(name);
    }
    if (pattern && pattern !== "*" && pattern[2] !== true) {
      const value = matchResult.length === 2 ? matchResult[1][matchResult[0][c.req.routeIndex][1][pattern[1]]] : matchResult[0][c.req.routeIndex][1][pattern[1]];
      length += value.length + 1;
    } else if (pattern || part.endsWith("*")) {
      const end = path.indexOf("/", length + 1);
      length = end === -1 ? path.length : end;
    } else length += part.length + 1;
  }
  return length;
};
var createMountedRequest = (c, pathPrefix, routePath2) => {
  if (/[^/]\*$/.test(routePath2)) throw new Error(`mount(): Wildcard must follow "/" in "${routePath2}".`);
  const prefixLength = getPathPrefixLength(c, pathPrefix, routePath2);
  const path = c.req.path.slice(prefixLength) || "/";
  if (prefixLength > c.req.path.length || path[0] !== "/" || /\/(?:\.|%2e){1,2}(?:\/|$)/i.test(path)) throw new HTTPException(400, { message: "Invalid mounted path" });
  const rawUrl = c.req.raw.url;
  if (/^[^/?#]*\/\/[^/?#\\]*[?#\\]/.test(rawUrl)) throw new HTTPException(400, { message: "Invalid mounted path" });
  const rawPathEnd = rawUrl.search(/[?#]/);
  const rawTrailingSlashes = countTrailingSlashes(rawPathEnd === -1 ? rawUrl : rawUrl.slice(0, rawPathEnd));
  if (rawTrailingSlashes > 1 && countTrailingSlashes(c.req.path) === rawTrailingSlashes - 1) throw new HTTPException(400, { message: "Invalid mounted path" });
  const url = new URL(rawUrl);
  url.pathname = path.replace(/[\\\t\n\r]/g, encodeURIComponent);
  if (path.includes("%")) {
  }
  return new Request(url, c.req.raw);
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class Hono2 {
  get;
  post;
  put;
  delete;
  options;
  patch;
  query;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    [...METHODS, "all"].forEach((method) => {
      this[method] = (args1, ...args) => {
        const methodName = method.toUpperCase();
        if (typeof args1 === "string") this.#path = args1;
        else this.#addRoute(methodName, this.#path, args1);
        args.forEach((handler) => {
          this.#addRoute(methodName, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          const methodName = m.toUpperCase();
          for (const handler of handlers) this.#addRoute(methodName, this.#path, handler);
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") this.#path = arg1;
      else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute("ALL", this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono2({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  /**
  * `.route()` allows grouping other Hono instance in routes.
  *
  * @see {@link https://hono.dev/docs/api/routing#grouping}
  *
  * @param {string} path - base Path
  * @param {Hono} app - other Hono instance
  * @returns {Hono} routed Hono instance
  *
  * @example
  * ```ts
  * const app = new Hono()
  * const app2 = new Hono()
  *
  * app2.get("/user", (c) => c.text("user"))
  * app.route("/api", app2) // GET /api/user
  * ```
  */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) handler = r.handler;
      else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
  * `.basePath()` allows base paths to be specified.
  *
  * @see {@link https://hono.dev/docs/api/routing#base-path}
  *
  * @param {string} path - base Path
  * @returns {Hono} changed Hono instance
  *
  * @example
  * ```ts
  * const api = new Hono().basePath('/api')
  * ```
  */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
  * `.onError()` handles an error and returns a customized Response.
  *
  * @see {@link https://hono.dev/docs/api/hono#error-handling}
  *
  * @param {ErrorHandler} handler - request Handler for error
  * @returns {Hono} changed Hono instance
  *
  * @example
  * ```ts
  * app.onError((err, c) => {
  *   console.error(`${err}`)
  *   return c.text('Custom Error Message', 500)
  * })
  * ```
  */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
  * `.notFound()` allows you to customize a Not Found Response.
  *
  * @see {@link https://hono.dev/docs/api/hono#not-found}
  *
  * @param {NotFoundHandler} handler - request handler for not-found
  * @returns {Hono} changed Hono instance
  *
  * @example
  * ```ts
  * app.notFound((c) => {
  *   return c.text('Custom 404 Message', 404)
  * })
  * ```
  */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
  * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
  *
  * @deprecated Use `mount()` from `hono/mount` instead. `.mount()` will be removed in v5.
  *
  * @see {@link https://hono.dev/docs/api/hono#mount}
  *
  * @param {string} path - base Path
  * @param {Function} applicationHandler - other Request Handler
  * @param {MountOptions} [options] - options of `.mount()`
  * @returns {Hono} mounted Hono instance
  * @throws {Error} If automatic request rewriting encounters duplicate path parameter names or an optional regular expression parameter.
  * @throws {HTTPException} With status 400 if automatic request rewriting cannot safely preserve the routed path.
  *
  * @example
  * ```ts
  * import { Router as IttyRouter } from 'itty-router'
  * import { Hono } from 'hono'
  * // Create itty-router application
  * const ittyRouter = IttyRouter()
  * // GET /itty-router/hello
  * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
  *
  * const app = new Hono()
  * app.mount('/itty-router', ittyRouter.handle)
  * ```
  *
  * @example
  * ```ts
  * const app = new Hono()
  * // Send the request to another application without modification.
  * app.mount('/app', anotherApp, {
  *   replaceRequest: (req) => req,
  * })
  * ```
  */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") optionHandler = options;
      else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) replaceRequest = (request) => request;
        else replaceRequest = options.replaceRequest;
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    const defaultReplaceRequest = (c) => {
      const mountedRoutePath = routePath(c);
      return createMountedRequest(c, mountedRoutePath.replace(/\/?\*$/, ""), mountedRoutePath);
    };
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest ? replaceRequest(c.req.raw) : defaultReplaceRequest(c), ...getOptions(c));
      if (res) return res;
      await next();
    };
    this.#addRoute("ALL", mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) return this.errorHandler(err, c);
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
  * `.fetch()` will be entry point of your app.
  *
  * @see {@link https://hono.dev/docs/api/hono#fetch}
  *
  * @param {Request} request - request Object of request
  * @param {Env} env - env Object
  * @param {ExecutionContext} executionCtx - context of execution
  * @returns {Response | Promise<Response>} response of request
  *
  */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
  * `.request()` is a useful method for testing.
  * You can pass a URL or pathname to send a GET request.
  * app will return a Response object.
  * ```ts
  * test('GET /hello is ok', async () => {
  *   const res = await app.request('/hello')
  *   expect(res.status).toBe(200)
  * })
  * ```
  * @see https://hono.dev/docs/api/hono#request
  */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    input = input.toString();
    return this.fetch(new Request(/^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`, requestInit), Env, executionCtx);
  };
  /**
  * `.fire()` automatically adds a global fetch event listener.
  * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
  * @deprecated
  * Use `fire` from `hono/service-worker` instead.
  * ```ts
  * import { Hono } from 'hono'
  * import { fire } from 'hono/service-worker'
  *
  * const app = new Hono()
  * // ...
  * fire(app)
  * ```
  * @see https://hono.dev/docs/api/hono#fire
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
  * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
  */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/router/utils.js
var createNullObject = () => /* @__PURE__ */ Object.create(null);

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path2) => {
    const matcher = matchers[method2] || matchers["ALL"];
    const staticMatch = matcher[2][path2];
    if (staticMatch) return staticMatch;
    const match3 = path2.match(matcher[0]);
    if (!match3) return [[], emptyParam];
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  });
  this.match = match2;
  return match2(method, path);
}

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = "[^]*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/[^]*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = /* @__PURE__ */ new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) return b.length === 1 ? a < b ? -1 : 1 : -1;
  if (b.length === 1) return 1;
  if (a === "[^]*" || a === "(?:|/[^]*)") return b === "[^]*" ? -1 : 1;
  else if (b === "[^]*" || b === "(?:|/[^]*)") return -1;
  if (a === "[^/]+") return 1;
  else if (b === "[^/]+") return -1;
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class Node2 {
  #index;
  #varIndex;
  #children = createNullObject();
  insert(tokens, index, paramMap, context, keys) {
    let node = this;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const token = tokens[i];
      const pattern = token.length === 1 ? token === "*" ? i === len - 1 ? [
        "",
        "",
        ONLY_WILDCARD_REG_EXP_STR
      ] : [
        "",
        "",
        LABEL_REG_EXP_STR
      ] : null : token === "/*" ? [
        "",
        "",
        TAIL_WILDCARD_REG_EXP_STR
      ] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let nextNode;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || "[^/]+";
        if (name && pattern[2]) {
          if (new RegExp(regexpStr).test("")) throw PATH_ERROR;
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) throw PATH_ERROR;
          if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) throw PATH_ERROR;
        }
        keys.push(regexpStr);
        nextNode = node.#children[regexpStr];
        if (!nextNode) {
          if (regexpStr !== "[^]*" && regexpStr !== "(?:|/[^]*)") {
            for (const k in node.#children) if ((regexpStr.length > 1 || k.length > 1) && k !== "[^]*" && k !== "(?:|/[^]*)") throw PATH_ERROR;
          }
          nextNode = node.#children[regexpStr] = new Node2();
        }
        if (name !== "") {
          nextNode.#varIndex ??= context.varIndex++;
          paramMap.push([name, nextNode.#varIndex]);
        }
      } else {
        keys.push(token);
        nextNode = node.#children[token];
        if (!nextNode) {
          for (const k in node.#children) if (k.length > 1 && k !== "[^]*" && k !== "(?:|/[^]*)") throw PATH_ERROR;
          nextNode = node.#children[token] = new Node2();
        }
      }
      node = nextNode;
    }
    if (node.#index !== void 0) throw PATH_ERROR;
    node.#index = index;
  }
  buildRegExpStr() {
    const strList = Object.keys(this.#children).sort(compareKey).map((k) => {
      const c = this.#children[k];
      const childStr = c.buildRegExpStr();
      return childStr === "" ? "" : (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + childStr;
    }).filter(Boolean);
    if (typeof this.#index === "number" && this.#index !== -1) strList.unshift(`#${this.#index}`);
    if (strList.length === 0) return "";
    if (strList.length === 1) return strList[0];
    return "(?:" + strList.join("|") + ")";
  }
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  #index = 0;
  paths = createNullObject();
  insert(path, isStatic) {
    const keys = [];
    if (isStatic) {
      this.#root.insert(path.split(""), -1, [], this.#context, keys);
      this.paths[path] = [
        -1,
        [],
        keys
      ];
      return;
    }
    const paramAssoc = [];
    const groups = [];
    let markedPath = path;
    for (let i = 0; ; ) {
      let replaced = false;
      markedPath = markedPath.replace(/\{(?:\{[\d,]+\}|[^}])+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) break;
    }
    const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./gs) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) if (tokens[j].indexOf(mark) !== -1) {
        tokens[j] = tokens[j].replace(mark, groups[i][1]);
        break;
      }
    }
    this.#root.insert(tokens, this.#index, paramAssoc, this.#context, keys);
    this.paths[path] = [
      this.#index++,
      paramAssoc,
      keys
    ];
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") return [
      /^$/,
      [],
      []
    ];
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [
      new RegExp(`^${regexp}`),
      indexReplacementMap,
      paramReplacementMap
    ];
  }
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/router/reg-exp-router/router.js
function endsWithWildcard(keys) {
  const tail = keys[keys.length - 1];
  return tail === "[^]*" || tail === "(?:|/[^]*)";
}
function covers(wildcard, target) {
  const last = wildcard.length - 1;
  for (let i = 0; i < last; i++) if (wildcard[i] !== target[i]) return false;
  return wildcard[last] === "[^]*" || target.length === last || target[last] === "/";
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #handlers;
  #tries;
  constructor() {
    this.#handlers = { ["ALL"]: [] };
    this.#tries = { ["ALL"]: new Trie() };
  }
  #insertPath(method, path) {
    try {
      this.#tries[method].insert(path, !/\*|\/:/.test(path));
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
  }
  add(method, path, handler) {
    const handlers = this.#handlers;
    if (!handlers) throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    const tries = this.#tries;
    if (!handlers[method]) {
      tries[method] = new Trie();
      handlers[method] = [...handlers["ALL"]];
      for (const p in tries["ALL"].paths) this.#insertPath(method, p);
    }
    if (path === "/*") path = "*";
    const methods = method === "ALL" ? Object.keys(handlers) : [method];
    const paths = checkOptionalParameter(path) || [path];
    for (const path2 of paths) for (const m of methods) {
      if (!tries[m].paths[path2]) this.#insertPath(m, path2);
      handlers[m].push([handler, path2]);
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = createNullObject();
    for (const method of Object.keys(this.#handlers)) matchers[method] = this.#buildMatcher(method);
    this.#handlers = this.#tries = void 0;
    return matchers;
  }
  #buildMatcher(method) {
    const handlers = this.#handlers[method];
    const trie = this.#tries[method];
    const staticMap = createNullObject();
    const handlerData = [];
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    const own = createNullObject();
    const entries = handlers.map(([h, p], i) => {
      (own[p] ??= []).push(i);
      return [h, trie.paths[p][1].reduceRight((map, [key, varIndex]) => {
        map[key] = paramReplacementMap[varIndex];
        return map;
      }, createNullObject())];
    });
    const wildcards = Object.keys(own).filter((p) => endsWithWildcard(trie.paths[p][2]));
    for (const path in trie.paths) {
      const [index, , keys] = trie.paths[path];
      const indexes = [...own[path]];
      for (const p of wildcards) if (p !== path && covers(trie.paths[p][2], keys)) indexes.push(...own[p]);
      const data = indexes.sort((a, b) => a - b).map((i) => entries[i]);
      if (index === -1) {
        const last = Math.max(-1, ...data.flatMap(([, map]) => Object.values(map)));
        staticMap[path] = [data, last === -1 ? emptyParam : path.match(regexp).slice(0, last + 1)];
      } else handlerData[index] = data;
    }
    return [
      regexp,
      indexReplacementMap.map((i) => handlerData[i]),
      staticMap
    ];
  }
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    this.#routes.push([
      method,
      path,
      handler
    ]);
  }
  match(method, path) {
    if (!this.#routes) throw new Error("Fatal error");
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) router.add(...routes[i2]);
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) continue;
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) throw new Error("Fatal error");
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) throw new Error("No active router has been determined yet.");
    return this.#routers[0];
  }
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/router/trie-router/node.js
var emptyParams = createNullObject();
var order = 0;
var Node3 = class Node4 {
  #methods = [];
  #children = createNullObject();
  #patterns = [];
  #pattern;
  #params = emptyParams;
  insert(method, path, handler) {
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = /* @__PURE__ */ new Set();
    let i = 0;
    for (const p of parts) {
      const nextP = parts[++i];
      const pattern = getPattern(p, nextP) || (nextP === void 0 && p && p.indexOf("*") === p.length - 1 ? p : null);
      const isParam = Array.isArray(pattern);
      const key = isParam ? pattern[0] : pattern || p;
      const child = curNode.#children[key] ||= new Node4();
      if (pattern && !child.#pattern) {
        child.#pattern = pattern;
        curNode.#patterns.push(child);
      }
      curNode = child;
      if (isParam) possibleKeys.add(pattern[1]);
    }
    curNode.#methods.push({ [method]: {
      handler,
      possibleKeys: [...possibleKeys],
      score: ++order
    } });
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m["ALL"];
      if (handlerSet) {
        handlerSet.params = createNullObject();
        handlerSets.push(handlerSet);
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          handlerSet.params[key] = params?.[key] && !i2 ? params[key] : nodeParams[key] ?? params?.[key];
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    let curNodes = [this];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else tempNodes.push(nextNode);
        }
        for (const child of node.#patterns) {
          const pattern = child.#pattern;
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (typeof pattern === "string") {
            if (pattern === "*" || part.startsWith(pattern.slice(0, -1))) {
              this.#pushHandlerSets(handlerSets, child, method, node.#params);
              if (pattern === "*") {
                child.#params = params;
                tempNodes.push(child);
              }
            }
            continue;
          }
          const [, name, matcher] = pattern;
          if (!part && matcher === true) continue;
          if (matcher !== true) {
            if (!partOffsets) {
              partOffsets = [];
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.slice(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              if (!Object.hasOwn(params, name)) params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) this.#pushHandlerSets(handlerSets, child.#children["*"], method, node.#params, params);
              for (const _ in child.#children) {
                child.#params = params;
                const componentCount = m[0].match(/\//g)?.length ?? 0;
                (curNodesQueue[componentCount] ||= []).push(child);
                break;
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            if (!Object.hasOwn(params, name)) params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) this.#pushHandlerSets(handlerSets, child.#children["*"], method, params, node.#params);
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets[1]) handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node = new Node3();
  add(method, path, handler) {
    for (const result of checkOptionalParameter(path) || [path]) this.#node.insert(method, result, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/hono.js
var Hono3 = class extends Hono {
  /**
  * Creates an instance of the Hono class.
  *
  * @param options - Optional configuration options for the Hono instance.
  */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({ routers: [new RegExpRouter(), new TrieRouter()] });
  }
};

// ../../usr/local/lib/node_modules/@iskra/apps/dist/app-api-invocation.js
import { createHash as createHash2, timingSafeEqual as timingSafeEqual2 } from "node:crypto";

// ../../usr/local/lib/node_modules/@iskra/apps/dist/app-api-sqlite.js
import { constants as constants2, DatabaseSync } from "node:sqlite";

// ../../usr/local/lib/node_modules/@iskra/apps/dist/app-api.js
var operationPattern2 = new RegExp(appApiProfile.operation_pattern);

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/@hono/node-server/dist/utils/stream.mjs
import { Readable as Readable2 } from "node:stream";
import { versions } from "node:process";
var pr54206Applied = () => {
  const [major, minor] = versions.node.split(".").map((component) => parseInt(component));
  return major >= 23 || major === 22 && minor >= 7 || major === 20 && minor >= 18;
};
var useReadableToWeb = pr54206Applied();
var createStreamBody = (stream, useNativeReadableToWeb = useReadableToWeb) => {
  if (useNativeReadableToWeb) return Readable2.toWeb(stream);
  let controller;
  let settled = false;
  const cleanup = () => {
    stream.off("data", onData);
    stream.off("error", onError);
    stream.off("end", onTerminate);
    stream.off("close", onTerminate);
  };
  const settle = (callback) => {
    if (settled) return;
    settled = true;
    cleanup();
    callback?.();
  };
  const onData = (chunk) => {
    if (settled || !controller) return;
    controller.enqueue(chunk);
    if ((controller.desiredSize ?? 0) <= 0) stream.pause();
  };
  const onError = (error) => {
    settle(() => {
      controller?.error(error);
    });
  };
  const onTerminate = () => {
    settle(() => {
      controller?.close();
    });
  };
  return new ReadableStream({
    start(streamController) {
      controller = streamController;
      stream.on("data", onData);
      stream.on("error", onError);
      stream.on("end", onTerminate);
      stream.on("close", onTerminate);
      stream.pause();
    },
    pull() {
      if (!settled) stream.resume();
    },
    cancel() {
      settle();
      const ignoreError = () => {
      };
      stream.on("error", ignoreError);
      stream.once("close", () => stream.off("error", ignoreError));
      stream.destroy();
    }
  });
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/hono/dist/utils/mime.js
var getMimeType = (filename, mimes = baseMimes) => {
  const match2 = filename.match(/\.([a-zA-Z0-9]+?)$/);
  if (!match2) return;
  return mimes[match2[1].toLowerCase()];
};
var baseMimes = {
  aac: "audio/aac",
  avi: "video/x-msvideo",
  avif: "image/avif",
  av1: "video/av1",
  bin: "application/octet-stream",
  bmp: "image/bmp",
  css: "text/css; charset=utf-8",
  csv: "text/csv; charset=utf-8",
  eot: "application/vnd.ms-fontobject",
  epub: "application/epub+zip",
  gif: "image/gif",
  gz: "application/gzip",
  htm: "text/html; charset=utf-8",
  html: "text/html; charset=utf-8",
  ico: "image/x-icon",
  ics: "text/calendar; charset=utf-8",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript; charset=utf-8",
  json: "application/json",
  jsonld: "application/ld+json",
  map: "application/json",
  mid: "audio/x-midi",
  midi: "audio/x-midi",
  mjs: "text/javascript; charset=utf-8",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  mpeg: "video/mpeg",
  oga: "audio/ogg",
  ogv: "video/ogg",
  ogx: "application/ogg",
  opus: "audio/opus",
  otf: "font/otf",
  pdf: "application/pdf",
  png: "image/png",
  rtf: "application/rtf",
  svg: "image/svg+xml; charset=utf-8",
  tif: "image/tiff",
  tiff: "image/tiff",
  ts: "video/mp2t",
  ttf: "font/ttf",
  txt: "text/plain; charset=utf-8",
  wasm: "application/wasm",
  webm: "video/webm",
  weba: "audio/webm",
  webmanifest: "application/manifest+json",
  webp: "image/webp",
  woff: "font/woff",
  woff2: "font/woff2",
  xhtml: "application/xhtml+xml; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  zip: "application/zip",
  "3gp": "video/3gpp",
  "3g2": "video/3gpp2",
  gltf: "model/gltf+json",
  glb: "model/gltf-binary"
};

// ../../usr/local/lib/node_modules/@iskra/apps/node_modules/@hono/node-server/dist/serve-static.mjs
import { createReadStream, existsSync, statSync } from "node:fs";
import { join } from "node:path";
var COMPRESSIBLE_CONTENT_TYPE_REGEX = /^\s*(?:text\/[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i;
var ENCODINGS = {
  br: ".br",
  zstd: ".zst",
  gzip: ".gz"
};
var ENCODINGS_ORDERED_KEYS = Object.keys(ENCODINGS);
var getStats = (path) => {
  let stats;
  try {
    stats = statSync(path);
  } catch {
  }
  return stats;
};
var BYTE_RANGE_PATTERN = /^(?:bytes=)?(?!-$)(\d*)-(\d*)$/;
var parseByteRange = (range) => {
  const match2 = range.match(BYTE_RANGE_PATTERN);
  if (!match2) return;
  const [, start, end] = match2;
  if (start === "") return {
    type: "suffix",
    length: Number(end)
  };
  if (end === "") return {
    type: "open-ended",
    start: Number(start)
  };
  return {
    type: "bounded",
    start: Number(start),
    end: Number(end)
  };
};
var resolveByteRange = (spec, size) => {
  if (size === 0) return;
  if (spec.type === "suffix") {
    if (spec.length === 0) return;
    return {
      start: Math.max(size - spec.length, 0),
      end: size - 1
    };
  }
  const end = spec.type === "bounded" ? Math.min(spec.end, size - 1) : size - 1;
  if (spec.start >= size || spec.start > end) return;
  return {
    start: spec.start,
    end
  };
};
var tryDecode2 = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode2(str, decodeURI);
var serveStatic = (options = { root: "" }) => {
  const root = options.root || "";
  const optionPath = options.path;
  if (root !== "" && !existsSync(root)) console.error(`serveStatic: root path '${root}' is not found, are you sure it's correct?`);
  return async (c, next) => {
    if (c.finalized) return next();
    if (c.req.method !== "GET" && c.req.method !== "HEAD") return next();
    let filename;
    if (optionPath) filename = optionPath;
    else try {
      if (!options.allowPercentInPath && c.req.path.includes("%")) throw new Error();
      filename = tryDecodeURI(c.req.path);
      if (/(?:^|[\/\\])\.{1,2}(?:$|[\/\\])|[\/\\]{2,}|\\/.test(filename)) throw new Error();
    } catch {
      await options.onNotFound?.(c.req.path, c);
      return next();
    }
    let path = join(root, !optionPath && options.rewriteRequestPath ? options.rewriteRequestPath(filename, c) : filename);
    let stats = getStats(path);
    if (stats && stats.isDirectory()) {
      const indexFile = options.index ?? "index.html";
      path = join(path, indexFile);
      stats = getStats(path);
    }
    if (!stats) {
      await options.onNotFound?.(path, c);
      return next();
    }
    const mimeType = getMimeType(path);
    c.header("Content-Type", mimeType || "application/octet-stream");
    if (options.precompressed && (!mimeType || mimeType === "application/octet-stream" || COMPRESSIBLE_CONTENT_TYPE_REGEX.test(mimeType))) {
      const acceptEncodingSet = new Set(c.req.header("Accept-Encoding")?.split(",").map((encoding) => encoding.trim()));
      for (const encoding of ENCODINGS_ORDERED_KEYS) {
        if (!acceptEncodingSet.has(encoding)) continue;
        const precompressedStats = getStats(path + ENCODINGS[encoding]);
        if (precompressedStats) {
          c.header("Content-Encoding", encoding);
          c.header("Vary", "Accept-Encoding", { append: true });
          stats = precompressedStats;
          path = path + ENCODINGS[encoding];
          break;
        }
      }
    }
    let result;
    const size = stats.size;
    const range = c.req.header("range") || "";
    c.header("Last-Modified", stats.mtime.toUTCString());
    if (c.req.method === "HEAD") {
      c.header("Content-Length", size.toString());
      c.status(200);
      result = c.body(null);
    } else if (!range) {
      c.header("Content-Length", size.toString());
      result = c.body(createStreamBody(createReadStream(path)), 200);
    } else {
      c.header("Accept-Ranges", "bytes");
      const resolvedRange = resolveByteRange(parseByteRange(range) ?? {
        type: "open-ended",
        start: 0
      }, size);
      if (!resolvedRange) {
        c.header("Content-Range", `bytes */${size}`);
        result = c.body(null, 416);
      } else {
        const { start, end } = resolvedRange;
        const chunkSize = end - start + 1;
        const stream = createReadStream(path, {
          start,
          end
        });
        c.header("Content-Length", chunkSize.toString());
        c.header("Content-Range", `bytes ${start}-${end}/${size}`);
        result = c.body(createStreamBody(stream), 206);
      }
    }
    await options.onFound?.(path, c);
    return result;
  };
};

// src/config.ts
var APP_NAME = "uchet-mastermitsu";
var APP_STYLE = "strict";
var APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Novosibirsk";

// src/domain.ts
var STATUSES = ["created", "paid", "shipped"];
var DELIVERIES = ["post", "site", "cdek"];
var STATUS_LABELS = {
  created: "\u0421\u043E\u0437\u0434\u0430\u043D",
  paid: "\u041E\u043F\u043B\u0430\u0447\u0435\u043D",
  shipped: "\u041E\u0442\u0433\u0440\u0443\u0436\u0435\u043D"
};
var DELIVERY_LABELS = {
  post: "\u041F\u043E\u0447\u0442\u0430",
  site: "\u0421\u0430\u0439\u0442 MasterMitsu.ru",
  cdek: "\u0421\u0414\u042D\u041A"
};
function isStatus(value) {
  return typeof value === "string" && STATUSES.includes(value);
}
function isDelivery(value) {
  return typeof value === "string" && DELIVERIES.includes(value);
}
var isoFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: APP_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});
function todayISO(now = /* @__PURE__ */ new Date()) {
  return isoFormatter.format(now);
}
function parseISO(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
function toISO(date) {
  return date.toISOString().slice(0, 10);
}
var dayMonth = new Intl.DateTimeFormat("ru-RU", { timeZone: "UTC", day: "numeric", month: "long" });
var dayMonthYear = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric"
});
var monthYear = new Intl.DateTimeFormat("ru-RU", { timeZone: "UTC", month: "long", year: "numeric" });
function weekPeriod(today) {
  const base = parseISO(today);
  const shift = (base.getUTCDay() + 6) % 7;
  const from = new Date(base.getTime() - shift * 864e5);
  const to = new Date(from.getTime() + 6 * 864e5);
  const label = from.getUTCMonth() === to.getUTCMonth() ? `${from.getUTCDate()}\u2013${dayMonth.format(to)}` : `${dayMonth.format(from)} \u2013 ${dayMonth.format(to)}`;
  return { from: toISO(from), to: toISO(to), label };
}
function monthPeriod(today) {
  const base = parseISO(today);
  const from = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), 1));
  const to = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0));
  return { from: toISO(from), to: toISO(to), label: monthYear.format(from) };
}
function inPeriod(order2, period) {
  return order2.created_at >= period.from && order2.created_at <= period.to;
}
function formatDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return dayMonthYear.format(parseISO(iso));
}
var numberFormat = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
function formatMoney(cents) {
  return `${numberFormat.format(cents / 100)} \u20BD`;
}
function formatNumber(value, suffix = "") {
  if (value === null) return "\u2014";
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(value)}${suffix}`;
}
function parseMoney(raw2) {
  const cleaned = raw2.replace(/\s|\u00a0/g, "").replace(",", ".");
  if (!cleaned) return 0;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(Number(cleaned) * 100);
}
function parseNumberField(raw2) {
  const cleaned = raw2.replace(/\s|\u00a0/g, "").replace(",", ".");
  if (!cleaned) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return "invalid";
  return Number(cleaned);
}
function moneyInput(cents) {
  return (cents / 100).toFixed(2).replace(".", ",");
}
function analyticsFor(orders, period, key, title) {
  const rows = orders.filter((order2) => inPeriod(order2, period));
  const sum = rows.reduce((total, order2) => total + order2.amount_cents, 0);
  const earned = rows.filter((order2) => order2.status !== "created").reduce((total, order2) => total + order2.amount_cents, 0);
  const byStatus = STATUSES.map((status) => ({
    label: STATUS_LABELS[status],
    count: rows.filter((order2) => order2.status === status).length,
    sum_cents: rows.filter((order2) => order2.status === status).reduce((total, order2) => total + order2.amount_cents, 0)
  }));
  const byDelivery = DELIVERIES.map((delivery) => ({
    label: DELIVERY_LABELS[delivery],
    count: rows.filter((order2) => order2.delivery === delivery).length,
    sum_cents: rows.filter((order2) => order2.delivery === delivery).reduce((total, order2) => total + order2.amount_cents, 0)
  }));
  return {
    key,
    title,
    period,
    count: rows.length,
    sum_cents: sum,
    earned_cents: earned,
    average_cents: rows.length ? Math.round(sum / rows.length) : 0,
    byStatus,
    byDelivery
  };
}
function itemsLabel(order2) {
  const items = [order2.item_firmware ? "\u041F\u0440\u043E\u0448\u0438\u0432\u043A\u0430" : "", order2.item_ecu ? "\u0411\u043B\u043E\u043A \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F" : ""];
  return items.filter(Boolean).join(" + ") || "\u2014";
}

// src/form.ts
var text = (raw2, limit) => (typeof raw2 === "string" ? raw2 : "").trim().slice(0, limit);
var checkbox = (raw2) => raw2 === "on" || raw2 === "1" || raw2 === "true" || raw2 === "yes";
var FIELDS = [
  "created_at",
  "customer_name",
  "phone",
  "email",
  "car",
  "vin",
  "engine",
  "gearbox",
  "power_hp",
  "torque_nm",
  "consumption",
  "vmax",
  "spec_notes",
  "amount",
  "status",
  "delivery",
  "item_firmware",
  "item_ecu"
];
function readValues(body) {
  const values = {};
  for (const field2 of FIELDS) values[field2] = typeof body[field2] === "string" ? body[field2] : "";
  if (!values.created_at) values.created_at = todayISO();
  if (!values.status) values.status = "created";
  if (!values.delivery) values.delivery = "cdek";
  return values;
}
function parseOrderForm(body) {
  const values = readValues(body);
  const errors = [];
  const customerName = text(body.customer_name, 120);
  if (!customerName) errors.push("\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0438\u043C\u044F \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F.");
  const createdAt = text(body.created_at, 10) || todayISO();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(createdAt) || Number.isNaN(Date.parse(createdAt)))
    errors.push("\u0414\u0430\u0442\u0430 \u0437\u0430\u043A\u0430\u0437\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 \u0413\u0413\u0413\u0413-\u041C\u041C-\u0414\u0414.");
  const amount = parseMoney(text(body.amount, 40));
  if (amount === null) errors.push("\u0421\u0443\u043C\u043C\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u0447\u0438\u0441\u043B\u043E\u043C, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 45 000,50.");
  const numbers = {};
  for (const [field2, label] of [
    ["power_hp", "\u041C\u043E\u0449\u043D\u043E\u0441\u0442\u044C"],
    ["torque_nm", "\u041C\u043E\u043C\u0435\u043D\u0442"],
    ["consumption", "\u0420\u0430\u0441\u0445\u043E\u0434"],
    ["vmax", "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C"]
  ]) {
    const parsed = parseNumberField(text(body[field2], 20));
    if (parsed === "invalid") {
      errors.push(`${label}: \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u0447\u0438\u0441\u043B\u043E.`);
      numbers[field2] = null;
    } else numbers[field2] = parsed;
  }
  const itemFirmware = checkbox(body.item_firmware);
  const itemEcu = checkbox(body.item_ecu);
  if (!itemFirmware && !itemEcu) errors.push("\u041E\u0442\u043C\u0435\u0442\u044C\u0442\u0435 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u0443 \u043F\u043E\u0437\u0438\u0446\u0438\u044E: \xAB\u041F\u0440\u043E\u0448\u0438\u0432\u043A\u0430\xBB \u0438\u043B\u0438 \xAB\u0411\u043B\u043E\u043A \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F\xBB.");
  const status = isStatus(body.status) ? body.status : "created";
  const delivery = isDelivery(body.delivery) ? body.delivery : "cdek";
  if (errors.length || amount === null) return { draft: null, errors, values };
  return {
    errors: [],
    values,
    draft: {
      created_at: createdAt,
      customer_name: customerName,
      phone: text(body.phone, 40),
      email: text(body.email, 120),
      car: text(body.car, 120),
      vin: text(body.vin, 40),
      engine: text(body.engine, 80),
      gearbox: text(body.gearbox, 80),
      power_hp: numbers.power_hp,
      torque_nm: numbers.torque_nm,
      consumption: numbers.consumption,
      vmax: numbers.vmax,
      spec_notes: text(body.spec_notes, 2e3),
      item_firmware: itemFirmware,
      item_ecu: itemEcu,
      amount_cents: amount,
      status,
      delivery
    }
  };
}
function valuesFromOrder(order2) {
  const raw2 = {
    created_at: order2.created_at,
    customer_name: order2.customer_name,
    phone: order2.phone,
    email: order2.email,
    car: order2.car,
    vin: order2.vin,
    engine: order2.engine,
    gearbox: order2.gearbox,
    power_hp: order2.power_hp === null ? "" : String(order2.power_hp),
    torque_nm: order2.torque_nm === null ? "" : String(order2.torque_nm),
    consumption: order2.consumption === null ? "" : String(order2.consumption).replace(".", ","),
    vmax: order2.vmax === null ? "" : String(order2.vmax),
    spec_notes: order2.spec_notes,
    amount: moneyInput(order2.amount_cents),
    status: order2.status,
    delivery: order2.delivery,
    item_firmware: order2.item_firmware ? "on" : "",
    item_ecu: order2.item_ecu ? "on" : ""
  };
  const values = {};
  for (const field2 of FIELDS) values[field2] = raw2[field2] ?? "";
  return values;
}

// src/storage.ts
import { DatabaseSync as DatabaseSync2 } from "node:sqlite";
var db = new DatabaseSync2(appDataPath("orders.sqlite"));
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    car TEXT NOT NULL DEFAULT '',
    vin TEXT NOT NULL DEFAULT '',
    engine TEXT NOT NULL DEFAULT '',
    gearbox TEXT NOT NULL DEFAULT '',
    power_hp REAL,
    torque_nm REAL,
    consumption REAL,
    vmax REAL,
    spec_notes TEXT NOT NULL DEFAULT '',
    item_firmware INTEGER NOT NULL DEFAULT 0,
    item_ecu INTEGER NOT NULL DEFAULT 0,
    amount_cents INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'created',
    delivery TEXT NOT NULL DEFAULT 'cdek'
  )
`);
function toOrder(row) {
  return {
    id: row.id,
    created_at: row.created_at,
    customer_name: row.customer_name,
    phone: row.phone,
    email: row.email,
    car: row.car,
    vin: row.vin,
    engine: row.engine,
    gearbox: row.gearbox,
    power_hp: row.power_hp,
    torque_nm: row.torque_nm,
    consumption: row.consumption,
    vmax: row.vmax,
    spec_notes: row.spec_notes,
    item_firmware: row.item_firmware === 1,
    item_ecu: row.item_ecu === 1,
    amount_cents: row.amount_cents,
    status: row.status,
    delivery: row.delivery
  };
}
function listOrders() {
  const rows = db.prepare("SELECT * FROM orders ORDER BY created_at DESC, id DESC").all();
  return rows.map(toOrder);
}
function getOrder(id) {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  return row ? toOrder(row) : void 0;
}
function createOrder(draft) {
  const result = db.prepare(
    `INSERT INTO orders (created_at, customer_name, phone, email, car, vin, engine, gearbox,
         power_hp, torque_nm, consumption, vmax, spec_notes, item_firmware, item_ecu,
         amount_cents, status, delivery)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    draft.created_at,
    draft.customer_name,
    draft.phone,
    draft.email,
    draft.car,
    draft.vin,
    draft.engine,
    draft.gearbox,
    draft.power_hp,
    draft.torque_nm,
    draft.consumption,
    draft.vmax,
    draft.spec_notes,
    draft.item_firmware ? 1 : 0,
    draft.item_ecu ? 1 : 0,
    draft.amount_cents,
    draft.status,
    draft.delivery
  );
  return { id: Number(result.lastInsertRowid), ...draft };
}
function updateOrder(id, draft) {
  const result = db.prepare(
    `UPDATE orders SET created_at = ?, customer_name = ?, phone = ?, email = ?, car = ?,
         vin = ?, engine = ?, gearbox = ?, power_hp = ?, torque_nm = ?, consumption = ?,
         vmax = ?, spec_notes = ?, item_firmware = ?, item_ecu = ?, amount_cents = ?,
         status = ?, delivery = ?
       WHERE id = ?`
  ).run(
    draft.created_at,
    draft.customer_name,
    draft.phone,
    draft.email,
    draft.car,
    draft.vin,
    draft.engine,
    draft.gearbox,
    draft.power_hp,
    draft.torque_nm,
    draft.consumption,
    draft.vmax,
    draft.spec_notes,
    draft.item_firmware ? 1 : 0,
    draft.item_ecu ? 1 : 0,
    draft.amount_cents,
    draft.status,
    draft.delivery,
    id
  );
  return Number(result.changes) > 0;
}
function deleteOrder(id) {
  const result = db.prepare("DELETE FROM orders WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}
function updateOrderMeta(id, status, delivery) {
  const result = db.prepare("UPDATE orders SET status = ?, delivery = ? WHERE id = ?").run(status, delivery, id);
  return Number(result.changes) > 0;
}

// src/views.ts
var STATUS_BADGE = {
  created: "badge",
  paid: "badge badge--accent",
  shipped: "badge badge--success"
};
var head = `<link rel="icon" href="favicon.png" type="image/png" />
    <link rel="stylesheet" href="app.css" />
    <script src="screen.js" defer></script>`;
var logotype = `<img class="logotype" src="logo.png" alt="MasterMitsu" width="128" height="64" />`;
function shell(context, section, body, wide = false) {
  return appPage({
    title: appTitle(context.req.raw, APP_NAME),
    request: context.req.raw,
    style: APP_STYLE,
    head,
    wide,
    nav: [
      { href: "./?section=orders", label: "\u0417\u0430\u043A\u0430\u0437\u044B", current: section === "orders" },
      { href: "./?section=analytics", label: "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430", current: section === "analytics" }
    ],
    body
  });
}
function statusBadge(order2) {
  return `<span class="${STATUS_BADGE[order2.status]}">${STATUS_LABELS[order2.status]}</span>`;
}
function listItem(order2, selectedId) {
  const current = order2.id === selectedId ? ' aria-current="true"' : "";
  return `<a class="list-select__item order-row" href="./?section=orders&amp;id=${order2.id}"${current}>
      <span class="order-row__top"><span class="order-row__name">${escapeHTML(order2.customer_name)}</span>${statusBadge(order2)}</span>
      <span class="order-row__meta">${escapeHTML(order2.car || "\u0410\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044C \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D")}</span>
      <span class="order-row__meta"><span>${formatDate(order2.created_at)}</span><span class="num">${formatMoney(order2.amount_cents)}</span></span>
    </a>`;
}
function pair(label, value) {
  return `<tr><th>${escapeHTML(label)}</th><td>${value || '<span class="is-empty">\u2014</span>'}</td></tr>`;
}
function detailCard(order2) {
  const consumption = order2.consumption === null ? "\u2014" : `${formatNumber(order2.consumption)} \u043B/100 \u043A\u043C`;
  return `
    <section class="card card--pad stack">
      <div class="order-head">
        <div>
          <h2 class="order-head__title">${escapeHTML(order2.customer_name)}</h2>
          <p class="hint">\u0417\u0430\u043A\u0430\u0437 \u2116${order2.id} \u043E\u0442 ${formatDate(order2.created_at)}</p>
        </div>
        ${statusBadge(order2)}
      </div>

      <div class="kpis">
        <div class="kpi"><span class="kpi__label">\u0421\u0443\u043C\u043C\u0430</span><span class="kpi__value">${formatMoney(order2.amount_cents)}</span></div>
        <div class="kpi"><span class="kpi__label">\u041F\u043E\u0437\u0438\u0446\u0438\u0438</span><span class="kpi__value kpi__value--text">${escapeHTML(itemsLabel(order2))}</span></div>
        <div class="kpi"><span class="kpi__label">\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430</span><span class="kpi__value kpi__value--text">${DELIVERY_LABELS[order2.delivery]}</span></div>
      </div>

      <h3 class="section__title">\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C</h3>
      <table class="pairs"><tbody>
        ${pair("\u0422\u0435\u043B\u0435\u0444\u043E\u043D", escapeHTML(order2.phone))}
        ${pair("E-mail", escapeHTML(order2.email))}
        ${pair("\u0410\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044C", escapeHTML(order2.car))}
        ${pair("VIN", escapeHTML(order2.vin))}
      </tbody></table>

      <h3 class="section__title">\u041F\u0440\u043E\u0448\u0438\u0432\u043A\u0430</h3>
      <table class="pairs"><tbody>
        ${pair("\u0414\u0432\u0438\u0433\u0430\u0442\u0435\u043B\u044C", escapeHTML(order2.engine))}
        ${pair("\u041A\u043E\u0440\u043E\u0431\u043A\u0430 \u043F\u0435\u0440\u0435\u0434\u0430\u0447", escapeHTML(order2.gearbox))}
        ${pair("\u041C\u043E\u0449\u043D\u043E\u0441\u0442\u044C", formatNumber(order2.power_hp, " \u043B.\u0441."))}
        ${pair("\u041C\u043E\u043C\u0435\u043D\u0442", formatNumber(order2.torque_nm, " \u041D\xB7\u043C"))}
        ${pair("\u0420\u0430\u0441\u0445\u043E\u0434", consumption)}
        ${pair("\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C", formatNumber(order2.vmax, " \u043A\u043C/\u0447"))}
        ${pair("\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439", order2.spec_notes ? `<span class="notes">${escapeHTML(order2.spec_notes)}</span>` : "")}
      </tbody></table>

      <h3 class="section__title">\u0421\u0442\u0430\u0442\u0443\u0441 \u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430</h3>
      <form class="toolbar" method="post" action="orders/${order2.id}/meta">
        <label class="field field--inline">
          <span class="field__label">\u0421\u0442\u0430\u0442\u0443\u0441</span>
          <select name="status">
            ${STATUSES.map(
    (status) => `<option value="${status}"${status === order2.status ? " selected" : ""}>${STATUS_LABELS[status]}</option>`
  ).join("")}
          </select>
        </label>
        <label class="field field--inline">
          <span class="field__label">\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430</span>
          <select name="delivery">
            ${DELIVERIES.map(
    (delivery) => `<option value="${delivery}"${delivery === order2.delivery ? " selected" : ""}>${DELIVERY_LABELS[delivery]}</option>`
  ).join("")}
          </select>
        </label>
        <button class="btn-primary">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button>
      </form>

      <div class="actions">
        <a class="btn-link" href="./?section=edit&amp;id=${order2.id}">\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</a>
        <a class="btn-link" href="./?section=new">\u041D\u043E\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437</a>
        <form method="post" action="orders/${order2.id}/delete" data-confirm="\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437 \u2116${order2.id}? \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043E\u0431\u0440\u0430\u0442\u0438\u043C\u043E.">
          <button class="btn-danger">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>
        </form>
      </div>
    </section>`;
}
function ordersScreen(context, view) {
  const needle = view.filter.trim().toLowerCase();
  const rows = needle ? view.orders.filter(
    (order2) => [order2.customer_name, order2.car, order2.vin, order2.phone, order2.engine].join(" ").toLowerCase().includes(needle)
  ) : view.orders;
  const list = rows.length ? rows.map((order2) => listItem(order2, view.selected?.id ?? null)).join("") : `<p class="empty">${needle ? "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u0435 \u0437\u0430\u043F\u0440\u043E\u0441." : "\u0417\u0430\u043A\u0430\u0437\u043E\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442. \u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043F\u0435\u0440\u0432\u044B\u0439."}</p>`;
  const total = rows.reduce((sum, order2) => sum + order2.amount_cents, 0);
  const card = view.selected ? detailCard(view.selected) : `<section class="card card--pad stack">
        <div class="order-head">${logotype}</div>
        <p class="empty">${view.orders.length ? "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0437\u0430\u043A\u0430\u0437 \u0432 \u0441\u043F\u0438\u0441\u043A\u0435 \u0441\u043B\u0435\u0432\u0430." : "\u041F\u0435\u0440\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437 \u0441\u043E\u0437\u0434\u0430\u0451\u0442\u0441\u044F \u043A\u043D\u043E\u043F\u043A\u043E\u0439 \xAB\u041D\u043E\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437\xBB."}</p>
        <p class="actions"><a class="btn-link btn-link--primary" href="./?section=new">\u041D\u043E\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437</a></p>
      </section>`;
  return shell(
    context,
    "orders",
    `${view.notice ? `<p class="status status--ok" role="status">${escapeHTML(view.notice)}</p>` : ""}${view.error ? `<p class="status status--error" role="status">${escapeHTML(view.error)}</p>` : ""}
    <div class="split">
      <div class="stack">
        <form class="card card--pad stack" method="get">
          <input type="hidden" name="section" value="orders" />
          <label class="field">
            <span class="field__label">\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0430\u043C</span>
            <input name="filter" value="${escapeHTML(view.filter)}" placeholder="\u0418\u043C\u044F, \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044C, VIN" />
          </label>
          <div class="actions">
            <button>\u041D\u0430\u0439\u0442\u0438</button>
            <a class="btn-link" href="./?section=orders">\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C</a>
          </div>
        </form>
        <p class="list-total">\u0417\u0430\u043A\u0430\u0437\u043E\u0432: <strong>${rows.length}</strong> \xB7 \u043D\u0430 \u0441\u0443\u043C\u043C\u0443 <strong>${formatMoney(total)}</strong></p>
        <nav class="list-select" aria-label="\u0417\u0430\u043A\u0430\u0437\u044B">${list}</nav>
        <p class="actions"><a class="btn-link btn-link--primary" href="./?section=new">\u041D\u043E\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437</a></p>
      </div>
      ${card}
    </div>`
  );
}
function field(label, name, values, options = {}) {
  const value = values[name] ?? "";
  return `<label class="field${options.wide ? " field--wide" : ""}">
      <span class="field__label">${escapeHTML(label)}</span>
      <input name="${name}" type="${options.type ?? "text"}" value="${escapeHTML(value)}"${options.placeholder ? ` placeholder="${escapeHTML(options.placeholder)}"` : ""}${options.inputmode ? ` inputmode="${options.inputmode}"` : ""}${options.min ? ` min="${options.min}"` : ""}${options.step ? ` step="${options.step}"` : ""} />
    </label>`;
}
function select(label, name, values, options) {
  const value = values[name] ?? "";
  return `<label class="field">
      <span class="field__label">${escapeHTML(label)}</span>
      <select name="${name}">${options.map(
    (option) => `<option value="${option.value}"${option.value === value ? " selected" : ""}>${escapeHTML(option.label)}</option>`
  ).join("")}</select>
    </label>`;
}
function check(label, name, values) {
  const checked = values[name] ? " checked" : "";
  return `<label class="check"><input type="checkbox" name="${name}"${checked} /> <span>${escapeHTML(label)}</span></label>`;
}
function formScreen(context, view) {
  const action = view.mode === "edit" ? `orders/${view.orderId}` : "orders";
  const title = view.mode === "edit" ? `\u0417\u0430\u043A\u0430\u0437 \u2116${view.orderId}` : "\u041D\u043E\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437";
  const statusOptions = STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }));
  const deliveryOptions = DELIVERIES.map((delivery) => ({
    value: delivery,
    label: DELIVERY_LABELS[delivery]
  }));
  const back = `./?section=orders${view.orderId ? `&amp;id=${view.orderId}` : ""}`;
  return shell(
    context,
    "orders",
    `<section class="card card--pad stack">
      <div class="order-head">
        <h2 class="order-head__title">${escapeHTML(title)}</h2>
        <a class="btn-link" href="${back}">\u041A \u0441\u043F\u0438\u0441\u043A\u0443</a>
      </div>
      ${view.errors.length ? `<p class="status status--error" role="alert">${escapeHTML(view.errors.join(" "))}</p>` : ""}
      <form class="stack" method="post" action="${action}">
        <h3 class="section__title">\u0417\u0430\u043A\u0430\u0437</h3>
        <div class="fields-grid">
          ${field("\u0414\u0430\u0442\u0430 \u0437\u0430\u043A\u0430\u0437\u0430", "created_at", view.values, { type: "date" })}
          ${field("\u0421\u0443\u043C\u043C\u0430, \u20BD", "amount", view.values, { placeholder: "45 000,50", inputmode: "decimal" })}
          ${select("\u0421\u0442\u0430\u0442\u0443\u0441", "status", view.values, statusOptions)}
          ${select("\u041C\u0435\u0442\u043E\u0434 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438", "delivery", view.values, deliveryOptions)}
        </div>
        <h3 class="section__title">\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C</h3>
        <div class="fields-grid">
          ${field("\u0418\u043C\u044F \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F", "customer_name", view.values, { placeholder: "\u0418\u0432\u0430\u043D \u041F\u0435\u0442\u0440\u043E\u0432" })}
          ${field("\u0422\u0435\u043B\u0435\u0444\u043E\u043D", "phone", view.values, { placeholder: "+7 913 000-00-00" })}
          ${field("E-mail", "email", view.values, { type: "email", placeholder: "client@example.ru", wide: true })}
          ${field("\u0410\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044C", "car", view.values, { placeholder: "BMW X5 G05 3.0d", wide: true })}
          ${field("VIN", "vin", view.values, { placeholder: "17 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432", wide: true })}
        </div>
        <h3 class="section__title">\u041F\u0440\u043E\u0448\u0438\u0432\u043A\u0430</h3>
        <div class="fields-grid">
          ${field("\u0414\u0432\u0438\u0433\u0430\u0442\u0435\u043B\u044C", "engine", view.values, { placeholder: "3.0d B57" })}
          ${field("\u041A\u043E\u0440\u043E\u0431\u043A\u0430 \u043F\u0435\u0440\u0435\u0434\u0430\u0447", "gearbox", view.values, { placeholder: "ZF 8HP" })}
          ${field("\u041C\u043E\u0449\u043D\u043E\u0441\u0442\u044C, \u043B.\u0441.", "power_hp", view.values, { inputmode: "decimal" })}
          ${field("\u041C\u043E\u043C\u0435\u043D\u0442, \u041D\xB7\u043C", "torque_nm", view.values, { inputmode: "decimal" })}
          ${field("\u0420\u0430\u0441\u0445\u043E\u0434, \u043B/100 \u043A\u043C", "consumption", view.values, { inputmode: "decimal" })}
          ${field("\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C, \u043A\u043C/\u0447", "vmax", view.values, { inputmode: "decimal" })}
        </div>
        <label class="field">
          <span class="field__label">\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043A \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0430\u043C</span>
          <textarea name="spec_notes" rows="3" placeholder="Stage 1, \u0437\u0430\u043C\u0435\u0440\u044B \u0434\u043E \u0438 \u043F\u043E\u0441\u043B\u0435, \u043E\u0441\u043E\u0431\u0435\u043D\u043D\u043E\u0441\u0442\u0438">${escapeHTML(view.values.spec_notes ?? "")}</textarea>
        </label>
        <h3 class="section__title">\u041F\u043E\u0437\u0438\u0446\u0438\u0438 \u0437\u0430\u043A\u0430\u0437\u0430</h3>
        <div class="checks">
          ${check("\u041F\u0440\u043E\u0448\u0438\u0432\u043A\u0430", "item_firmware", view.values)}
          ${check("\u0411\u043B\u043E\u043A \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F", "item_ecu", view.values)}
        </div>
        <div class="actions">
          <button class="btn-primary">${view.mode === "edit" ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F" : "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0437\u0430\u043A\u0430\u0437"}</button>
          <a class="btn-link" href="${back}">\u041E\u0442\u043C\u0435\u043D\u0430</a>
        </div>
      </form>
    </section>`
  );
}
function breakdown(title, rows) {
  return `<div class="card card--pad stack">
      <h3 class="section__title">${escapeHTML(title)}</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435</th><th class="num">\u0417\u0430\u043A\u0430\u0437\u043E\u0432</th><th class="num">\u0421\u0443\u043C\u043C\u0430</th></tr></thead>
        <tbody>${rows.map(
    (row) => `<tr><td>${escapeHTML(row.label)}</td><td class="num">${row.count}</td><td class="num">${formatMoney(row.sum_cents)}</td></tr>`
  ).join("")}</tbody>
      </table></div>
    </div>`;
}
function periodBlock(period) {
  const range = period.period.from === period.period.to ? formatDate(period.period.from) : `${formatDate(period.period.from)} \u2014 ${formatDate(period.period.to)}`;
  return `<section class="stack">
      <div class="toolbar">
        <h2 class="order-head__title">${escapeHTML(period.title)}</h2>
        <span class="hint">${range}</span>
        <a class="btn-link" href="export.csv?period=${period.key}">\u0412\u044B\u0433\u0440\u0443\u0437\u0438\u0442\u044C CSV</a>
      </div>
      <div class="kpis">
        <div class="kpi"><span class="kpi__label">\u0421\u0443\u043C\u043C\u0430</span><span class="kpi__value">${formatMoney(period.sum_cents)}</span></div>
        <div class="kpi"><span class="kpi__label">\u0417\u0430\u043A\u0430\u0437\u043E\u0432</span><span class="kpi__value">${period.count}</span></div>
        <div class="kpi"><span class="kpi__label">\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u0447\u0435\u043A</span><span class="kpi__value">${formatMoney(period.average_cents)}</span></div>
        <div class="kpi"><span class="kpi__label">\u041E\u043F\u043B\u0430\u0447\u0435\u043D\u043E \u0438 \u043E\u0442\u0433\u0440\u0443\u0436\u0435\u043D\u043E</span><span class="kpi__value">${formatMoney(period.earned_cents)}</span></div>
      </div>
      <div class="breakdowns">
        ${breakdown("\u041F\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0430\u043C", period.byStatus)}
        ${breakdown("\u041F\u043E \u043C\u0435\u0442\u043E\u0434\u0430\u043C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438", period.byDelivery)}
      </div>
    </section>`;
}
function analyticsScreen(context, week, month, recent) {
  const latest = recent.length ? `<div class="card card--pad stack">
        <h3 class="section__title">\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u044B \u043C\u0435\u0441\u044F\u0446\u0430</h3>
        <div class="table-wrap"><table>
          <thead><tr><th>\u0414\u0430\u0442\u0430</th><th>\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C</th><th>\u041F\u043E\u0437\u0438\u0446\u0438\u0438</th><th>\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430</th><th>\u0421\u0442\u0430\u0442\u0443\u0441</th><th class="num">\u0421\u0443\u043C\u043C\u0430</th></tr></thead>
          <tbody>${recent.map(
    (order2) => `<tr><td>${formatDate(order2.created_at)}</td><td><a href="./?section=orders&amp;id=${order2.id}">${escapeHTML(order2.customer_name)}</a></td><td>${escapeHTML(itemsLabel(order2))}</td><td>${DELIVERY_LABELS[order2.delivery]}</td><td>${statusBadge(order2)}</td><td class="num">${formatMoney(order2.amount_cents)}</td></tr>`
  ).join("")}</tbody>
        </table></div>
      </div>` : "";
  return shell(
    context,
    "analytics",
    `<div class="stack">
      ${periodBlock(week)}
      ${periodBlock(month)}
      ${latest}
    </div>`,
    true
  );
}

// src/routes.ts
function prefix() {
  const base = appBasePath();
  return base === "/" ? "" : base;
}
var CSV_COLUMNS = [
  ["\u041D\u043E\u043C\u0435\u0440", (order2) => String(order2.id)],
  ["\u0414\u0430\u0442\u0430", (order2) => formatDate(order2.created_at)],
  ["\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C", (order2) => order2.customer_name],
  ["\u0422\u0435\u043B\u0435\u0444\u043E\u043D", (order2) => order2.phone],
  ["E-mail", (order2) => order2.email],
  ["\u0410\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044C", (order2) => order2.car],
  ["VIN", (order2) => order2.vin],
  ["\u0414\u0432\u0438\u0433\u0430\u0442\u0435\u043B\u044C", (order2) => order2.engine],
  ["\u041A\u043E\u0440\u043E\u0431\u043A\u0430 \u043F\u0435\u0440\u0435\u0434\u0430\u0447", (order2) => order2.gearbox],
  ["\u041C\u043E\u0449\u043D\u043E\u0441\u0442\u044C, \u043B.\u0441.", (order2) => order2.power_hp === null ? "" : String(order2.power_hp)],
  ["\u041C\u043E\u043C\u0435\u043D\u0442, \u041D\xB7\u043C", (order2) => order2.torque_nm === null ? "" : String(order2.torque_nm)],
  ["\u0420\u0430\u0441\u0445\u043E\u0434, \u043B/100 \u043A\u043C", (order2) => order2.consumption === null ? "" : String(order2.consumption)],
  ["\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C, \u043A\u043C/\u0447", (order2) => order2.vmax === null ? "" : String(order2.vmax)],
  ["\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439", (order2) => order2.spec_notes],
  ["\u041F\u0440\u043E\u0448\u0438\u0432\u043A\u0430", (order2) => order2.item_firmware ? "\u0434\u0430" : "\u043D\u0435\u0442"],
  ["\u0411\u043B\u043E\u043A \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F", (order2) => order2.item_ecu ? "\u0434\u0430" : "\u043D\u0435\u0442"],
  ["\u0421\u0443\u043C\u043C\u0430", (order2) => (order2.amount_cents / 100).toFixed(2).replace(".", ",")],
  ["\u0421\u0442\u0430\u0442\u0443\u0441", (order2) => STATUS_LABELS[order2.status]],
  ["\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430", (order2) => DELIVERY_LABELS[order2.delivery]]
];
function csvCell(value) {
  return `"${value.replace(/\r?\n/g, " ").replace(/"/g, '""')}"`;
}
function createRoutes() {
  const ui = new Hono3();
  ui.get(`/${APP_STYLESHEET_PATH}`, (context) => appStylesheetResponse(context.req.raw));
  ui.get("/app.css", serveStatic({ root: "./static", path: "app.css" }));
  ui.get("/screen.js", serveStatic({ root: "./static", path: "screen.js" }));
  ui.get("/logo.png", serveStatic({ root: "./static", path: "logo.png" }));
  ui.get("/favicon.png", serveStatic({ root: "./static", path: "favicon.png" }));
  ui.get("/", (context) => {
    const section = context.req.query("section") ?? "orders";
    const orders = listOrders();
    if (section === "analytics") {
      const today = todayISO();
      const month = monthPeriod(today);
      const week = weekPeriod(today);
      const recent = orders.filter((order2) => order2.created_at >= month.from).slice(0, 10);
      return context.html(
        analyticsScreen(
          context,
          analyticsFor(orders, week, "week", "\u0417\u0430 \u043D\u0435\u0434\u0435\u043B\u044E"),
          analyticsFor(orders, month, "month", "\u0417\u0430 \u043C\u0435\u0441\u044F\u0446"),
          recent
        )
      );
    }
    if (section === "new") {
      return context.html(formScreen(context, { mode: "new", values: readValues({}), errors: [] }));
    }
    if (section === "edit") {
      const order2 = getOrder(Number(context.req.query("id")));
      if (!order2) return context.redirect(`${prefix()}/?section=orders&error=${encodeURIComponent("\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D")}`, 303);
      return context.html(
        formScreen(context, {
          mode: "edit",
          values: valuesFromOrder(order2),
          errors: [],
          orderId: order2.id
        })
      );
    }
    const selectedId = Number(context.req.query("id"));
    const selected = Number.isFinite(selectedId) ? getOrder(selectedId) : void 0;
    return context.html(
      ordersScreen(context, {
        orders,
        selected,
        filter: context.req.query("filter") ?? "",
        notice: context.req.query("notice") ?? "",
        error: context.req.query("error") ?? ""
      })
    );
  });
  ui.post("/orders", async (context) => {
    const parsed = parseOrderForm(await context.req.parseBody());
    if (!parsed.draft) {
      return context.html(
        formScreen(context, { mode: "new", values: parsed.values, errors: parsed.errors }),
        422
      );
    }
    const order2 = createOrder(parsed.draft);
    return context.redirect(
      `${prefix()}/?section=orders&id=${order2.id}&notice=${encodeURIComponent("\u0417\u0430\u043A\u0430\u0437 \u0441\u043E\u0437\u0434\u0430\u043D")}`,
      303
    );
  });
  ui.post("/orders/:id/meta", async (context) => {
    const id = Number(context.req.param("id"));
    const order2 = getOrder(id);
    if (!order2)
      return context.redirect(
        `${prefix()}/?section=orders&error=${encodeURIComponent("\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D")}`,
        303
      );
    const body = await context.req.parseBody();
    const status = isStatus(body.status) ? body.status : order2.status;
    const delivery = isDelivery(body.delivery) ? body.delivery : order2.delivery;
    updateOrderMeta(id, status, delivery);
    return context.redirect(
      `${prefix()}/?section=orders&id=${id}&notice=${encodeURIComponent("\u0421\u0442\u0430\u0442\u0443\u0441 \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D")}`,
      303
    );
  });
  ui.post("/orders/:id/delete", (context) => {
    const id = Number(context.req.param("id"));
    deleteOrder(id);
    return context.redirect(`${prefix()}/?section=orders&notice=${encodeURIComponent("\u0417\u0430\u043A\u0430\u0437 \u0443\u0434\u0430\u043B\u0451\u043D")}`, 303);
  });
  ui.post("/orders/:id", async (context) => {
    const id = Number(context.req.param("id"));
    if (!getOrder(id))
      return context.redirect(
        `${prefix()}/?section=orders&error=${encodeURIComponent("\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D")}`,
        303
      );
    const parsed = parseOrderForm(await context.req.parseBody());
    if (!parsed.draft) {
      return context.html(
        formScreen(context, {
          mode: "edit",
          values: parsed.values,
          errors: parsed.errors,
          orderId: id
        }),
        422
      );
    }
    updateOrder(id, parsed.draft);
    return context.redirect(
      `${prefix()}/?section=orders&id=${id}&notice=${encodeURIComponent("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B")}`,
      303
    );
  });
  ui.get("/export.csv", (context) => {
    const today = todayISO();
    const period = (context.req.query("period") ?? "month") === "week" ? weekPeriod(today) : monthPeriod(today);
    const rows = listOrders().filter(
      (order2) => order2.created_at >= period.from && order2.created_at <= period.to
    );
    const lines = [
      CSV_COLUMNS.map(([title]) => csvCell(title)).join(";"),
      ...rows.map((order2) => CSV_COLUMNS.map(([, value]) => csvCell(value(order2))).join(";"))
    ];
    const name = `mastermitsu-${period.from}_${period.to}.csv`;
    return new Response(`\uFEFF${lines.join("\r\n")}\r
`, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${name}"`,
        "cache-control": "no-store"
      }
    });
  });
  ui.notFound(
    (context) => context.html(
      `<!doctype html><html lang="ru"><body><main><h1>\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430</h1><p><a href="${escapeHTML(prefix())}/">\u041A \u0437\u0430\u043A\u0430\u0437\u0430\u043C</a></p></main></body></html>`,
      404
    )
  );
  return ui;
}

// src/server.ts
var app = new Hono3({ strict: false });
app.use("*", async (context, next) => {
  await next();
  context.header("Content-Security-Policy", APP_CSP);
  context.header("X-Content-Type-Options", "nosniff");
});
app.get("/healthz", (context) => context.json({ ok: true }));
app.route(appBasePath(), createRoutes());
var port = Number(process.env.PORT ?? 8080);
serve({ fetch: app.fetch, port });
