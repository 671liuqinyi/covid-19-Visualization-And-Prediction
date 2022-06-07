import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './index.scss'
// 谣言列表组件
const RumorList = (props) => {
  const { index, title, mainSummary, body, rumorType } = props
  const [isFold, setIsFold] = useState(true)
  const foldDetail = (e) => {
    setIsFold(!isFold)
    // 防止a链接跳转改变路由
    e.preventDefault()
  }
  return (
    <div className="rumor-content">
      <div className="left-top-triangle"><span>{index + 1}</span></div>
      <div className={`right-top-icon ${rumorType === 0 ? 'fakeicon' : rumorType === 1 ? 'trueicon' : 'unknownicon'}`}></div>
      <h4 className="rumor-title">{title}</h4>
      <div className="rumor-body">
        <p className="rumor-summary">{mainSummary}</p>
        {isFold ? '' : <p className="rumor-detail">{body}</p>}
        {!isFold ? '' : <div className="more-detail" onClick={(e) => { foldDetail(e) }}><a href="##" >展开详情</a></div>}
        {isFold ? '' : <div className="less-detail" onClick={(e) => { foldDetail(e) }}><a href="##" >收起详情</a></div>}
      </div>
    </div>
  )
}
export default function Rumor() {
  const [rumorArr, setRumorArr] = useState([])
  useEffect(() => {
    getRumorData()
  }, [])
  const getRumorData = async () => {
    let { data } = await axios.get('https://file1.dxycdn.com/2020/0130/454/3393874921745912507-115.json')
    // console.log(`data`, data)
    setRumorArr(data.data)
  }
  return (
    <div className="rumor-container">
      <div className="rumor-header">
        <img src="https://assets.dxycdn.com/gitrepo/ncov-mobile/dist/static/rumor-bg@3x.e5bdde0e.png" alt="谣言" />
      </div>
      {
        rumorArr.length === 0 ? '' :
          rumorArr.map((item, index) => {
            return <RumorList key={index} {...item} index={index} />
          })
      }
    </div>
  )
}