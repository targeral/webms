# screen-adapter

## feature

### ScreenAdapter

ScreenAdapter用于设置root元素的fontSize，并监听`DOMContentLoaded` 和 `resize` 事件触发 `adapter` 方法。

### loader

适配除了设置root元素的fontSize，还需要将编写的css代码中的px替换为对应的rem值。所以需要通过webpack loader的方式进行转换。

### postcss-plugin

todo

## why

[why](./why.md)