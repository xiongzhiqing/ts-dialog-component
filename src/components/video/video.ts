const styles = require('./video.css').default

interface Ivideo {
  url: string
  elem: string | HTMLElement
  width?: string
  height?: string
  autoplay?: boolean
}

interface Icomponent {
  tempContainer: HTMLElement
  init: () => void
  template: () => void
  handle: () => void
}

function video(options: Ivideo) {
  return new Video(options)
}

class Video implements Icomponent {
  tempContainer: HTMLElement
  constructor(private options: Ivideo) {
    this.options = Object.assign({
      width: '100%',
      height: '100%',
      autolay: false
    }, this.options)
    this.init()
  }
  init() {
    this.template()
    this.handle()
  }
  template() {
    const { width, height, elem } = this.options
    this.tempContainer = document.createElement('div')
    this.tempContainer.className = styles.video
    this.tempContainer.style.width = width
    this.tempContainer.style.height = height
    this.tempContainer.innerHTML = `
      <video class="${styles['video-content']}" src="${this.options.url}"></video>
      <div class="${styles['video-controls']}">
        <div class="${styles['video-progress']}">
          <div class="${styles['video-progress-now']}"></div>
          <div class="${styles['video-progress-suc']}"></div>
          <div class="${styles['video-progress-bar']}"></div>
        </div>
        <div class="${styles['video-play']}">
          <i class="iconfont icon-bofang"></i>
        </div>
        <div class="${styles['video-time']}">
          <span>00:00</span> / <span>00:00</span>
        </div>
        <div class="${styles['video-full']}">
          <i class="iconfont icon-quanping"></i>
        </div>
        <div class="${styles['video-volume']}">
          <i class="iconfont icon-shengyin"></i>
          <div class="${styles['video-vol-progress']}">
            <div class="${styles['video-vol-progress-now']}"></div>
            <div class="${styles['video-vol-progress-bar']}"></div>
          </div>
        </div>
      </div>
    `
    if (typeof elem === 'object') {
      elem.appendChild(this.tempContainer)
    } else {
      document.querySelector(`${elem}`).appendChild(this.tempContainer)
    }
  }
  handle() {
    const videoContent: HTMLVideoElement = this.tempContainer.querySelector(`.${styles['video-content']}`)
    const videoControls: HTMLElement = this.tempContainer.querySelector(`.${styles['video-controls']}`)
    const videoPlay: HTMLElement = this.tempContainer.querySelector(`.${styles['video-controls']} i`)
    const videoTimes: NodeListOf<HTMLElement> = this.tempContainer.querySelectorAll(`.${styles['video-time']} span`)
    const videoFull: HTMLElement = this.tempContainer.querySelector(`.${styles['video-full']} i`)
    const videoProgress: NodeListOf<HTMLElement> = this.tempContainer.querySelectorAll(`.${styles['video-progress']} div`)
    const videoVolProgress: NodeListOf<HTMLElement> = this.tempContainer.querySelectorAll(`.${styles['video-vol-progress']} div`)

    let timer

    // 设置视频默认音量50%
    videoContent.volume = 0.5

    this.tempContainer.addEventListener('mouseenter', function () {
      videoControls.style.bottom = '0'
    })
    this.tempContainer.addEventListener('mouseleave', function () {
      videoControls.style.bottom = '-60px'
    })
    // 正在播放中
    function playing() {
      const { currentTime, duration, buffered } = videoContent
      let scale = currentTime / duration
      let scaleSuc = buffered.end(0) / duration
      // 视频时长
      videoTimes[0].innerHTML = formatTime(currentTime)
      // 当前进度（当前播放时间）
      videoProgress[0].style.width = scale * 100 + '%'
      // 加载进度
      videoProgress[1].style.width = scaleSuc * 100 + '%'
      // 小球位置
      videoProgress[2].style.left = scale * 100 + '%'
    }

    // 全屏
    videoFull.addEventListener('click', () => {
      videoContent.requestFullscreen()
    })
    // 拖拽音量进度
    videoVolProgress[1].addEventListener('mousedown', function (e: MouseEvent) {
      let downX = e.pageX
      let downL = this.offsetLeft
      document.onmousemove = (ev: MouseEvent) => {
        let scale = (ev.pageX - downX + downL + 8) / this.parentElement.offsetWidth
        if (scale < 0) {
          scale = 0
        } else if (scale > 1) {
          scale = 1
        }

        videoVolProgress[0].style.width = scale * 100 + '%'
        this.style.left = scale * 100 + '%'
        // 更新音量
        videoContent.volume = scale
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
      e.preventDefault()
    })
    // 拖拽播放进度
    videoProgress[2].addEventListener('mousedown', function (e: MouseEvent) {
      let downX = e.pageX
      let downL = this.offsetLeft
      document.onmousemove = (ev: MouseEvent) => {
        let scale = (ev.pageX - downX + downL + 8) / this.parentElement.offsetWidth
        if (scale < 0) {
          scale = 0
        } else if (scale > 1) {
          scale = 1
        }

        videoProgress[0].style.width = scale * 100 + '%'
        videoProgress[1].style.width = scale * 100 + '%'
        this.style.left = scale * 100 + '%'
        // 更新播放时间
        videoContent.currentTime = scale * videoContent.duration
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
      e.preventDefault()
    })
    // 视频是否加载完毕
    videoContent.addEventListener('canplay', () => {
      this.options.autoplay && videoContent.play()
      videoTimes[1].innerHTML = formatTime(videoContent.duration)
    })
    // 视频播放事件
    videoContent.addEventListener('play', () => {
      videoPlay.className = 'iconfont icon-bofangzanting'
      timer = setInterval(playing, 1000)
    })
    // 视频暂停事件
    videoContent.addEventListener('pause', () => {
      videoPlay.className = 'iconfont icon-bofang'
      clearInterval(timer)
    })
    // 点击播放按钮
    videoPlay.addEventListener('click', () => {
      if (videoContent.paused) {
        videoContent.play()
      } else {
        videoContent.pause()
      }
    })

    function formatTime(num: number): string {
      num = Math.round(num)
      let min = Math.floor(num / 60)
      let sec = num % 60
      return zero(min) + ':' + zero(sec)
    }
    function zero(n: number): string {
      return `${n > 10 ? '' : '0'}` + n
    }
  }
}

export default video