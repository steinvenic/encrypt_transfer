<template>
      <el-upload
          class="upload-demo"
          drag
          action="https://transfer.sh/"
          multiple
          :http-request="uploadFile"
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">
          拖拽上传或 <em>点击上传</em>
        </div>
      </el-upload>
  <br/><br/><br/>
  <div><el-button type="success" round @click="downLoad" >下载剪切板中的文件</el-button></div>


</template>

<script>
const fs = window.require('fs')
const path = window.require('path')
const FileCrypt = window.require("file-aes-crypt");
const axios = require('axios');
const request = window.require('request');
const {clipboard} = window.require('electron')
const {shell} = window.require("electron").remote;

export default {
  data() {
    return {}
  },
  methods: {
    //上传文件的事件
    async uploadFile(item) {
      this.$notify({message: "文件加密中...", duration: 0},);
      const secret = this.uuid()
      const fc = new FileCrypt(secret);
      console.log('enc sec:' + secret)

      let filePath = item.file.path;
      let fileName = path.basename(filePath)
      let encFileName = fileName + ".enc"
      await fc.encrypt(filePath, encFileName);
      this.$notify.closeAll()
      this.$notify({
        title: '文件上传中',
        message: `【${fileName}】上传中...`,
        type: 'success',
        duration: 0
      },);
      // this.$message("开始上传...");
      fs.readFile(encFileName, async (err, fr) => {
        if (err) {
          console.log(err);
        } else {
          const resp = await axios.put('https://transfer.sh/' + fileName, fr);
          console.log(resp)
          this.$notify.closeAll()
          const dLink = resp.data + "/" + secret
          clipboard.writeText(dLink)
          // this.$notify({message:`${fileName}上传完成`,duration:0},);
          this.$notify({
            title: `【${fileName}】上传完成`,
            message: '下载链接已复制到剪切板~',
            type: 'success',
            duration: 0
          },);
          // this.$notify({message:'下载链接已复制到剪切板~',duration:0},);
          this.rmFile(encFileName)
        }
      });
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23];
      var uuid = s.join("");
      return uuid;
    },
    rmFile(fileName) {
      var filepath = fileName;
      fs.unlink(filepath, function (err) {
        if (err) {
          throw err;
        }
        console.log('文件:' + filepath + '删除成功！');
      })
    },
    async downLoad() {
      let clickBroardText = clipboard.readText().toString()
      console.log(typeof clickBroardText)
      if (clickBroardText.startsWith('https://transfer.sh/')) {
        let fileUrl = clickBroardText
        console.log('下载链接初步合规')
        try {
          let fileKey = fileUrl.split("/")[3]
          let fileName = fileUrl.split("/")[4]
          let secret = fileUrl.split("/")[5]
          console.log('fileKey:' + fileKey)
          console.log('fileName:' + fileName)
          console.log('secret:' + secret)

          //创建下载目录
          let DOWNLOAD_DIR = 'transfer_download'
          fs.mkdir(DOWNLOAD_DIR, {recursive: true}, (err) => {
            if (err) {
              throw err;
            } else {
              console.log('ok!');
            }
          });
          // 下载
          let decodeFileName = decodeURI(fileName)
          let stream = fs.createWriteStream(path.join(DOWNLOAD_DIR, decodeFileName + '.enc'), {encoding: 'utf-8'});
          this.$notify({
            title: `下载中`,
            message: `【${decodeFileName}】下载中...`,
            type: 'warning',
            duration: 0
          },);
          request({
            url: `https://transfer.sh/get/${fileKey}/${fileName}`,
            method: 'GET'
          })
              .pipe(stream)
              .on('close', (err) => {
                if (err !== undefined) {
                  this.$notify({
                    title: "文件下载失败",
                    message: err,
                    type: 'error',
                    duration: 0
                  },);
                }
                stream.close();
                this.$notify.closeAll()
                //  解密
                const fc = new FileCrypt(secret);
                fc.decrypt(path.join(DOWNLOAD_DIR, decodeFileName + '.enc'), path.join(DOWNLOAD_DIR, decodeFileName))
                this.$notify({
                  title: "文件下载成功",
                  message: '文件下载成功',
                  type: 'success',
                  duration: 5
                },);
                this.rmFile(path.join(DOWNLOAD_DIR, decodeFileName + '.enc'))
                shell.showItemInFolder(path.resolve(path.join(DOWNLOAD_DIR, decodeFileName)));
              });
        } catch (e) {
          this.$notify({
            title: "文件下载失败",
            message: `错误的下载链接【${clickBroardText}】`,
            type: 'warning',
            duration: 0
          },);
        }

      } else {
        this.$notify({
          title: "文件下载失败",
          message: `错误的下载链接【${clickBroardText}】`,
          type: 'warning',
          duration: 0
        },);
      }
    },
    // TODO 中文名下载

  }
}
</script>
<style>
div{
  text-align: center;
}

</style>

