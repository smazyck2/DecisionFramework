'use strict'

const resizeObserver = new ResizeObserver(entries => {
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
