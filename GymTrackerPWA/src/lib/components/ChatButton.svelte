<script lang="ts">
    //aggiungere codice per scaricare pro pic 
    let propic:string = '/DefaultPics/ProfilePicture.jpg';
    let user:string = 'Utente';
</script>
  
  <style>
    .box {
      display: flex;
      align-items: center; 
      background-color: #e3f1e9;
      border-radius: 12px;
      height: 60px;
      width: 99%;
      padding: 5px;
    }
    .pro-pic {
      
      height: 100%;
      width: 12%;
      border-radius: 50%;
      object-fit: cover;
    }
    .text {
      margin-left: 10px; 
      font-style: normal;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 500;
    }
  </style>
  
  <div class="box">
    
    <img class="pro-pic" src={propic} alt="">
    <h3 class="text">{user}</h3>
  </div>
  