# UI 组件库使用指南

本项目已集成了基于 shadcn/ui 的组件库，提供了一套现代化、可复用的 React 组件。

## 已安装的组件

### 1. Card 组件
用于创建卡片布局的组件。

```jsx
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>
    内容
  </CardContent>
</Card>
```

### 2. Button 组件
多种样式的按钮组件。

```jsx
import { Button } from './components/ui/button'

<Button variant="default">默认按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="destructive">危险按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="link">链接按钮</Button>
```

### 3. Input 组件
输入框组件。

```jsx
import { Input } from './components/ui/input'

<Input placeholder="请输入内容..." />
<Input type="email" placeholder="邮箱" />
<Input type="password" placeholder="密码" />
```

### 4. Badge 组件
徽章组件，用于显示状态或标签。

```jsx
import { Badge } from './components/ui/badge'

<Badge>默认</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="destructive">危险</Badge>
<Badge variant="outline">轮廓</Badge>
```

### 5. Alert 组件
提示信息组件。

```jsx
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert'

<Alert>
  <AlertTitle>提示</AlertTitle>
  <AlertDescription>这是提示内容</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>错误</AlertTitle>
  <AlertDescription>这是错误信息</AlertDescription>
</Alert>
```

## 统一导入

您可以从 `./components/ui` 统一导入所有组件：

```jsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Input,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription 
} from './components/ui'
```

## 样式系统

组件使用 Tailwind CSS 构建，支持：
- 响应式设计
- 深色模式（通过 CSS 变量）
- 自定义主题色彩
- 灵活的样式覆盖

## 查看示例

运行项目后，您可以查看 `ComponentShowcase.jsx` 文件来了解所有组件的使用示例。

## 扩展组件

如需添加更多组件，请参考 shadcn/ui 官方文档：https://ui.shadcn.com/

所有组件都遵循相同的设计模式和代码结构。
