# `dpr-image`

> TODO: description

## Usage

```
const dprImage = require('dpr-image');

// TODO: DEMONSTRATE API
```
## 对于高清图片移动端如何处理（根据dpr下载不同分辨率的图片）

retina下，图片高清问题
这个问题上面已经介绍过解决方案了：两倍图片(@2x)，然后图片容器缩小50%。

如：图片大小，400×600;

1.img标签

width: 200px;
height: 300px;
2.背景图片

width: 200px;
height: 300px;
background-image: url(image@2x.jpg);
background-size: 200px 300px; // 或者: background-size: contain;
这样的缺点，很明显，普通屏幕下：

同样下载了@2x的图片，造成资源浪费。
图片由于downsampling，会失去了一些锐利度(或是色差)。
所以最好的解决办法是：不同的dpr下，加载不同的尺寸的图片。

不管是通过css媒体查询，还是通过javascript条件判断都是可以的。

那么问题来了，这样的话，不就是要准备两套图片了嘛？(@1x 和@2x)

我想，做的好的公司，都会有这么一个图片服务器，通过url获取参数，然后可以控制图片质量，也可以将图片裁剪成不同的尺寸。

所以我们只需上传大图(@2x)，其余小图都交给图片服务器处理，我们只要负责拼接url即可。

如，这样一张原图：

https://img.alicdn.com/tps/TB1AGMmIpXXXXafXpXXXXXXXXXX.jpg // 原图
可以类似这样，进行图片裁剪：

// 200×200
https://img.alicdn.com/tps/TB1AGMmIpXXXXafXpXXXXXXXXXX.jpg_200x200.jpg

// 100×100
https://img.alicdn.com/tps/TB1AGMmIpXXXXafXpXXXXXXXXXX.jpg_100x100.jpg
(ps: 当然裁剪只是对原图的等比裁剪，得保证图片的清晰嘛~)

## 其他方案

除了通过媒体查询外，也可以通过`<picture>`标签来实现：https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/picture