import download from 'download-file'
import fs from 'fs'

export default class DownloaderFile {
  static newInstance() {
    return new DownloaderFile()
  }
  async downloadFile(url, filename) {
    let directory = '/tmp/file'
    return new Promise((resolve, reject) => {
      download(url, { directory, filename }, (err) => {
        if (err) reject(err)
        setTimeout(async () => resolve(`${directory}/${filename}`), 3000)
      })
    })
  }

  async downloadBase64(content, filename) {
    let directory = '/tmp/file'
    return new Promise((resolve, reject) => {
      fs.writeFile(`${directory}/${filename}`, content, { encoding: 'base64' }, (err) => {
        if (err) reject(err)
        setTimeout(async () => resolve(`${directory}/${filename}`), 3000)
      })
    })
  }
}
