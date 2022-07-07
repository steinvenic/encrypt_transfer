<template>
  <el-upload
      class="upload-demo"
      drag
      action="https://transfer.sh/"
      multiple
      :on-success="foo"
      :before-upload="encyptFile"
  >
    <el-icon class="el-icon--upload"><upload-filled/></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
  </el-upload>
</template>

<script>
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

    }
  }
}
</script>
