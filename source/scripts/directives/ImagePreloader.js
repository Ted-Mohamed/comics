import Vue from 'vue'
export default Vue.directive('img', function (el, binding) {
  var img = new Image()
  img.onload = () => { setTimeout(()=>{
    el.src = binding.value.url 
    el.classList.remove(binding.value.loadingClass)
  }, 5000)}
  img.src = binding.value.url
  el.classList.add(binding.value.loadingClass)
})