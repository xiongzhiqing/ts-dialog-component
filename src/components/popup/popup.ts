// import './popup.css' // 全局CSS操作
const styles = require('./popup.css').default
// import styles from './popup.css'
console.log(styles)

interface Ipopup {
  width?: string
  height?: string
  title?: string
  pos?: string
  mask?: boolean
  content?: (content: HTMLElement) => void
}

interface Icomponent {
  tempContainer: HTMLElement
  init: () => void
  template: () => void
  handle: () => void
}

function popup(options: Ipopup) {
  return new Popup(options)
}

class Popup implements Icomponent {
  pos: string[]
  tempContainer: HTMLElement
  mask: HTMLElement
  constructor(private options: Ipopup) {
    this.pos = ['center', 'left', 'right']
    this.options = Object.assign({
      width: '100%',
      height: '100%',
      title: '',
      pos: 'center',
      mask: true,
      content: function () { }
    }, this.options)
    this.init()
  }
  // 初始化
  init() {
    this.template()
    this.options.mask && this.createMask()
    this.handle()
    this.options.content && this.contentCallback()
  }
  // 创建模板
  template() {
    const { width, height, pos } = this.options
    this.tempContainer = document.createElement('div')
    this.tempContainer.style.width = width
    this.tempContainer.style.height = height
    this.tempContainer.className = styles.popup
    this.tempContainer.innerHTML = `
      <div class="${styles['popup-title']}">
        <h3>${this.options.title}</h3>
        <i class="iconfont icon-close"></i>
      </div>
      <div class="${styles['popup-content']}"></div>
    `
    document.body.appendChild(this.tempContainer)
    this.strategy(this.pos.includes(pos) ? pos : 'center')
  }
  strategy(type) {
    const win = window
    const left = (): string => ((win.innerWidth - this.tempContainer.offsetWidth) / 2 + 'px')
    const top = (): string => ((win.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px')
    const zero = (): string => (0 + 'px')
    const strategy = {
      'center': () => {
        this.tempContainer.style.left = left()
        this.tempContainer.style.top = top()
      },
      'left': () => {
        this.tempContainer.style.left = zero()
        this.tempContainer.style.top = top()
      },
      'right': () => {
        this.tempContainer.style.left = left()
        this.tempContainer.style.top = zero()
      }
    }
    strategy[type]()
  }
  // 事件操作
  handle() {
    const popupClose = this.tempContainer.querySelector(`.${styles['popup-title']} i`)
    popupClose.addEventListener('click', () => {
      document.body.removeChild(this.tempContainer)
      this.options.mask && document.body.removeChild(this.mask)
    })
  }
  // 创建弹层
  createMask() {
    this.mask = document.createElement('div')
    this.mask.className = styles.mask
    this.mask.style.width = '100%'
    this.mask.style.height = '100%'
    document.body.appendChild(this.mask)
  }
  contentCallback() {
    const popupContent = this.tempContainer.querySelector(`.${styles['popup-content']}`)
    this.options.content(popupContent as HTMLElement)
  }
}

export default popup
