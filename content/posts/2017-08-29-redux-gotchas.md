---
layout: post
title:  Redux Gotchas
date:   2017-08-19
---

写 React app 的时候，基本上 Redux 或 Mobx 这样的状态管理工具是必须要用的。

## 使用 FSA

FSA 的全称是[Flux Standard Action](https://github.com/acdlite/flux-standard-action)，它是 Flux (包含 Redux)架构状态管理中 action 写法的一个建议。action 应该是什么样子，你可以完全可以自己决定。但既然有这样一个建议，关键它简单并且也挺有道理，所以我觉得可以遵守一下，看起来统一，和别人协作也会方便一点。

一般，不带任何信息的 action 大家都是写成这样

```js
{
  type: 'GET_USER_START'
}
```

这没有问题。但如果是 dispatch 带有数据的 action 的时候，大家的写法可能就很多样了。

这样

```js
{
  type: 'GET_USER_COMPLETED',
  user: {
    username: 'alice',
    city: 'Shanghai'
  }
}
```

这样

```js
{
  type: 'GET_USER_COMPLETED',
  data: {
    username: 'alice',
    city: 'Shanghai'
  }
}
```

或这样

```js
{
  type: 'GET_USER_COMPLETED',
  username: 'alice',
  city: 'Shanghai'
}
```

而 FSA 的数据都是放在`payload`这个 prop 中。像这样：

```js
{
  type: 'GET_USER_COMPLETED',
  payload: {
    username: 'alice',
    city: 'Shanghai'
  }
}
```

一个 Flux Standard Action

**必须**是

- 纯 JavaScript object
- 有个`type`属性，其值是个字符串常量或是一个 Symbol

还**可能**

- 有个`error`属性
- 有个`payload`属性
- 有个`meta`属性

当 dispatch 一个表示错误的 action 的时候。`error`应该设成 true，`payload`直接设成该 error object，比如

```
{
  type: 'ADD_TODO',
  payload: new Error(),
  error: true
}
```

`meta`这个 prop 会用的比较少，其值可以是任意类型。这个 prop 主要用来放置不属于 payload 的信息。

更多的可以看看  [acdlite/flux-standard-action](https://github.com/acdlite/flux-standard-action)


## Use Redux the right way

要合理地在 React app 中使用 Redux，建议去读一读 [reactjs/react-redux](https://github.com/reactjs/react-redux)的源码

假设有这样一段代码：

```js
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as userActions from '../ducks/user';

function mapStateToProps(state) {
  const { user, ui, modals, posts } = state;
  return { user, ui, modals, posts };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Hello extends Component {

  handleLogout = () => {
    this.props.userActions.logout();
  }

  render() {
    const { user, title } = this.props;
    return (
      <div>
        <h1>{title}</h1>
        <p>{`Hello ${user.username}`}</p>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}
```

当你在别的组件中使用的时候，大概是这样的：

```html
<Hello title="Welcome" />
```

你需要知道的是，此处你用到的这个`Hello`组件是经过了 connect 封装一层之后返回的一个 HOC(High Order Component，高阶组件)。大概是这样的：

```js
const NewHello = connect(mapStateToProps, mapDispatchToProps)(Hello);
```

而这个 `NewHello`在 constructor 中会完成向 store 订阅更新，而重要的是其中也会做一个 props select 系统的初始化。对照前面的代码，这个 props select 系统初始化完成后，你可能认为这个`NewHello`上会有以下 props:

- title 
- user
- ui
- modals
- posts
- userActions

一旦 store 发生变化，这个 props select 系统就会运行一次来判断是否需要进行更新，而其判断的过程很简单，大概这样：

```js
const mergedProps = { title, user, ui, modals, posts, userActions };

const shouldUpdate = shallowEqual(mergedProps, nextProps);
```

如果上面的`shouldUpdate`是 true，这个`NewHello`就会 rerender。当然 react-redux 中做了更多的优化，步骤远没有这么简单，比如

- 它会对前一次的 mergedProps 做 memoization
- props 的比较也是按步骤的，先比较自有 props(这里的`title`就是自有 props)，如果当前自有 props 和前一次的自有 props 的不 shallowEqual 的话，就会直接触发 rerender，而跳过对 redux store 映射过来的 props 的比较

而 redux action 在 app 运行时不会有变化，所以`mapDispatchToProps`这个函数怎么写不太无所谓。但`mapStateToProps`怎么写就很重要了，比如我们的例子中，明显我们只用到了 redux store 中`user`部分，那我们就应该只把`user`部分映射到 props 中，其它的`ui`,`modals`和`posts`则不应该进行映射，只会触发更多不必要的 rerender。

有时你的 component 会触发一些 action，但这个 component 本身并不需要做 reaction，这个时候在 connect 中可以直接把`mapStateToProps`写成`null`。

## With `immutable.js`

在 React app 中  [facebook/immutable-js](https://github.com/facebook/immutable-js/) 也很常用。一般用 immutable.js 都是为了更好的性能。但我见到很多人在 `mapStateToProps` 中直接在 immutable.js 数据上调用 `toJS` 或 `toJSON`来转换成 JS 数据类型。但这两个函数都产生的是一个新的 object，所以就会导致频繁且不必要的 rerender。同时也容易出现 bug，UI 发生意想不到的变化。

所以 immutable.js 数据最好还是一传到底，直到是 JS 数据类型的 leaf 节点。当然 Redux 的 recipes 中建议 [Never use Immutable.JS in your Dumb Components](http://redux.js.org/docs/recipes/UsingImmutableJS.html#never-use-immutablejs-in-your-dumb-components)，所以要适时转换成 JS 数据。

## Ducks pattern

因为用 Redux 真的要写好多 boilerplate code，其实很烦。所以我最近一直使用一个叫 [Ducks pattern](https://github.com/erikras/ducks-modular-redux)的方式组织代码，还挺 happy 的。
