# PoorbugCommenter

给博客(Hexo)无痛加入留言板功能。

Powered by [LeanCloud](https://leancloud.cn/)


## How to use it?

1. 注册 LeanCloud，获得 appId & appKey
2. 在 HTML 中预加 `<div id="poorbug-commenter"></div>`
3. 在 HTML 中加入以下代码

```
<script src="../dist/poorbug-commenter-script.js"></script>
<script>
    var poorbugCommenter = new PoorbugCommenter.default({
        id: 'yYInORSnBNBQQFefrizUTyT3-gzGzoHsz',
        key: 'B8TjOpTwOGBgAItLVx0nBIs3',
        item: 'test'
    })
</script>
```
