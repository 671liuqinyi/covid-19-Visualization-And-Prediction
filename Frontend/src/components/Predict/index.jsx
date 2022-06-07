import React, { useCallback, useEffect, useState } from 'react'
import echarts from 'echarts'
import axios from 'axios'
import predictData from '../../mock/data/predict'
import './index.scss'

export default function Predict() {
  const [fetch, setFetch] = useState(false)
  const [predictNewConfirmList, setPredictNewConfirmList] = useState([])
  const [timeList, setTimeList] = useState([])
  const [heal, setHeal] = useState([])
  const [dead, setDead] = useState([])
  const [nowConfirm, setNowConfirm] = useState([])
  const [noInfect, setNoInfect] = useState([])
  const [hasInfect, setHasInfect] = useState([])
  const generateChart = useCallback(() => {
    const dataShadow = new Array(timeList.length).fill(50)
    const barChart = echarts.init(document.getElementById('barchart'));
    const topPieChart = echarts.init(document.getElementById('toppiechart'));
    const bottomPieChart = echarts.init(document.getElementById('bottompiechart'));
    let barChartOption = {
      title: {
        text: '本土新增预测',
        subtext: '数据仅供参考'
      },
      xAxis: {
        data: timeList,
        axisTick: {
          show: false
        },
        axisLine: {
          show: true
        },
        z: 10
      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      series: [
        { // For shadow
          type: 'bar',
          itemStyle: {
            color: 'rgba(0,0,0,0.05)'
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false,
        },
        {
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ]
            ),
          },
          label: {
            show: true,
            position: 'top'
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ]
              )
            }
          },
          data: predictNewConfirmList
        }
      ]
    };
    let topPieChartOption = {
      title: {
        text: '疫情治疗状况'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{d}%',
      },
      legend: {
        show: false,
        top: '5%',
        left: 'center',
      },
      color: ['green', 'black', 'gold'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'outside',
              formatter: '{b}:{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
            },
          },
          emphasis: {
            label: {
              show: true,
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 15,     // 指示线宽度
            }
          },
          data: [
            { value: heal, name: '治愈率' },
            { value: dead, name: '死亡率' },
            { value: nowConfirm, name: '现有' }
          ]
        }
      ]
    }
    let bottomPieChartOption = {
      title: {
        text: '确诊人员分布'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{d}%',
      },
      legend: {
        show: false,
        top: '5%',
        left: 'center',
      },
      color: ['gray', 'salmon'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'outside',
              formatter: '{b}:{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
            },
          },
          emphasis: {
            label: {
              show: true,
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 15,     // 指示线宽度
            }
          },
          data: [
            { value: noInfect, name: '无症状' },
            { value: hasInfect, name: '有症状' },
          ]
        }
      ]
    }

    barChart.setOption(barChartOption)
    topPieChart.setOption(topPieChartOption)
    bottomPieChart.setOption(bottomPieChartOption)
  }, [dead, hasInfect, heal, noInfect, nowConfirm, predictNewConfirmList, timeList])
  useEffect(() => {
    async function getRealDate() {
      // 获取饼图数据
      let { data } = await axios.get('https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf')
      data = data.data.diseaseh5Shelf.chinaTotal
      setHeal(data.heal)
      setDead(data.dead)
      setNowConfirm(data.nowConfirm)
      setNoInfect(data.noInfect)
      setHasInfect(data.confirm - data.noInfect)
      // 获取折线图数据
      // console.log(`predictData`, predictData)
      let timeList = []
      let predictList = []
      predictData.forEach(item => {
        timeList.push(item.datetime.slice(5))
        predictList.push(item.predictAdd)
      })
      setTimeList(timeList)
      setPredictNewConfirmList(predictList)
      setFetch(true)
    }
    fetch ? generateChart() : getRealDate()
  }, [fetch, generateChart])
  return (
    <div className="predict-container">
      <div className="predict-left">
        <div className="predict-bar" id="barchart"></div>
      </div>
      <div className="predict-right">
        <div className="pie-top" id="toppiechart"></div>
        <div className="pie-bottom" id="bottompiechart"></div>
      </div>
    </div>
  )
}
