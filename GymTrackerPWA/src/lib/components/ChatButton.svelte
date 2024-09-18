<script lang="ts">
    export let propic: string;
    export let chatName: string;
</script>
  
  <style>
    .box {
      display: flex;
      align-items: center; 
      background-color: #e3f1e9;
      height: 11%;
      width: 100%;
      padding: 2%;
      box-sizing: border-box;
      transition: background-color 0.1s;
      cursor: pointer;
    }
    .box:hover{
        background-color: #d8ebe0;
    }
    .pro-pic {
      height: 100%;
      width: 11%;
      border-radius: 50%;
      object-fit: cover;
    }
    .text {
      margin-left: 2%; 
      font-style: normal;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 500;
    }
  </style>
  
  <div class="box">
    <img class="pro-pic" src={propic} alt="Default">
    <h3 class="text">{chatName}</h3>
  </div>
  