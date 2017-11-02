# demo-blog-site
<br/>
Site of this item ————  http://primerscern.xyz/demo-blog-site
<br/>

## The problem solved
- IE下，页面滚动时，背景图片跟着晃
- 浏览器间 scrollTop 兼容问题
<br/>

### IE下，页面滚动时，背景图片跟着晃

##### 浏览器情况
出现在Edge以及IE9+上（当时网页只兼容到ie9，所以9-的没看）
我平时用的Chrome上没问题，QQ浏览器下的IE兼容模式也没问题。

##### 详情描述
背景图片是设置在body下的一个大容器里的（几乎占据整个body）。
然后这个背景图片**设置了fixed属性**（验证了是主要原因），取消就没事。
当网页滚动的时候，图片并没有fixed不动，而是**一截一截的变换位置**。
导致看起来的视觉效果就图片一直在**上下抖动**。

##### 肤浅地分析原因
根据这个效果的视觉特点观察得到，
图片并没有fixed不动，而是随着网页向上滚，
然后短时间内，又重新渲染定位到fixed的位置，导致了这种视觉效果。
即——**滚动的执行频率和浏览器的渲染频率不搭配**。

### ‘/' 敲黑板
    经过在网上搜索，得到以下解决的方法，并针对实际情况进行了少许改动。

```
- if (!!window.ActiveXObject ||
-       "ActiveXObject" in window ||
-       navigator.userAgent.indexOf("Edge") > -1) {
-       document.body.addEventListener && 
+       document.body.addEventListener("mousewheel", function() {
-             if (document.all) {
-                  window.event.returnValue = false;
-             }else {
-                   event.preventDefault();
+              }
-             var wheelD = event.wheelDelta;
-             var pageY = window.pageYOffset;
-             window.scrollTo(0, pageY - wheelD);
-       });
+ }

第一行 // 通过检查发送ActiveX和user-agent值，来匹配IE浏览器和Edge浏览器。

第四行 // 筛选IE9（addEventListener），添加一个对滚轮的监听，添加函数动作。

第六行 // 判定筛选，ie10及以下不支持preventDefault()，ie11和Edge没有document.all

第九行 // 阻止event（即mousewheel）的默认行为（滚动页面）。

第十一行 // 去除滚轮的默认动作并重新绑定动作。
```
##### 其实刨去皮肉，得到的骨架就是
```
- if (判定针对的浏览器—true/false) {
-       document.body.addEventListener("mousewheel", function(){
-             event.preventDefault();
-             var wheelD = event.wheelDelta;
+             var pageY = window.pageYOffset;
-             window.scrollTo(0, pageY - wheelD);
-       });
```
***
**碎碎念**
> 其实个中原理，还没有完全搞懂。/(ㄒoㄒ)/~~
我猜测是ie下mousewheel的默认动作机制，与背景的fixed**机制冲突**有关。
所以当去除了默认机制，而改为纯页面上移，则没有问题。
##### 待我深入了解后，回来补充。
<br/>

### 浏览器间 scrollTop 兼容问题

- #### 背景
  就是我那个自制博客的项目，在封面有个按钮，
  按下按钮就直接向下滚到内容的页面。

- #### 情况
  该按钮是用 click 后，使用 animate 设置scrollTop的距离，
  来实现自动滚到目标位置的。最开始使用了这行代码：
  `$("html").animate({"scrollTop": 100}, 1000)`

- #### 出现问题
  其实一开始没发现有问题，但是后来我到 **Edge浏览器**上运行了一下，
  发现，该按钮按下之后，**丝毫没有反映**，后台也没有报错，
  然后我把代码中的 `html` 换成了 `body` 后，Edge 实现了功能，
  但回到 Chrome 中，又出现了**同样的问题**，没反应。

- #### 解决办法
  其实期间还经过各种折腾，但不得其解。
  最后我只能把代码写成这样：
  `$("html, body").animate({"scrollTop": 100}, 1000)`
  点击时，**同时把 html 和 body 都选择上**，最终解决问题。

****
- ##### 小探究
  一开始以为是 animate 的问题，但是试验后排除了。

  然后我就用了各个浏览器试了一遍（都是用的最新版17年10月）
  得出以下结果：
  **fireFox、Chrome、IE9+均支持** `$("html").animate({"scrollTop": 100}, 1000)`
  **而只有 Edge 需要改成 body 。** 
  在网上我还看到有人写的文章中指出，
  fireFox 和 Chrome 支持的有冲突，在我这并没有这种情况。

>好吧就说到这，一个小问题。
但是我还是很好奇这是为什么，
大概是Edge浏览器的规则有点差异？
