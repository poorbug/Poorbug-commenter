import AV from 'leancloud-storage';
import util from './util.js';

export default class PoorbugCommenter {

  /**
   * options: {
   *   id: 'yYInORSnBNBQQFefrizUTyT3-gzGzoHsz'
   *   key: 'B8TjOpTwOGBgAItLVx0nBIs3',
   *   item: ''
   * }
   */
  constructor (options) {
    const { id, key, item } = options
    if (!id || !key) {
      throw new Error('参数错误')
    }
    this.container = document.getElementById('poorbug-commenter')
    if (!this.container) {
      throw new Error('未获取到相应的 container')
    }
    this.item = item

    this.AV = AV
    this.AV.init({
      appId: id,
      appKey: key
    });

    this.msgs = null

    const title = document.createElement('h2')
    title.innerText = '留言板'
    this.container.appendChild(title)

    this.msgs = document.createElement('div')
    this.msgs.id = util.addPrefix('msgs')
    this.container.appendChild(this.msgs)

    // add delegate
    this.msgs.addEventListener('click', (e) => {
      if(e.target.attributes['data-type'] && e.target.attributes['data-type'].value === 'cite') {
        this.setMyCite(e.target.attributes['data-index'].value)
      }
    })

    this.mymsg = document.createElement('div')
    this.mymsg.id = util.addPrefix('mymsg')
    this.mymsg.innerHTML = '' +
      '<p><input id="'+ util.addPrefix('mymsg-name') +'" type="text" placeholder="你的名字" /> 说:</p>' +
      '<textarea id="'+ util.addPrefix('mymsg-msg') +'" placeholder="写下你的留言..."></textarea>' +
      '<button data-type="submit">提交</button>';
    this.container.appendChild(this.mymsg)

    // add delegate
    this.mymsg.addEventListener('click', (e) => {
      if(e.target.attributes['data-type'] && e.target.attributes['data-type'].value === 'clear') {
        this.clearMyCite()
      }
    })

    // add delegate
    this.mymsg.addEventListener('click', (e) => {
      if(e.target.attributes['data-type'] && e.target.attributes['data-type'].value === 'submit') {
        this.handleSubmit()
      }
    })

    this.getMsgs()
    const styleBox = document.createElement('style')
    styleBox.innerHTML = styleStr
    document.head.appendChild(styleBox)
  }

  handleSubmit () {
    const nameEle = document.getElementById(util.addPrefix('mymsg-name'))
    const name = nameEle.value
    if (!name) {
      alert('请输入名字')
      return
    }
    const msgEle = document.getElementById(util.addPrefix('mymsg-msg'))
    const msg = msgEle.value
    if (!msg) {
      alert('请输入留言')
      return
    }

    const NewMsg = this.AV.Object.extend(`${this.item}_msg`)
    const newMsg = new NewMsg()
    newMsg.set('name', name)
    newMsg.set('msg', msg)
    newMsg.set('cite', this.mycite)

    newMsg.save().then((res) => {
      this.msgs.push(res)
      document.getElementById(util.addPrefix('msgs')).innerHTML += this.renderMsg(this.msgs.length - 1, res)
    }, (err) => {
      console.log(err)
    })

    nameEle.value = ''
    msgEle.value = ''
    this.clearMyCite()
    this.getMsgs()
  }

  getMsgs () {
    const msgBox = document.getElementById(util.addPrefix('msgs'))
    const query = new this.AV.Query(`${this.item}_msg`)
    query.find().then((msgs) => {
      this.msgs = msgs
      if (!msgs || msgs.length === 0) {
        msgBox.innerHTML = '<p style="text-align: center; color: #333">色即是空</p>'
      } else {
        var html = ''
        for(var i in msgs) {
          html += this.renderMsg(i, msgs[i])
        }
        msgBox.innerHTML = html
      }
    }, (err) => {
      console.log(err)
    })
  }

  getCites (cite) {
    if (!cite || !this.msgs) return []
    const newCite = this.msgs[cite].cite
    const cites = this.getCites(newCite, this.msgs)
    cites.push(this.msgs[cite])
    return cites
  }

  renderCites (cites) {
    if (!cites) return ''
    var html = ''
    if (cites.length > 0) html += '<h5 style="color: #333;">对于: </h5>'
    for(var i in cites) {
      html += '<blockquote class="'+util.addPrefix('cite')+'">' +
                '<h6>' + cites[i].attributes.name + '<span>说</span></h6>' +
                '<p>' + cites[i].attributes.msg + '</p>' +
              '</blockquote>'
    }
    return html
  }

  renderMsg (i, msg) {
    if (!msg) return ''
    var html = '<div class="'+util.addPrefix('msg-item')+'" >'
    html += this.renderCites(this.getCites(msg.attributes.cite))
    html += '<h5>' + msg.attributes.name + ' <span>说</span></h5>' +
            '<p>' + msg.attributes.msg + '</p>' +
            '<p><time>' + util.formatTime(msg.createdAt) + '</time><a data-index="' + i + '" data-type="cite">引用</a></p>'
    html += '</div>'
    return html
  }

  setMyCite(i) {
    this.clearMyCite()
    this.mycite = i
    var html = ''
    html += '<div>' +
              '<h5>引用: </h5>' +
              '<blockquote>' +
                '<h6>' + this.msgs[i].attributes.name + ' 说: </h6>' +
                '<p>' + this.msgs[i].attributes.msg + '</p>' +
                '<span data-type="clear">+</span>' +
              '</blockquote>' +
            '</div>'
    var mymsg = document.getElementById(util.addPrefix('mymsg'))
    mymsg.innerHTML = html + mymsg.innerHTML
  }

  clearMyCite() {
    if (this.mycite) {
      this.mycite = null
      var mymsg = document.getElementById(util.addPrefix('mymsg'))
      mymsg.removeChild(mymsg.firstChild)
    }
  }

}

const styleStr = "#poorbug-commenter{margin-top:128px}#poorbug-commenter>h5{font-size:18px;margin:48px 0 12px 0}#poorbug-commenter p{line-height:1.7;margin:0 0 24px 0}#poorbug-commenter h2{margin:0 0 24px 0;padding:0 0 16px 8px;border-bottom:1px solid #999;font-size:28px}.poorbug-commenter-msg-item{border-bottom:1px dashed #999;padding:32px 10px;background-color:rgba(255,255,255,.2)}.poorbug-commenter-msg-item:last-child{border:none}.poorbug-commenter-msg-item h5{font-size:16px;margin:0 0 16px 0;color:#3194d0}.poorbug-commenter-msg-item h5 span{font-weight:400;color:#333;margin-left:6px}.poorbug-commenter-msg-item h5+p{color:#333;font-size:14px;margin:0 0 16px 0}.poorbug-commenter-msg-item p+p{font-size:12px;color:#969696;float:right}.poorbug-commenter-msg-item p+p a{padding:0 8px;margin-left:8px;cursor:pointer}.poorbug-commenter-cite h6{margin:0;font-size:16px}.poorbug-commenter-cite h6 span{margin-left:6px;font-weight:400}.poorbug-commenter-cite p{font-size:12px}#poorbug-commenter-mymsg{margin:0;padding:40px 0 0 0;border-top:1px solid #999}#poorbug-commenter-mymsg blockquote{position:relative}#poorbug-commenter-mymsg blockquote span{position:absolute;top:0;right:8px;font-size:32px;color:#ccc;text-align:center;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg);cursor:pointer;display:block;width:32px;height:32px;-webkit-transition:color .4s ease-in-out;-moz-transition:color .4s ease-in-out;-ms-transition:color .4s ease-in-out;transition:color .4s ease-in-out}#poorbug-commenter-mymsg blockquote span:hover{color:#000}#poorbug-commenter-mymsg blockquote span h6{margin:0;font-size:16px}#poorbug-commenter-mymsg blockquote span p{font-size:12px}#poorbug-commenter-mymsg p{line-height:32px;margin-bottom:16px}#poorbug-commenter-mymsg p input{width:160px;height:32px;padding:0 12px;border:1px solid #dcdcdc;border-radius:4px;background-color:#fff;outline-style:none;color:#333;font-size:14px}#poorbug-commenter-mymsg button,#poorbug-commenter-mymsg textarea{display:block}#poorbug-commenter-mymsg textarea{max-width:100%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;resize:none;width:572px;height:80px;border:1px solid #dcdcdc;border-radius:4px;outline-style:none;background-color:#fff;padding:12px 16px;color:#333;font-size:14px}#poorbug-commenter-mymsg button{min-width:144px;padding:0 20px;outline:0;cursor:pointer;font-size:16px;color:#fff;border-radius:4px;border:none;background-color:#3194d0;height:auto;line-height:38px;margin-top:16px}h2,h5,h6,p{margin-top:0}blockquote{padding:20px;margin:0 0 24px;background-color:#f7f7f7;border-left:6px solid #b4b4b4;font-size:16px;line-height:30px}";
