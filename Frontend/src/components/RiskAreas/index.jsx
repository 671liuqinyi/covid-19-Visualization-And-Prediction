import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './index.scss'
const AreaList = (props) => {
  const { RiskAreaList, level } = props
  const [list, setList] = useState([])
  useEffect(() => {
    let allList = []
    RiskAreaList.forEach(item => {
      let provinceName = item.provinceName
      let areaRiskDetails = item.areaRiskDetails
      areaRiskDetails.forEach(item1 => {
        let cityName = item1.cityName
        let areaName = item1.areaName
        let communityRiskDetails = item1.communityRiskDetails
        let communityList = []
        communityRiskDetails.forEach(item2 => {
          communityList.push(item2.communityName)
        })
        let area_name = `${provinceName} ${cityName} ${areaName}`
        allList.push({ area_name, communityList: [...communityList] })
      })
      setList(allList)
    })
  }, [RiskAreaList])
  return (
    <div>
      {list.length <= 0 ? '' : list.map((item, index) => {
        return (
          <div className={"high-area"} key={index}>
            {item.area_name}
            <table>
              <tbody>
                {item.communityList.length <= 0 ? '' : item.communityList.map((areaname, index) => {
                  return (
                    <tr key={index}>
                      <td>{areaname}</td>
                      <td className={level === 'high' ? "high-td" : "middle-td"}>{level === 'high' ? '高风险' : '中风险'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
export default function RiskAreas() {
  const [selected, setSelected] = useState('high')
  const [latestDeadlineDate, setLatestDeadlineDate] = useState('')
  const [highTotalNum, setHighTotalNum] = useState(0)
  const [highRiskAreaList, setHighRiskAreaList] = useState([])
  const [mediumTotalNum, setMediumTotalNum] = useState(0)
  const [mediumRiskAreaList, setMediumRiskAreaList] = useState([])
  useEffect(() => {
    getRiskAreaData()
  }, [])
  const getRiskAreaData = async () => {
    let { data } = await axios({
      method: 'post',
      url: '/api/PneumoniaTravelNoAuth/queryAllRiskLevel',
      data:
        { "args": { "req": {} }, "service": "PneumoniaTravelNoAuth", "func": "queryAllRiskLevel", "context": { "userId": "3f7248ef8424478783b33ce63c766f7f" } }
    })
    // console.log(`data`, data)
    data = data.args.rsp
    setLatestDeadlineDate(data.latestDeadlineDate)
    setHighTotalNum(data.highTotalNum)
    setHighRiskAreaList(data.highRiskAreaList)
    setMediumTotalNum(data.mediumTotalNum)
    setMediumRiskAreaList(data.mediumRiskAreaList)
  }
  const changeSelected = (level) => {
    setSelected(level)
  }
  return (
    <div className="riskareas-content">
      <div className="riskareas-container">
        <div className="riskareas-banner">
          <img src="http://bmfw.www.gov.cn/yqfxdjcx/source/PC/images/banner.png" alt="疫情风险等级查询" />
        </div>
        <div>
          <div className="riskareas-header">
            <p className="riskarea-time">截至{latestDeadlineDate}时，全国疫情：</p>
            <div className={`high-header ${selected === 'high' ? "riskareas-header-active" : ''}`} onClick={() => { changeSelected('high') }}>
              高风险等级地区 <span>({highTotalNum})</span>
            </div>
            <div className={`middle-header ${selected === 'middle' ? "riskareas-header-active" : ''}`} onClick={() => { changeSelected('middle') }}>
              中风险等级地区 <span>({mediumTotalNum})</span>
            </div>
            <div className="low-header">注：表中未列出地区均为<span>低风险</span></div>
          </div>
          {selected === 'high' ?
            <AreaList RiskAreaList={highRiskAreaList} level="high" /> :
            <AreaList RiskAreaList={mediumRiskAreaList} level="middle" />
          }
        </div>
      </div>
    </div>

  )
}

