# Hyacinth

> A mobile-friendly reader powered by Vue 2.

---

![](http://wx1.sinaimg.cn/mw690/690c6f7cgy1fci57vzkmkg20dc07iu0y.gif)

## TODO

- [x] 分页器 (参照豆瓣阅读实现)
- [x] 响应式
- [x] 阅读模式 (豆瓣)
- [x] 动态加载
    - [x] 水平：豆瓣
    - [x] 垂直：微博/Twitter
- [x] 源文件格式
    - [x] Plain Text
    - [x] Html
    - [x] Markdown
- [ ] 章节目录
- [ ] 全文检索
- [ ] 字体样式
- [ ] HTML5 History Mode
- [ ] Progressive Web Apps
- [ ] 漢字標準格式

## Demo

* [Brave-New-World.txt](https://gitaiqaq.github.io/HyaReader/?url=https://raw.githubusercontent.com/GitaiQAQ/HyaReader/master/static/Brave-New-World.txt)
* [楚辞.txt](https://gitaiqaq.github.io/HyaReader/?url=https://raw.githubusercontent.com/GitaiQAQ/HyaReader/master/static/楚辞.txt)
* [枕草子.txt](https://gitaiqaq.github.io/HyaReader/?url=https://raw.githubusercontent.com/GitaiQAQ/HyaReader/master/static/枕草子.txt)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Core code

> 整体代码非常垃圾，远不如参照，官方的 [Shopping Cart](https://github.com/vuejs/vuex/tree/86095364c3ae8d7b76c5f11ac87014c87210616c/examples/shopping-cart) 之类的例子，遂继续重构。
> 在此把可能有用的代码记录下来

目标：

* 减少
    * DOM 操作
    * 外部库引入
    * 代码量
* 封装
    * 低耦合
    * 可复用

### 实现流程

1. 单页阅读器
    1. 解析 Markdown
    2. 实现分页
2. 水平切页
    1. 动态插入
    2. 替换 Vue transition 方法，减少自定义 Dom 操作
3. 垂直模式
    1. 去除 Header/Footer 连接 Body 部分
    2. 动态插入

#### 初始化布局参数

* FontSize(px): 16
* LineHeight(em): 1.5
* Full(em):
    * Height: `document.documentElement.clientHeight`
    * Width: `document.documentElement.clientWidth`
* Layout(em):
    * Height: `$Height / $FontSize`
    * Width: `$Width / $FontSize`

#### 计算区块
##### 插入 Dom

浏览器自行适配，拆分段落，或者采用 JS 实现解析器（如：Flipboard/react-canvas）

```js
this.page.map(v => v.html).join('\n');
```

### 枚举节点＆拆分页面

* Page:
    * Title
    * Paragraphs
        * Offset
        * Html

```js
const lineHeight = this.fontSize * this.lineHeight;
const contentHeight = this.contentHeight / this.lineHeight;
let pagination = 0;
let pageHeight = 0;
const $this = this;

function isPlaceholder(oElTreeel) {
    if (typeof oElTreeel === 'string') return 0;
    // let numOfImg = 0;
    const elTree = JSON.parse(JSON.stringify(oElTreeel));
    const tag = elTree.shift();
    if (tag === 'img') return 2;// numOfImg += 1;
    else if (tag === 'h1') {
        $this.toc.push({
        pagination,
        title: elTree.shift(),
        });
        return 1;
    }
    if (elTree.length && typeof elTree[0] === 'object' && !(elTree[0] instanceof Array)) elTree.shift();
    while (elTree.length) {
        // numOfImg += isPlaceholder(elTree.shift());
        const rt = isPlaceholder(elTree.shift());
        if (rt) return rt;
    }
    // return numOfImg;
    return false;
}

function nextPage(height) {
    pageHeight = height;
    pagination += 1;
    if (!$this.pages[pagination]) $this.pages[pagination] = [];
}

[].forEach.call($this.$el.children, (v, i) => {
    const paragraph = {
        height: Math.ceil(v.offsetHeight / lineHeight),
        offset: (lineHeight - (v.offsetHeight % lineHeight)) % lineHeight,
        html: $this.book.tree[i].html,
        tree: $this.book.tree[i].el,
    };
    // Pagination
    switch (isPlaceholder(paragraph.tree)) {
        case 1: {
        nextPage(paragraph.height);
        $this.toc.push({
            title: paragraph.tree[1],
            pagination,
        });
        $this.pages[pagination].push(paragraph);
        return;
        }
        case 2: {
        nextPage(0);
        $this.pages[pagination].push(paragraph);
        nextPage(0);
        return;
        }
        default:
        break;
    }
    pageHeight += paragraph.height;
    $this.pages[pagination].push(paragraph);
    while (pageHeight >= contentHeight) {
        nextPage(pageHeight - contentHeight);
        const oParagraph = JSON.parse(JSON.stringify(paragraph));
        oParagraph.offset = -(paragraph.height - pageHeight);
        $this.pages[pagination].push(oParagraph);
    }
});
this.$store.dispatch('UPDATE_BOOK_TOC', { toc: this.toc.reverse() });
this.$store.dispatch('UPDATE_BOOK_PAGES', { pages: this.pages });
```

计算 `el[i].offsetHeight` 之和，构造页数组，以 `$Layout.Height` 为参数分离

> `el[i].offsetHeight` 向上取 `$FontSize * $LineHeight` 倍数

#### 特殊占位符（Placeholder）

* H1(章节分离)
* Img(惰性加载，难以计算，独立成页)

### 切换节点

父元素监听 `Page` 对象变化，删除渲染节点，并写入需要显示的页面数据

```js
isLoading: state => !state.book.pages.length,
```

```jade
page.page-reader(v-if="!$store.getters.isLoading && vertical", v-for="(page, key) in slicedPage", :key="sliced[0] + key")
    PageReader(slot="bd", :index="sliced[0] + key")
transition(v-if="!$store.getters.isLoading && !vertical", :name="transition")
    page.page-reader(v-if="currPos", :key="currPos")
        h3(slot="hd") {{ title }}
        PageReader(slot="bd", :index="currPos - 1")
        span(slot="ft") {{ currPos }}
            span / {{ pages.length }} 
```

### 滚动加载

```jade
page.page-reader(v-if="!$store.getters.isLoading && vertical", v-for="(page, key) in slicedPage", :key="sliced[0] + key")
    PageReader(slot="bd", :index="sliced[0] + key")
transition(v-if="!$store.getters.isLoading && !vertical", :name="transition")
    page.page-reader(v-if="currPos", :key="currPos")
        h3(slot="hd") {{ title }}
        PageReader(slot="bd", :index="currPos - 1")
        span(slot="ft") {{ currPos }}
            span / {{ pages.length }} 
```

在 `mounted` 挂载滚动监听

```js
mounted() {
    global.window.addEventListener('scroll', this.handleScroll);
},
```

`turn` 改变动画参数和游标

```js
handleScroll() {
    const scrollY = Math.floor((global.window.scrollY / this.fontSize) / this.contentHeight);
    this.turn(scrollY - this.currPos);
},
turn(num) {
    this.transition = (num > 0) ? 'slide-left' : 'slide-right';
    if ((this.currPos + num) >= 0 && (this.currPos + num) < this.pages.length) {
        this.currPos += num;
    }
},
```

游标变化后，`sliced` 重新计算，`slicedPage` 随之计算，写入 DOM

```js
sliced() {
    const start = this.currPos >= 3 ? (this.currPos - 3) : 0;
    let end = this.pages.length - 1;
    end = (this.currPos + 3) < end ? (this.currPos + 3) : end;
    return [
    start, end, end - start,
    ];
},
slicedPage() {
    return this.pages.slice(this.sliced[0], this.sliced[1] + 1);
},
```

父元素改变 `padding-top` & `paddingbottom` 来填充滚动条

```js
innerStyle() {
    if (!this.vertical) {
    return {
        width: `${this.pageWidth}em`,
    };
    }
    return {
        width: `${this.pageWidth}em`,
        paddingTop: `${this.contentHeight * this.sliced[0]}em`,
        paddingBottom: `${this.contentHeight * ((this.pages.length - 1) - (this.sliced[0] + this.sliced[2]))}em`,
    };
},
```