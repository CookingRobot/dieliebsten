var dragSrcEl = null;

function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.getElementsByTagName('input')[0].value);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}
function handleDragEnter(e) {
  this.getElementsByTagName('input')[0].classList.add('over');
  this.getElementsByTagName('i')[0].classList.add('opaChange');

}

function handleDragLeave(e) {
  this.getElementsByTagName('input')[0].classList.remove('over'); 
    this.getElementsByTagName('i')[0].classList.remove('opaChange');

}

function handleDrop(e) {
  if(e.preventDefault) { e.preventDefault(); }
  if(e.stopPropagation) { e.stopPropagation(); }
  if (dragSrcEl != this) {
    dragSrcEl.getElementsByTagName('input')[0].value = this.getElementsByTagName('input')[0].value;
    this.getElementsByTagName('input')[0].value = e.dataTransfer.getData('text/plain');
  }
  return false;
}

function handleDragEnd(e) {
  [].forEach.call(cols, function (col) {
    col.getElementsByTagName('input')[0].classList.remove('over');
        col.getElementsByTagName('i')[0].classList.remove('opaChange');

  });
}
var cols = document.querySelectorAll('#draggers .dragger');
[].forEach.call(cols, function(col) {
col.addEventListener('dragstart', handleDragStart, false);
  col.addEventListener('dragenter', handleDragEnter, false)
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragend', handleDragEnd, false);
});