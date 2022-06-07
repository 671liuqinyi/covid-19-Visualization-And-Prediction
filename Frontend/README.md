# 开发问题

### 1.antd的layout布局页面没有占满全屏幕

将html,body,root等宽度高度设置为100%.

```css
html, body, #root, .ant-layout {
  width: 100%;
  height: 100%;
}
```



### 2. 不同大小页面适配问题

使用Comp组件包裹页面,监视页面大小变化

缺点:页面不能撑满屏幕,字体变模糊.

```jsx
import React from "react";

class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        margin: 0,
        height: "100vh",
        overflow: "hidden"
      },
      body: {
        width: "1920px",
        height: "937px",
      },
    };
  }
  adaptation = () => {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    const l = 1920 / 937;
    const width = h * l;
    const margin = (w - width) / 2 < 0 ? 0 : (w - width) / 2;
    const scale = h / 937;

    this.setState(() => ({
      center: {
        margin: `0 ${margin}px`,
        height: "100vh",
        overflow: "hidden"
      },
      body: {
        transform: `scale(${scale}, ${scale})`,
        width: "1920px",
        height: "937px",
        transformOrigin: "0 0",
        transition: "all 0.3s linear",
      },
    }));
  };
  componentDidMount() {
    this.adaptation();
    window.addEventListener("resize", this.adaptation);
  }

  render() {
    const { children } = this.props
    return (
      <div style={this.state.center}>
        <div style={this.state.body}>
          {children}
        </div>
      </div>
    );
  }
}

export default Comp;
```

### 3.国家卫健委数据不给用

本想使用卫健委的数据,但是数据被设置了权限认证机制,所以无法直接获取数据.

![image-20220502125829829](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20220502125829829.png)

![image-20220502125622753](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20220502125622753.png)

### 4.改做疫情谣言新闻

![image-20220502144116689](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20220502144116689.png)

![image-20220502145443453](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20220502145443453.png)

### 5.代理怪事

直接代理可以获取内容,但是使用proxy_set_header会导致404错误,rewrite无法重写路径

```nginx
# 可以
location /api {
	proxy_pass https://wechat.wecity.qq.com;
}
# 不可以
location /api {
	proxy_pass https://wechat.wecity.qq.com;
  proxy_set_header Host $host:$server_port;
}
# 不可以
location /v1 {
	proxy_pass https://wechat.wecity.qq.com;
  proxy_set_header Host $host:$server_port;
  rewrite "^/v1/(.*)$" /$1 break;
}

```

