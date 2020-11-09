import './main.css'
import popup from './components/popup/popup'
import video from './components/video/video'

const listItem = document.querySelectorAll('#list li')

for (let i = 0; i < listItem.length; i++) {
  listItem[i].addEventListener('click', function () {
    const { url, title } = this.dataset
    popup({
      width: '880px',
      height: '556px',
      title: title,
      content(elem) {
        video({
          url,
          elem,
          autoplay: true
        })
      }
    })
  })
}


// const list = document.querySelector('#list')

// list.addEventListener('click', function (e) {
//   console.log(e)
// }, true)