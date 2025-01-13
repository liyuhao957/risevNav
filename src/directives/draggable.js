export default {
  mounted(el) {
    el.style.cursor = 'move'
    el.draggable = true
    
    el.ondragstart = function(e) {
      e.dataTransfer.effectAllowed = 'move'
    }
    
    el.ondragover = function(e) {
      e.preventDefault()
    }
    
    el.ondrop = function(e) {
      e.preventDefault()
      const dragEvent = new CustomEvent('end', {
        detail: {
          dragIndex: e.dataTransfer.getData('text/plain'),
          dropIndex: el.dataset.index
        }
      })
      el.dispatchEvent(dragEvent)
    }
  }
} 