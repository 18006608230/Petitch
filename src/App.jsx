import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import AppShell from './components/AppShell.jsx'
import HomePage from './pages/HomePage.jsx'
import QuizPage from './pages/QuizPage.jsx'

export default function App() {
  return (
    // reducedMotion="user" 是第二道保险：系统开了「减弱动态效果」时，
    // motion 自己把 transform 类动画收成瞬时，src/motion.js 里的开关再关掉入场和按压。
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            {/* 结果、详情、试养、品种、指南、清单按架构 §1 尚未实现，此处不注册路由，避免留下死链接。 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </MotionConfig>
  )
}
