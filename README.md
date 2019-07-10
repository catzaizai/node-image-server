# 基于nodejs的图片服务器

## 功能

- 根据传入的`options`生成echarts图表，返回base64格式的图片。
- 根据传入的参数，返回base64位格式的截图。

## 使用方式

``` shell

npm start

```

## 接口

> *提示: ? 代表可为空 并不是参数的一部分*

`headers: { "content-type": "application/json" }`

`[POST] /generateEchartsImg` 

``` typescript
{
    options: any,
    width?: number = 500,
    height?: number = 500
}
```

`[POST] /screenshotUrlImg`

requestBody: 
``` typescript
{
    url: string, // 截屏地址
    selector?: string, // 要截取的元素 为空时截取全部
    padding?: string, // 自由裁剪截图范围 类似于css 的padding 写法 ex: '10' 或者 '10 10' 或者 '10 10 10' 或者 '10 10 10 10'
    bbox?: 'element'|'padding'|'border'|'margin'|'composite' = 'composite', // 盒模型 决定元素的截取范围
    delay?: number = '5000', // ms
    operations?: Array<{event:'click'|'hover'|'delete'|'style', selector: string, value?: Array<Array<String>>}> // value 为 style的值 类似于 ['margin', '10px'] 当设置了operations时 会按照顺序执行完之后截屏，可以在这里触发点击事件，删除元素，更改样式，然后再截屏。
}
```

`[POST] /login`

requestBody: 
``` typescript
{
    url: string, 
    username: string, 
    password: string,
    uSelector?: string = '#username',
    pSelector?: string = '#password',
    submitBtnSelector?: string = '#submit'
}
```

## docker

```
docker build -t node-image-server
docker run node-image-server
```