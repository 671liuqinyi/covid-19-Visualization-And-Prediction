import { lazy } from "react"
import { Navigate } from "react-router-dom"
// 页面懒加载
const ChinaMap = lazy(() => import('../components/ChinaMap'))
const Trend = lazy(() => import('../components/Trend'))
const News = lazy(() => import('../components/News'))
const RiskAreas = lazy(() => import('../components/RiskAreas'))
const Test = lazy(() => import('../components/Test'))
const Rumor = lazy(() => import('../components/Rumor'))
const Predict = lazy(() => import('../components/Predict'))
const routes = [
  {
    path: '/chinamap',
    element: <ChinaMap />
  },
  {
    path: '/trend',
    element: <Trend />
  },
  {
    path: '/predict',
    element: <Predict />
  },
  {
    path: '/news',
    element: <News />
  },
  {
    path: '/rumor',
    element: <Rumor />
  },
  {
    path: '/riskareas',
    element: <RiskAreas />
  },
  {
    path: '/test',
    element: <Test />
  },
  {
    path: '/',
    element: <Navigate to="/chinamap" />
  }
]
export default routes