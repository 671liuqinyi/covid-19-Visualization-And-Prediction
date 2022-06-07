import React, { useEffect } from 'react'
import './index.scss'
import echarts from 'echarts'
import axios from 'axios'

export default function Trend() {
  useEffect(() => {
    generateTrendChart()
  }, [])
  // 将数据中的年和日期拼接成xxxx-xx-xx形式
  // const dataFormate = (year, date) => {
  //   return year + '-' + date.split('.').join('-')
  // }
  async function generateTrendChart() {
    const trendChart1 = echarts.init(document.getElementById('trend-chart1'));
    const trendChart2 = echarts.init(document.getElementById('trend-chart2'));
    const trendChart3 = echarts.init(document.getElementById('trend-chart3'));
    const trendChart4 = echarts.init(document.getElementById('trend-chart4'));

    let { data } = await axios.get('https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayList,chinaDayAddList,nowConfirmStatis,provinceCompare')
    const timeArr = []
    const nowConfirmArr = []
    const newConfirmArr = []
    const newSuspectArr = []
    const totalConfirmArr = []
    const totalHealArr = []
    const totalDeadArr = []
    const healRateArr = []
    const deadRateArr = []
    data.data.chinaDayList.forEach(item => {
      // 时间格式(2022-03-04)
      // timeArr.push(dataFormate(item.y, item.date))
      // 时间格式(03.04)
      timeArr.push(item.date)
      nowConfirmArr.push(item.nowConfirm)
      newSuspectArr.push(item.suspect)
      totalConfirmArr.push(item.confirm)
      totalHealArr.push(item.heal)
      totalDeadArr.push(item.dead)
      healRateArr.push(item.healRate)
      deadRateArr.push(item.deadRate)
    })
    data.data.chinaDayAddList.forEach(item => {
      newConfirmArr.push(item.confirm)
    })

    let option1 = {
      visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          // max: 400
        }
      ],
      title: [
        {
          left: 'left',
          text: '全国现有确诊趋势'
        }
      ],
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        type: 'plain',
        left: '0%',
        top: '10%',
        itemStyle: {
          color: '#ff7b7c'
        },
        data: [{ icon: 'rect', name: '现有确诊' },]
      },
      dataZoom: [{
        type: "inside"
      }],
      xAxis: [
        {
          data: timeArr,
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [
        {}
      ],
      grid:
      {
        left: '11%',
        bottom: '10%'
      },
      series: [
        {
          name: '现有确诊',
          type: 'line',
          showSymbol: true,
          areaStyle: {
            color: '#ff7b7c'
          },
          data: nowConfirmArr,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#ff7b7c'
              }
            }
          }
        }
      ]
    }
    let option2 = {
      color: ["#f06061", "#ffd661"],
      visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          // max: 400
        }
      ],
      title: [
        {
          left: 'left',
          text: '全国疫情新增趋势'
        }
      ],
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        type: 'plain',
        left: '0%',
        top: '10%',
        data: [
          { icon: 'rect', name: '新增确诊' },
          { icon: 'rect', name: '新增疑似' },
        ]
      },
      xAxis: [
        {
          data: timeArr,
          axisTick: {
            show: false
          }
        }
      ],
      dataZoom: [{
        type: "inside"
      }],
      yAxis: [
        {}
      ],
      grid:
      {
        left: '10%',
        bottom: '10%'
      },
      series: [
        {
          name: '新增确诊',
          type: 'line',
          showSymbol: true,
          areaStyle: {
            color: '#f06061'
          },
          data: newConfirmArr,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#f06061'
              }
            }
          }
        },
        {
          name: '新增疑似',
          type: 'line',
          showSymbol: true,
          areaStyle: {
            color: '#ffd661'
          },
          data: newSuspectArr,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#ffd661'
              }
            }
          }
        }
      ]
    }
    let option3 = {
      color: ['#9b0a0e', '#65b379', '#87878b'],
      visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          // max: 400
        }
      ],
      title: [
        {
          left: 'left',
          text: '全国累计确诊/治愈/死亡趋势'
        }
      ],
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        type: 'plain',
        left: '0%',
        top: '10%',
        data: [
          { icon: 'rect', name: '累计确诊' },
          { icon: 'rect', name: '累计治愈' },
          { icon: 'rect', name: '累计死亡' }
        ]
      },
      dataZoom: [{
        type: "inside"
      }],
      xAxis: [
        {
          data: timeArr,
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [
        {}
      ],
      grid:
      {
        left: '11%',
        bottom: '10%'
      },
      series: [
        {
          name: '累计确诊',
          type: 'line',
          showSymbol: true,
          areaStyle: {
            color: '#9b0a0e'
          },
          data: totalConfirmArr,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9b0a0e'
              }
            }
          }
        },
        {
          name: '累计治愈',
          type: 'line',
          showSymbol: true,
          areaStyle: {
            color: '#65b379'
          },
          data: totalHealArr,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#65b379'
              }
            }
          }
        },
        {
          name: '累计死亡',
          type: 'line',
          showSymbol: true,
          areaStyle: {
            color: '#87878b'
          },
          data: totalDeadArr,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#87878b'
              }
            }
          }
        }
      ]
    }
    let option4 = {
      color: ['#65b379', '#87878b'],
      visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          // max: 400
        }
      ],
      title: [
        {
          left: 'left',
          text: '全国治愈率/病死率趋势'
        }
      ],
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        type: 'plain',
        left: '0%',
        top: '10%',
        itemStyle: {
        },
        data: [
          { icon: 'rect', name: '治愈率' },
          { icon: 'rect', name: '病死率' },
        ]
      },
      dataZoom: [{
        type: "inside"
      }],
      xAxis: [
        {
          data: timeArr
        }
      ],
      yAxis: [
        {}
      ],
      grid:
      {
        left: '10%',
        bottom: '10%'
      },
      series: [
        {
          name: '治愈率',
          type: 'line',
          showSymbol: true,
          areaStyle: {
            color: '#65b379'
          },
          data: healRateArr,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#65b379'
              }
            }
          }
        },
        {
          name: '病死率',
          type: 'line',
          showSymbol: true,
          areaStyle: {
            color: '#87878b'
          },
          data: deadRateArr,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#87878b'
              }
            }
          }
        }
      ]
    }
    trendChart1.setOption(option1)
    trendChart2.setOption(option2)
    trendChart3.setOption(option3)
    trendChart4.setOption(option4)

  }
  return (
    <>
      <div className="total-trend">
        <div className="trend1">
          <div className="chart" id="trend-chart1"></div>
        </div>
        <div className="trend2">
          {/* <h3>全国疫情新增趋势</h3> */}
          <div className="chart" id="trend-chart2"></div>
        </div>
        <div className="trend3">
          {/* <h3>全国累计确诊/治愈/死亡人数</h3> */}
          <div className="chart" id="trend-chart3"></div>
        </div>
        <div className="trend4">
          {/* <h3>全国治愈率/病死率趋势</h3> */}
          <div className="chart" id="trend-chart4"></div>
        </div>
      </div>
    </>
  )
}