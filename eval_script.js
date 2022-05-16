'use strict'

const resizeObserver = new ResizeObserver(entries => {
  entries.forEach(entry => {
    let column = entry.target.dataset.column
    $qAll($('evalGrid'), `[data-column${column}]`).forEach(col => {
      // console.log(col)
    })
    console.log(column)
  })
})

var allHeaders = $qAll($('evalGrid'), '.column-header')
allHeaders.forEach(element => {
  resizeObserver.observe(element)
})
