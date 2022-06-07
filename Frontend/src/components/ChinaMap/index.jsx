import React, { useEffect, useRef, useState } from 'react'
import './index.scss'
import echarts from 'echarts/lib/echarts'
import 'echarts/map/js/china'
import { connect } from 'react-redux'
import { getAllData } from '../../redux/actions/home'
import { Table } from 'antd'

function ChinaMap(props) {
  // 从redux取出数据
  const { allData } = props
  // 分别对应六项数据的已有和新增
  const [localConfirm, setLocalConfirm] = useState(0)
  const [newLocalConfirm, setNewLocalConfirm] = useState(0)
  const [nowConfirm, setNowConfirm] = useState(0)
  const [newNowConfirm, setNewNowConfirm] = useState(0)
  const [totalConfirm, setTotalConfirm] = useState(0)
  const [newTotalConfirm, setNewTotalConfirm] = useState(0)
  const [noInfect, setNoInfect] = useState(0)
  const [newNoInfect, setNewNoInfect] = useState(0)
  const [importCase, setImportCase] = useState(0)
  const [newImportCase, setNewImportCase] = useState(0)
  const [dead, setDead] = useState(0)
  const [newDead, setNewDead] = useState(0)
  // 表格数据
  const [tableData, setTableData] = useState([])
  let myChart = useRef()

  // 各省最新确诊数据
  useEffect(() => {
    // 等redux中获取数据
    if (!allData) return
    let arr = allData.data.diseaseh5Shelf.areaTree[0].children
    // 地图数据
    let mapArr = arr.map((item) => {
      return { name: item.name, value: item.today.confirm }
    })
    generateMap(mapArr)
    // 六项主要数据赋值
    let initData = allData.data.diseaseh5Shelf
    assignData(initData)
    // 表格数据
    let data = arr.map((item, index) => {
      return { key: index, province: item.name, newConfirmed: item.today.confirm, totalConfirmed: item.total.nowConfirm }
    })
    insertTableData(data)
    // 图表大小自适应
    // window.onresize = myChart.resize
    // return () => {
    //   window.removeEventListener('onresize', myChart.resize)
    // }
  }, [allData])

  // 根据数据生成疫情地图
  function generateMap(newArr) {
    // console.log(mainData)
    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('map'));
    // 指定图表的配置项和数据
    let option = {
      title: {
        text: '中国疫情图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['中国疫情图']
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          { min: 1000, max: 1000000, label: '大于等于1000人', color: '#372a28' },
          { min: 500, max: 999, label: '确诊500-999人', color: '#4e160f' },
          { min: 100, max: 499, label: '确诊100-499人', color: '#974236' },
          { min: 10, max: 99, label: '确诊10-99人', color: '#ee7263' },
          { min: 1, max: 9, label: '确诊1-9人', color: '#f5bba7' },
        ],
        color: ['#E0022B', '#E09107', '#A3E00B']
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          // dataView: { show: true, readOnly: false },
          // restore: { show: true },
          // saveAsImage: { show: true }
        }
      },
      roamController: {
        show: true,
        left: 'right',
        mapTypeControl: {
          'china': true
        }
      },
      series: [
        {
          name: '确诊数',
          type: 'map',
          mapType: 'china',
          roam: false,
          label: {
            show: true,
            color: '#000'
          },
          data: newArr
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
  // 设置六项主要数据
  function assignData(initData) {
    setLocalConfirm(initData.chinaTotal.localConfirm)
    setNewLocalConfirm(initData.chinaAdd.localConfirmH5)
    setNowConfirm(initData.chinaTotal.nowConfirm)
    setNewNowConfirm(initData.chinaAdd.nowConfirm)
    setTotalConfirm(initData.chinaTotal.confirm)
    setNewTotalConfirm(initData.chinaAdd.confirm)
    setNoInfect(initData.chinaTotal.noInfect)
    setNewNoInfect(initData.chinaAdd.noInfect)
    setImportCase(initData.chinaTotal.importedCase)
    setNewImportCase(initData.chinaAdd.importedCase)
    setDead(initData.chinaTotal.dead)
    setNewDead(initData.chinaAdd.dead)
  }
  // 生成表格数据
  function insertTableData(data) {
    setTableData(data)
  }
  const columns = [
    {
      title: '省市区',
      dataIndex: 'province',
      key: 'province',
      align: 'center',    // 设置文本居中
      width: 80
    },
    /*     {
          title: '城市(区)',
          dataIndex: 'city',
          key: 'city',
          align: 'center',    // 设置文本居中
          width: 1
        }, */
    {
      title: '新增',
      dataIndex: 'newConfirmed',
      key: 'newConfirmed',
      align: 'center',  // 设置文本居中
      className: 'red',
      width: 80
    },
    {
      title: '现有确诊',
      key: 'totalConfirmed',
      dataIndex: 'totalConfirmed',
      align: 'center',    // 设置文本居中
      width: 80
    },
    {
      title: '区域风险',
      key: 'action',
      align: 'center',    // 设置文本居中
      width: 100,
      render: () => (
        <a href='##' className='detail'>点击查看详情</a>
      ),
    },
  ]

  return (
    <div className="grid">
      {/* echarts绘制中国地图容器 */}
      <div id="map"></div>
      {/* 其他数据 */}
      <div id="data">
        <div className="recentNumber">
          <div className='box1'>
            <div className="add">较上日 <span>{newLocalConfirm > 0 ? '+' + newLocalConfirm : newLocalConfirm}</span></div>
            <div className="number">{localConfirm}</div>
            <div className="text"><span>本土现有确诊</span></div>
          </div>
          <div className='box2'>
            <div className="add">较上日 <span>{newNowConfirm > 0 ? '+' + newNowConfirm : newNowConfirm}</span></div>
            <div className="number">{nowConfirm}</div>
            <div className="text"><span>现有确诊</span></div>
          </div>
          <div className='box3'>
            <div className="add">较上日 <span>{newTotalConfirm > 0 ? '+' + newTotalConfirm : newTotalConfirm}</span></div>
            <div className="number">{totalConfirm}</div>
            <div className="text"><span>累计确诊</span></div>
          </div>
          <div className='box4'>
            <div className="add">较上日 <span>{newNoInfect > 0 ? '+' + newNoInfect : newNoInfect}</span></div>
            <div className="number">{noInfect}</div>
            <div className="text"><span>无症状感染者</span></div>
          </div>
          <div className='box5'>
            <div className="add">较上日 <span>{newImportCase > 0 ? '+' + newImportCase : newImportCase}</span></div>
            <div className="number">{importCase}</div>
            <div className="text"><span>境外输入</span></div>
          </div>
          <div className='box6'>
            <div className="add">较上日 <span>{newDead > 0 ? '+' + newDead : newDead}</span></div>
            <div className="number">{dead}</div>
            <div className="text"><span>累计死亡</span></div>
          </div>
        </div>
        <div className='chinaNow'>
          <h4>近期34省区市本土病例(包括港澳台)</h4>
          <Table
            columns={columns}
            pagination={false}
            scroll={document.documentElement.clientHeight < 900 ? { y: 240 } : { y: 440 }}
            dataSource={tableData}
          />
        </div>
      </div>
    </div>
  )

}
export default connect(
  state => ({
    allData: state.allData
  }),
  { getAllData }
)(ChinaMap)