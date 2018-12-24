/*
***糖果盒组件 v1.0.0
*/
var CandyBox = function () {
  this.version = '1.0.0'
  this.baseUrl = 'https://chain.pro/candybox'
  this.defaultOptions = {
    element: 'body',
    list: '',
    width: '410px',
    height: '600px',
    layout: '2'
  }
}

CandyBox.prototype.checkDeviceType = function () {
  var ua = navigator.userAgent
  var isMobile = false
  if ((ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    isMobile = true
  } else {
    isMobile = false
  }
  return isMobile
}

CandyBox.prototype.handleUrl = function (options) {
  var option = Object.assign({}, this.defaultOptions, options)
  var url = this.baseUrl + '/#/candybox?hash=' + parseInt(100000000 * Math.random())
  if (option.list) {
    url += ('&list=' + option.list)
  }
  if (option.layout) {
    url += ('&layout=' + option.layout)
  }
  option.url = url
  return option
}

CandyBox.prototype.handleIframe = function (options) {
  var option = this.composeParams(options)
  var node = document.querySelector(option.element)
  var iframe = node.querySelector('iframe')
  if (iframe) {
    iframe.src = option.url
    iframe.width = option.width
    iframe.height = option.height
    // iframe.contentWindow.location.reload()
  } else {
    iframe = document.createElement('iframe')
    iframe.src = option.url
    iframe.width = option.width
    iframe.height = option.height
    node.appendChild(iframe)
  }
}

CandyBox.prototype.composeParams = function (options) {
  var option = this.handleUrl(options)
  var isMobile = this.checkDeviceType()
  var layoutType = option.layout
  var lineNum = 2
  var iframeWidth = option.width
  var iframeHeight = option.height
  switch (layoutType) {
    case '0':
      lineNum = 2
      break
    case '1':
      lineNum = 2
      iframeWidth = 600
      iframeHeight = 400
      break
    case '2':
      lineNum = 3
      break
    case '3':
      lineNum = 3
      iframeWidth = 650
      iframeHeight = 500
      break
    case '4':
      lineNum = 4
      break
    case '5':
      lineNum = 4
      iframeWidth = 650
      iframeHeight = 550
      break
  }
  if (isMobile) {
    var deviceWidth = window.innerWidth
    iframeWidth = deviceWidth * 90 / 100
  }
  option.width = iframeWidth
  option.height = iframeHeight
  option.lineNum = lineNum
  option.url = option.url + '&lineNum=' + lineNum
  return option
}

CandyBox.prototype.init = function (options) {
  this.handleIframe(options)
}
