'use strict'

var resizeSample = 10

const resizeObserver = new ResizeObserver(entries => {
  if (resizeSample - 1 == 0) {
    resizeSample = 10
    console.log(resizeSample)
    return
  }

  entries.forEach(entry => {
    // console.log(entry)

    let column = entry.target.dataset.column
    console.log(column + ' resizing')

    let columnWidth = entry.contentRect.width
    // console.log(columnWidth)

    $qAll($('evalGrid'), `[data-column=${column}]`).forEach(col => {
      col.style.width = columnWidth + 'px'
    })
    console.log(column)
  })
})

var allHeaders = $qAll($('evalGrid'), '.column-header')
allHeaders.forEach(element => {
  resizeObserver.observe(element)
})
