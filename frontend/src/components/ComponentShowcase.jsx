import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, Alert, AlertTitle, AlertDescription } from './ui'

export default function ComponentShowcase() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">shadcn/ui 组件展示</h1>
      
      {/* Card 示例 */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>卡片标题</CardTitle>
        </CardHeader>
        <CardContent>
          <p>这是一个卡片组件的示例内容。</p>
        </CardContent>
      </Card>

      {/* Button 示例 */}
      <div className="space-x-4">
        <Button>默认按钮</Button>
        <Button variant="secondary">次要按钮</Button>
        <Button variant="outline">轮廓按钮</Button>
        <Button variant="destructive">危险按钮</Button>
        <Button variant="ghost">幽灵按钮</Button>
        <Button variant="link">链接按钮</Button>
      </div>

      {/* Input 示例 */}
      <div className="space-y-4 max-w-md">
        <Input placeholder="请输入内容..." />
        <Input type="email" placeholder="请输入邮箱..." />
        <Input type="password" placeholder="请输入密码..." />
      </div>

      {/* Badge 示例 */}
      <div className="space-x-2">
        <Badge>默认徽章</Badge>
        <Badge variant="secondary">次要徽章</Badge>
        <Badge variant="destructive">危险徽章</Badge>
        <Badge variant="outline">轮廓徽章</Badge>
      </div>

      {/* Alert 示例 */}
      <Alert>
        <AlertTitle>提示</AlertTitle>
        <AlertDescription>
          这是一个默认的提示信息组件。
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>
          这是一个错误提示信息组件。
        </AlertDescription>
      </Alert>
    </div>
  )
}
