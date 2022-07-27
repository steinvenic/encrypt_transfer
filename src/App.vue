<template>
  <el-upload
      class="upload-demo"
      drag
      action="https://transfer.sh/"
      multiple
      :http-request="uploadFile"
  >
    <el-icon class="el-icon--upload"><upload-filled/></el-icon>
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
  data(){
    return {
    }
  },
  methods:{
    foo(res){
      alert(res)
      //调用加密方法
      let encrypts = this.$aes.encrypt(res,'Aaa00123');

      //调用解密方法
      let dess = this.$aes.decrypt(encrypts,"Aaa00123");

      console.log("加密",encrypts);
      console.log("解密",dess);

    },
     encyptFile(file){
      const cc = file.getString()
      console.log(cc)
      let reader = new FileReader();
      reader.readAsBinaryString(file.raw, "UTF-8");// 如果出现乱码，可以更换编码
      if (typeof FileReader === "undefined") {
        alert("你的浏览器不支持");
        return;
      }
      reader.onload = function(e) {
        console.log(e.target.result);
      };

    },
    //上传文件的事件
    uploadFile(item){
      console.log('文件上传中........')
      //上传文件的需要formdata类型;所以要转
      let fileName;
      fileName = path.basename(item.file.path)
      const axios = require('axios');
      fs.readFile(item.file.path , {encoding: "utf-8"}, async function (err, fr) {
        //readFile回调函数
        if (err) {
          console.log(err);
        } else {
          const resp = await axios.put('https://transfer.sh/' + fileName, fr);
          console.log(resp.data)
        }
      });

      // this.$axios({
      //   method: 'put',
      //   url: fileName,
      //   headers:this.headers,
      //   timeout: 30000,
      // }).then(res=>{
      //   if(res.data.id != '' || res.data.id != null){
      //     this.fileList.push(item.file);//成功过后手动将文件添加到展示列表里
      //     let i = this.fileList.indexOf(item.file)
      //     this.fileList[i].id = res.data.id;//id也添加进去，最后整个大表单提交的时候需要的
      //     if(this.fileList.length > 0){//如果上传了附件就把校验规则给干掉
      //       this.fileflag = false;
      //       this.$set(this.rules.url,0,'')
      //     }
      //     //this.handleSuccess();
      //   }
      // })
    },
  }
}
</script>
