import React, { useState, useEffect, Suspense } from 'react'
import { Link, useRoutes, useLocation } from 'react-router-dom';
import routes from '../../router'
import Loading from '../../components/Loading';
import './index.scss'
import axios from 'axios'
import { connect } from 'react-redux'
import { setAllData } from '../../redux/actions/home'
import { Layout, Menu } from 'antd';
import { HeatMapOutlined, LineChartOutlined, MessageOutlined, EyeOutlined, FundOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

function Home(props) {
  // console.log('home', props)
  // 获取redux中的state和操作state的方法
  const { setAllData } = props
  // 使用路由表
  const element = useRoutes(routes)
  // 获取当前路由
  const location = useLocation()
  // 最新数据更新时间
  const [lastUpdateTime, setLastUpdateTime] = useState('')
  // 控制导航栏高亮
  const [nowNavbar, setNowNavbar] = useState(location.pathname)
  useEffect(() => {
    // 获取所有数据放入redux仓库
    const getAllData = async () => {
      let { data } = await axios.get('https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf')
      // console.log(data)
      let lastUpdateTime = data.data.diseaseh5Shelf.lastUpdateTime
      setLastUpdateTime(lastUpdateTime)
      setAllData(data)
    }
    getAllData()
  }, [setAllData])
  function changeNowNavbar(e) {
    setNowNavbar(e['key'])
  }
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type);
        }}
      >
        <div className="logo" >疫情先知</div>
        <Menu theme="dark" mode="inline" selectedKeys={nowNavbar.toString()} onClick={changeNowNavbar}>
          <Menu.Item key="/chinamap" icon={<HeatMapOutlined />}>
            <Link to="/chinamap">首页</Link>
          </Menu.Item>
          <Menu.Item key="/trend" icon={<LineChartOutlined />}>
            <Link to="/trend">疫情趋势</Link> <br />
          </Menu.Item>
          <Menu.Item key="/predict" icon={<EyeOutlined />}>
            <Link to="/predict">未来预测</Link>
          </Menu.Item>
          <Menu.Item key="/news" icon={<MessageOutlined />}>
            <Link to="/news">新闻</Link>
          </Menu.Item>
          <Menu.Item key="/rumor" icon={<FundOutlined />}>
            <Link to="/rumor">谣言排行榜</Link>
          </Menu.Item>
          <Menu.Item key="/riskareas" icon={<EyeOutlined />}>
            <Link to="/riskareas">风险区域</Link>
          </Menu.Item>
          {/* <Menu.Item key="/test" icon={<MessageOutlined />}>
            <Link to="/test">暂定...</Link>
          </Menu.Item> */}
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-sub-header-background" style={{ padding: 0 }} >
          <div className="title">
            数据更新时间:{lastUpdateTime}
          </div>
        </Header>
        <Content style={{ padding: '5px 5px 0' }} className="layout-content">
          <div className="site-layout-background">
            <Suspense fallback={<Loading />}>
              {element}
            </Suspense>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', padding: 10 }}>疫情展示与预测系统 ©2022 浙江工业大学</Footer>
      </Layout>
    </Layout>
  )
}

export default connect(
  state => ({
    allData: state.allData
  }),
  {
    setAllData
  }
)(Home)