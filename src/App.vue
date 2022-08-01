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
      Drop file here or <em>click to upload</em>
    </div>




  </el-upload>
</template>

<script>
const fs = window.require('fs')
const path = window.require('path')
const FileCrypt = window.require("file-aes-crypt");
const axios = require('axios');

export default {
  data() {
    return {}
  },
  methods: {
    //上传文件的事件
    async uploadFile(item) {
      this.$notify({message:"文件加密中...",duration:0},);
      const secret = this.uuid()
      const fc = new FileCrypt(secret);

      let filePath = item.file.path;
      let fileName = path.basename(filePath)
      let encFileName = fileName + ".enc"
      await fc.encrypt(filePath, encFileName);
      this.$notify.closeAll()

      this.$notify({message:"文件上传中...",duration:0},);
      // this.$message("开始上传...");
      fs.readFile(encFileName, {encoding: "utf-8"}, async (err, fr) =>{
        if (err) {
          console.log(err);
        } else {
          const resp = await axios.put('https://transfer.sh/' + fileName, fr);
          console.log(resp)
          this.$notify.closeAll()
          const dLink = resp.data+"/"+secret
          const { clipboard } = window.require('electron')
          clipboard.writeText(dLink)
          // this.$notify({message:`${fileName}上传完成`,duration:0},);
          this.$notify({
            title: `${fileName}上传完成`,
            message: '下载链接已复制到剪切板~',
            type: 'success',
            duration:0
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
    rmFile(fileName){
      var filepath = fileName;
      fs.unlink(filepath, function(err){
        if(err){
          throw err;
        }
        console.log('文件:'+filepath+'删除成功！');
      })
    }
  }
}
</script>
