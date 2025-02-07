// This file is modified by guole
// * Translated into Chinese.
// * Remove title of category statistics chart.
// * Enlarge size of category statistics chart.
// * Add post canlendar.
// * Add category radar chart.

const cheerio = require('cheerio')
const moment = require('moment')

hexo.extend.filter.register('after_generate', function () {
    // 首先获取整体的配置项名称
    const config = hexo.config.charts ? hexo.config.charts : hexo.theme.config.charts
    // 如果配置开启
    if (!(config && config.enable)) return
    // 集体声明配置项
    const data = {
        postsChart_Title: config.postsChart.title ? config.postsChart.title : "",
        postsChart1_Title: config.postsChart1.title ? config.postsChart1.title : "",
        postsCalendar_Title: config.postsCalendar_title ? config.postsCalendar_title : "",
        tagsChart_Title: config.tagsChart.title ? config.tagsChart.title : "",
        categoriesChart_Title: config.categoriesChart_title ? config.categoriesChart_title : "",
        categoriesRadar_Title: config.categoriesRadar_title ? config.categoriesRadar_title : "",
        postsChart_interval: config.postsChart.interval ? config.postsChart.interval : 0,
        postsChart1_interval: config.postsChart.interval ? config.postsChart.interval : 0,
        tagsChart_interval: config.tagsChart.interval ? config.tagsChart.interval : 0,
      }

hexo.extend.filter.register('after_render:html', function (locals) {
  const $ = cheerio.load(locals)
  const post = $('#posts-chart')
  const post1 = $('#posts-chart1')
  const tag = $('#tags-chart')
  const category = $('#categories-chart')
  const calendar = $('#posts-calendar')
  const radar = $('#categories-radar')
  let htmlEncode = false

  if (post.length > 0 || post1.length > 0 || tag.length > 0 || category.length > 0 || calendar.length > 0 || radar.length > 0) {
    $('head').after('<style type="text/css">#posts-chart,#posts-chart1,#posts-calendar,#categories-chart,#categories-radar,#tags-chart{max-width:760px;width: 100%;height: 300px;margin: 0.5rem auto;padding: 0.5rem;display: flex;}</style><script type="text/javascript" data-pjax src="https://cdn.jsdelivr.net/npm/echarts@4.7.0/dist/echarts.min.js"></script>')
    if (post.length > 0 && $('#postsChart').length === 0) {
      if (post.attr('data-encode') === 'true') htmlEncode = true
      post.after(postsChart())
    }
    if (post1.length > 0 && $('#postsChart1').length === 0) {
      if (post1.attr('data-encode') === 'true') htmlEncode = true
      post1.after(postsChart1())
    }
    if (calendar.length > 0 && $('#postsCalendar').length === 0) {
      if (calendar.attr('data-encode') === 'true') htmlEncode = true
      calendar.after(postsCalendar())
    }
    if (tag.length > 0 && $('#tagsChart').length === 0) {
      if (tag.attr('data-encode') === 'true') htmlEncode = true
      tag.after(tagsChart(tag.attr('data-length')))
    }
    if (category.length > 0 && $('#categoriesChart').length === 0) {
      if (category.attr('data-encode') === 'true') htmlEncode = true
      category.after(categoriesChart())
    }
    if (radar.length > 0 && $('#categoriesRadar').length === 0) {
      if (radar.attr('data-encode') === 'true') htmlEncode = true
      radar.after(categoriesRadar())
    }
    if (htmlEncode) {
      return $.root().html().replace(/&amp;#/g, '&#')
    } else {
      return $.root().html()
    }
  } else {
    return locals
  }
}, 30)

function postsChart () {
  const startDate = moment().subtract(1, 'years').startOf('month')
  const endDate = moment().endOf('month')

  const monthMap = new Map()
  const dayTime = 3600 * 24 * 1000
  for (let time = startDate; time <= endDate; time += dayTime) {
    const month = moment(time).format('YYYY-MM')
    if (!monthMap.has(month)) {
      monthMap.set(month, 0)
    }
  }
  hexo.locals.get('posts').forEach(function (post) {
    const month = post.date.format('YYYY-MM')
    if (monthMap.has(month)) {
      monthMap.set(month, monthMap.get(month) + 1)
    }
  })
  
  const monthArr = JSON.stringify([...monthMap.keys()])
  const monthValueArr = JSON.stringify([...monthMap.values()])

  return `
  <script id="postsChart" data-pjax>
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let postsChart = echarts.init(document.getElementById('posts-chart'));
      let postsOption = {
          title: {
              text: '${data.postsChart_Title}',
              top: 0,
              x: 'center',
              textStyle: {
                  color: color
              }
          },
          tooltip: {
              trigger: 'axis'
          },
          xAxis: {
              name: '日期',
              type: 'category',
              axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                },
                axisLabel: {
                    interval:${data.postsChart_interval},
                    rotate:20
                },
              data: ${monthArr}
          },
          yAxis: {
              name: '文章篇数',
              type: 'value',
              splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                }
              },
          series: [
              {
                  // name: 'Number of Post',
                  name: '文章篇数',
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                      width: 0
                  },
                  showSymbol: false,
                  itemStyle: {
                      opacity: 1,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                      }])
                    },
                    areaStyle: {
                      opacity: 1,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                      }, {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                      }])
                    },
                  data: ${monthValueArr},
                  markLine: {
                      itemStyle: {color: ['#ab47bc']},
                      data: [
                          {type: 'average', name: '平均值'}
                      ]
                  }
              }
          ]
      };
      postsChart.setOption(postsOption);
      window.addEventListener("resize", () => { 
          postsChart.resize();
        });
    document.addEventListener('pjax:complete', function () {
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let postsChart = echarts.init(document.getElementById('posts-chart'));
      let postsOption = {
          title: {
              text: '${data.postsChart_Title}',
              top: 0,
              x: 'center',
              textStyle: {
                  color: color
              }
          },
          tooltip: {
              trigger: 'axis'
          },
          xAxis: {
              name: '日期',
              type: 'category',
              axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                },
                axisLabel: {
                    interval:${data.postsChart_interval},
                    rotate:20
                },
              data: ${monthArr}
          },
          yAxis: {
              name: '文章篇数',
              type: 'value',
              splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                }
              },
          series: [
              {
                  // name: 'Number of Post',
                  name: '文章篇数',
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                      width: 0
                  },
                  showSymbol: false,
                  itemStyle: {
                      opacity: 1,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                      }])
                    },
                    areaStyle: {
                      opacity: 1,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                      }, {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                      }])
                    },
                  data: ${monthValueArr},
                  markLine: {
                      itemStyle: {color: ['#ab47bc']},
                      data: [
                          {type: 'average', name: '平均值'}
                      ]
                  }
              }
          ]
      };
      postsChart.setOption(postsOption);
      window.addEventListener("resize", () => { 
          postsChart.resize();
        });
      })
    </script>`
}

function postsChart1 () {
  const startDate = moment().subtract(1, 'years').startOf('month')
  const endDate = moment().endOf('month')

  const monthMap = new Map()
  const dayTime = 3600 * 24 * 1000
  for (let time = startDate; time <= endDate; time += dayTime) {
    const month = moment(time).format('YYYY-MM')
    if (!monthMap.has(month)) {
      monthMap.set(month, 0)
    }
  }
  hexo.locals.get('posts').forEach(function (post1) {
    const month = post1.date.format('YYYY-MM')
    if (monthMap.has(month)) {
      monthMap.set(month, monthMap.get(month) + 1)
    }
  })

  return `
  <script id="postsChart1" data-pjax>
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let postsChart1 = echarts.init(document.getElementById('posts-chart1'));
      let posts1Option = {
          title: {
              text: '${data.postsChart1_Title}',
              top: 0,
              x: 'center',
              textStyle: {
                  color: color
              }
          },
          tooltip: {
              trigger: 'axis'
          },
          xAxis: {
              name: '年份-月份',
              type: 'category',
              axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                },
                axisLabel: {
                    interval:${data.postsChart1_interval},
                    rotate:20
                },
              data: ["2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-06","2022-07","2022-08","2022-09","2022-10"]
          },
          yAxis: {
              name: '日期',
              type: 'value',
              splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                }
              },
          series: [
              {
                  // name: 'Number of Post',
                  name: '日期',
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                      width: 0
                  },
                  showSymbol: false,
                  itemStyle: {
                      opacity: 1,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                      }])
                    },
                    areaStyle: {
                      opacity: 1,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                      }, {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                      }])
                    },
                  data: [4,10,16,17,24,27,26,02,02,05,10,18],
                  markPoint: {
                      symbolSize: 45,
                      color: ['#fa755a','#3ecf8e','#82d3f4'],
                      data: [{
                          type: 'max',
                          itemStyle: {color: ['#3ecf8e']},
                          name: '最大值'
                      }, {
                          type: 'min',
                          itemStyle: {color: ['#fa755a']},
                          name: '最小值'
                      }]
                  },
                  markLine: {
                      itemStyle: {color: ['#ab47bc']},
                      data: [
                          {type: 'average', name: '平均值'}
                      ]
                  }
              }
          ]
      };
      postsChart1.setOption(posts1Option);
      window.addEventListener("resize", () => { 
          postsChart1.resize();
        });
    document.addEventListener('pjax:complete', function () {
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let postsChart1 = echarts.init(document.getElementById('posts-chart1'));
      let posts1Option = {
          title: {
              text: '${data.postsChart1_Title}',
              top: 0,
              x: 'center',
              textStyle: {
                  color: color
              }
          },
          tooltip: {
              trigger: 'axis'
          },
          xAxis: {
              name: '年份-月份',
              type: 'category',
              axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                },
                axisLabel: {
                    interval:${data.postsChart1_interval},
                    rotate:20
                },
              data: ["2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-06","2022-07","2022-08","2022-09","2022-10"]
          },
          yAxis: {
              name: '日期',
              type: 'value',
              splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                }
              },
          series: [
              {
                  // name: 'Number of Post',
                  name: '日期',
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                      width: 0
                  },
                  showSymbol: false,
                  itemStyle: {
                      opacity: 1,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                      }])
                    },
                    areaStyle: {
                      opacity: 1,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                      }, {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                      }])
                    },
                  data: [4,10,16,17,24,27,26,02,02,05,10,18],
                  markPoint: {
                      symbolSize: 45,
                      color: ['#fa755a','#3ecf8e','#82d3f4'],
                      data: [{
                          type: 'max',
                          itemStyle: {color: ['#3ecf8e']},
                          name: '最大值'
                      }, {
                          type: 'min',
                          itemStyle: {color: ['#fa755a']},
                          name: '最小值'
                      }]
                  },
                  markLine: {
                      itemStyle: {color: ['#ab47bc']},
                      data: [
                          {type: 'average', name: '平均值'}
                      ]
                  }
              }
          ]
      };
      postsChart1.setOption(posts1Option);
      window.addEventListener("resize", () => { 
          postsChart1.resize();
        });
    })
    </script>`
}

// Post Canlendar added by guole
function postsCalendar () {
  // calculate range.
  const startDate = moment().subtract(1, 'years')
  const endDate = moment()
  const rangeArr = '["' + startDate.format('YYYY-MM-DD') + '", "' + endDate.format('YYYY-MM-DD') + '"]'

  // post and count map.
  const dateMap = new Map()
  hexo.locals.get('posts').forEach(function (post) {
    const date = post.date.format('YYYY-MM-DD')
    const count = dateMap.get(date)
    dateMap.set(date, count === null || count === undefined ? 1 : count + 1)
  })

  // loop the data for the current year, generating the number of post per day
  var i = 0
  var datePosts = '['
  const dayTime = 3600 * 24 * 1000
  for (let time = startDate; time <= endDate; time += dayTime) {
    const date = moment(time).format('YYYY-MM-DD')
    datePosts = (i === 0 ? datePosts + '["' : datePosts + ', ["') + date + '", ' + (dateMap.has(date) ? dateMap.get(date) : 0) + ']'
    i++
  }
  datePosts += ']'

  return `
  <script id="postsCalendar" calss="data-pjax">
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let postsCalendar = echarts.init(document.getElementById('posts-calendar'));
      let postsCalendarOption = {
          title: {
              top: 0,
              text: '文章发布日历表',
              left: 'center',
              textStyle: {
                  color: color
              }
          },
          tooltip: {
              padding: 10,
              backgroundColor: '#555',
              borderColor: '#777',
              borderWidth: 1,
              formatter: function (obj) {
                  var value = obj.value;
                  return '<div style="font-size: 14px;">' + value[0] + '<br/> ✒️文章 : ' + value[1] + '</div>';
              }
          },
          visualMap: {
              show: true,
              showLabel: true,
              categories: [0, 1, 2, 3, ">=4"],
              calculable: true,
              inRange: {
                  symbol: 'rect',
                  color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
              },
              itemWidth: 12,
              itemHeight: 12,
              orient: 'horizontal',
              left: 'center',
              textStyle: {
                  color: color
              },
              bottom: 30
          },
          calendar: [{
              top: 90,
              right: 25,
              range: ${rangeArr},
              cellSize: [13, 13],
              splitLine: {
                  show: false
              },
              itemStyle: {
                  color: color,
                  borderColor: '#fff',
                  borderWidth: 2
              },
              yearLabel: {
                  show: false
              },
              monthLabel: {
                  nameMap: 'cn',
                  fontSize: 11,
                  textStyle: {
                      color: color
                    }
              },
              dayLabel: {
                  formatter: '{start}  1st',
                  nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                  fontSize: 11,
                  textStyle: {
                      color: color
                    }
              }
          }],
          series: [{
              type: 'heatmap',
              coordinateSystem: 'calendar',
              calendarIndex: 0,
              data: ${datePosts}
          }]
      };
      postsCalendar.setOption(postsCalendarOption);
    document.addEventListener('pjax:complete', function () {
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let postsCalendar = echarts.init(document.getElementById('posts-calendar'));
      let postsCalendarOption = {
          title: {
              top: 0,
              text: '文章发布日历表',
              left: 'center',
              textStyle: {
                  color: color
              }
          },
          tooltip: {
              padding: 10,
              backgroundColor: '#555',
              borderColor: '#777',
              borderWidth: 1,
              formatter: function (obj) {
                  var value = obj.value;
                  return '<div style="font-size: 14px;">' + value[0] + '<br/> ✒️文章 : ' + value[1] + '</div>';
              }
          },
          visualMap: {
              show: true,
              showLabel: true,
              categories: [0, 1, 2, 3, ">=4"],
              calculable: true,
              inRange: {
                  symbol: 'rect',
                  color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
              },
              itemWidth: 12,
              itemHeight: 12,
              orient: 'horizontal',
              left: 'center',
              textStyle: {
                  color: color
              },
              bottom: 30
          },
          calendar: [{
              top: 90,
              right: 25,
              range: ${rangeArr},
              cellSize: [13, 13],
              splitLine: {
                  show: false
              },
              itemStyle: {
                  color: color,
                  borderColor: '#fff',
                  borderWidth: 2
              },
              yearLabel: {
                  show: false
              },
              monthLabel: {
                  nameMap: 'cn',
                  fontSize: 11,
                  textStyle: {
                      color: color
                    }
              },
              dayLabel: {
                  formatter: '{start}  1st',
                  nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                  fontSize: 11,
                  textStyle: {
                      color: color
                    }
              }
          }],
          series: [{
              type: 'heatmap',
              coordinateSystem: 'calendar',
              calendarIndex: 0,
              data: ${datePosts}
          }]
      };
      postsCalendar.setOption(postsCalendarOption);
      })
      </script>`
}

function tagsChart (dataLength = 10) {
  const tagArr = []
  hexo.locals.get('tags').map(function (tag) {
    tagArr.push({ name: tag.name, value: tag.length })
  })
  tagArr.sort((a, b) => { return b.value - a.value })

  const tagNameArr = []
  const tagCountArr = []
  for (let i = 0, len = Math.min(tagArr.length, dataLength); i < len; i++) {
    tagNameArr.push(tagArr[i].name)
    tagCountArr.push(tagArr[i].value)
  }

  const tagNameArrJson = JSON.stringify(tagNameArr)
  const tagCountArrJson = JSON.stringify(tagCountArr)

  return `

  <script id="tagsChart" data-pjax>
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let tagsChart = echarts.init(document.getElementById('tags-chart'));
      let tagsOption = {
          title: {
              text: '${data.tagsChart_Title}',
              top: 0,
              textStyle: {
                  color: color
                },
              x: 'center'
          },
          tooltip: {
              formatter: "{b} : {c}"
          },
          xAxis: {
              name: '标签',
              type: 'category',
              axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                },
                axisLabel: {
                    interval:${data.tagsChart_interval},
                    rotate:20
                },
                grid: {
                  left: '10%',
                  bottom:'25%'
                  },
              data: ${tagNameArrJson}
          },
          yAxis: {
              name: '文章篇数',
              type: 'value',
              splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                }
              },
          series: [
              {
                  name: '文章篇数',
                  type: 'bar',
                  color: ['#82d3f4'],
                  data: ${tagCountArrJson},
                  itemStyle: {
                      opacity: 1,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                      }])
                    },
                    emphasis: {
                      itemStyle: {
                        opacity: 1,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgba(128, 255, 195)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(1, 211, 255)'
                        }])
                      }
                    },
                  markPoint: {
                      symbolSize: 45,
                      data: [{
                          type: 'max',
                          itemStyle: {color: ['#3ecf8e']},
                          name: '最大值'
                      }, {
                          type: 'min',
                          itemStyle: {color: ['#fa755a']},
                          name: '最小值'
                      }],
                  },
                  markLine: {
                      itemStyle: {color: ['#ab47bc']},
                      data: [
                          {type: 'average', name: '平均值'}
                      ]
                  }
              }
          ]
      };
      tagsChart.setOption(tagsOption);
    document.addEventListener('pjax:complete', function () {
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let tagsChart = echarts.init(document.getElementById('tags-chart'));
      let tagsOption = {
          title: {
              text: '${data.tagsChart_Title}',
              top: 0,
              textStyle: {
                  color: color
                },
              x: 'center'
          },
          tooltip: {
              formatter: "{b} : {c}"
          },
          xAxis: {
              name: '标签',
              type: 'category',
              axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                },
                axisLabel: {
                    interval:${data.tagsChart_interval},
                    rotate:20
                },
                grid: {
                  left: '10%',
                  bottom:'25%'
                  },
              data: ${tagNameArrJson}
          },
          yAxis: {
              name: '文章篇数',
              type: 'value',
              splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: color
                  }
                }
              },
          series: [
              {
                  name: '文章篇数',
                  type: 'bar',
                  color: ['#82d3f4'],
                  data: ${tagCountArrJson},
                  itemStyle: {
                      opacity: 1,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                      }])
                    },
                    emphasis: {
                      itemStyle: {
                        opacity: 1,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgba(128, 255, 195)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(1, 211, 255)'
                        }])
                      }
                    },
                  markPoint: {
                      symbolSize: 45,
                      data: [{
                          type: 'max',
                          itemStyle: {color: ['#3ecf8e']},
                          name: '最大值'
                      }, {
                          type: 'min',
                          itemStyle: {color: ['#fa755a']},
                          name: '最小值'
                      }],
                  },
                  markLine: {
                      itemStyle: {color: ['#ab47bc']},
                      data: [
                          {type: 'average', name: '平均值'}
                      ]
                  }
              }
          ]
      };
      tagsChart.setOption(tagsOption);
      })
      </script>`
}

function categoriesChart () {
  const categoryArr = []
  hexo.locals.get('categories').map(function (category) {
    categoryArr.push({ name: category.name, value: category.length })
  })

  const categoryArrJson = JSON.stringify(categoryArr)

  return `
  <script id="categoriesChart" data-pjax>
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let categoriesChart = echarts.init(document.getElementById('categories-chart'));
      let categoriesOption = {
          title: {
              text: '文章分类统计图',
              top: 0,
              x: 'center',
              textStyle: {
                color: color
            }
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
              {
                  // name: 'Category:',
                  name: '✒️文章篇数',
                  type: 'pie',
                  radius: '75%',
                  color: ['#6772e5', '#ff9e0f', '#fa755a', '#3ecf8e', '#82d3f4', '#ab47bc', '#525f7f', '#f51c47', '#26A69A'],
                  data: ${categoryArrJson},
                  itemStyle: {
                      emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
      };
      categoriesChart.setOption(categoriesOption);
    document.addEventListener('pjax:complete', function () {
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let categoriesChart = echarts.init(document.getElementById('categories-chart'));
      let categoriesOption = {
          title: {
              text: '文章分类统计图',
              top: 0,
              x: 'center',
              textStyle: {
                color: color
            }
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
              {
                  // name: 'Category:',
                  name: '✒️文章篇数',
                  type: 'pie',
                  radius: '75%',
                  color: ['#6772e5', '#ff9e0f', '#fa755a', '#3ecf8e', '#82d3f4', '#ab47bc', '#525f7f', '#f51c47', '#26A69A'],
                  data: ${categoryArrJson},
                  itemStyle: {
                      emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
      };
      categoriesChart.setOption(categoriesOption);
      })
    </script>`
}

// Category Radar added by guole
function categoriesRadar () {
  const categories = hexo.locals.get('categories')

  // Find the maximum and average values of the post categories.
  const radarValueArr = []
  categories.some(function (category) {
    radarValueArr.push(category.length)
  })
  const max = Math.max.apply(null, radarValueArr) + Math.min.apply(null, radarValueArr)

  // Calculate the data needed for the radar chart.
  const indicatorArr = [];
  categories.map(function (category) {
    indicatorArr.push({ name: category.name, max: max });
  });

  const indicatorData = JSON.stringify(indicatorArr);
  const radarValueData = JSON.stringify(radarValueArr);

  return `
  <script id="categoriesRadar" data-pjax>
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let categoriesRadar = echarts.init(document.getElementById('categories-radar'));
      let categoriesRadarOption = {
          title: {
              left: 'center',
              text: '文章分类雷达图',
              textStyle: {
                  fontWeight: 500,
                  fontSize: 22,
                  color: color
              }
          },
          tooltip: {},
          radar: {
              name: {
                  textStyle: {
                      color: color
                  }
              },
              indicator: ${indicatorData},
              nameGap: 5,
              center: ['50%','55%'],
              radius: '75%',
              left: 'center'
          },
          series: [{
              type: 'radar',
              color: ['#3ecf8e'],
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data : [
                  {
                      value : ${radarValueData},
                      // name : 'Categories:'
                      name: '✒️文章篇数'
                  }
              ]
          }]
      };
      categoriesRadar.setOption(categoriesRadarOption);
    document.addEventListener('pjax:complete', function () {
      var color = '#6e7f98';
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : '#afb8c5';
      let categoriesRadar = echarts.init(document.getElementById('categories-radar'));
      let categoriesRadarOption = {
          title: {
              left: 'center',
              text: '文章分类雷达图',
              textStyle: {
                  fontWeight: 500,
                  fontSize: 22,
                  color: color
              }
          },
          tooltip: {},
          radar: {
              name: {
                  textStyle: {
                      color: color
                  }
              },
              indicator: ${indicatorData},
              nameGap: 5,
              center: ['50%','55%'],
              radius: '75%',
              left: 'center'
          },
          series: [{
              type: 'radar',
              color: ['#3ecf8e'],
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data : [
                  {
                      value : ${radarValueData},
                      // name : 'Categories:'
                      name: '✒️文章篇数'
                  }
              ]
          }]
      };
      categoriesRadar.setOption(categoriesRadarOption);
      })
    </script>`
}
})
