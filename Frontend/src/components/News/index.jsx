import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../Loading'
import './index.scss'

export default function News() {
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const getNewsData = async () => {
    let { data } = await axios.get(`https://lab.isaaclin.cn/nCoV/api/news?page=1&num=10`)
    setList(data.results)
  }
  const getMoreNews = async () => {
    let { data } = await axios.get(`https://lab.isaaclin.cn/nCoV/api/news?page=${page + 1}&num=10`)
    setPage(page + 1)
    setList([...list, ...data.results])
  }
  const dateFormat = (timestamp) => {
    var date = new Date(parseInt(timestamp)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-";
    var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + (date.getDate()) : date.getDate()) + " ";
    var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
    var s = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
  }
  useEffect(() => {
    getNewsData()
  }, [])
  return (
    list.length <= 0 ? <Loading /> :
      <div className="news-container">
        <div className="news-header">疫情新闻播报</div>
        <div>
          <ul>
            {list.map((item, index) => {
              return (
                <li key={index}>
                  <div className="news-time">{dateFormat(item.pubDate)}</div>
                  <div className="news-content">
                    <h4 className="new-title">{item.title}</h4>
                    <p className="summary">{item.summary}</p>
                    <p className="source">新闻来源: <span>{item.infoSource}</span> <a href={item.sourceUrl}>查看详情</a></p>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="more-news" onClick={getMoreNews}>更多新闻</div>
        </div>
      </div>
  )
}