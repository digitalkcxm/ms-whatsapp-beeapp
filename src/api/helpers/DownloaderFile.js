import download from "download-file";

export default class DownloaderFile {
  static newInstance() {
    return new DownloaderFile();
  }
  async downloadFile(url, filename) {
    let directory = "/tmp/file";
    return new Promise((resolve, reject) => {
      download(url, { directory, filename }, (err) => {
        if (err) reject(err);
        setTimeout(async () => resolve(`${directory}/${filename}`), 3000);
      });
    });
  }
}
