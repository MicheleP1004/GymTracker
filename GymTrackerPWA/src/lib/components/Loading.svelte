<style>
    .center{
        display: grid;
        place-items: center;
        position: fixed;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%; 
        height: 5%;
        width: 5%;
    }
.loader {
    align-items: center;
    height: 100%;
    width: 100%;
  aspect-ratio: 1;
  --_g: no-repeat radial-gradient(farthest-side,#4fc080 94%,#0000);
  background:
    var(--_g) 0    0,
    var(--_g) 100% 0,
    var(--_g) 100% 100%,
    var(--_g) 0    100%;
  background-size: 40% 40%;
  animation: l38 .5s infinite; 
}
@keyframes l38 {
  100% {background-position: 100% 0,100% 100%,0 100%,0 0}
}
</style>
<div class="center">
    <div class="loader"></div>
</div>
