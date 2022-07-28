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
// window.require('electron')
const fs = window.require('fs')
const path = window.require('path')

export default {
  data() {
    return {}
  },
  methods: {
    //上传文件的事件
    uploadFile(item) {
      console.log('文件上传中........')
      //上传文件的需要formdata类型;所以要转
      let fileName;
      fileName = path.basename(item.file.path)
      const axios = require('axios');
      fs.readFile(item.file.path, {encoding: "utf-8"}, async function (err, fr) {
        //readFile回调函数
        if (err) {
          console.log(err);
        } else {
          const resp = await axios.put('https://transfer.sh/' + fileName, fr);
          console.log(resp.data)
        }
      });
    },
  }
}
</script>
