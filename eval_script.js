'use strict'

// RESIZE ITEMS -------------------------------------------------------
const resizeObserver = new ResizeObserver(entries => {
  entries.forEach(entry => {
    // console.log(entry)

    let column = entry.target.dataset.column
    // console.log(column + ' resizing')

    let columnWidth = entry.contentRect.width
    // console.log(columnWidth)

    $qAll($('evalGrid'), `[data-column=${column}]`).forEach(col => {
      col.style.width = +columnWidth + 'px'
    })
    // console.log(column)
  })
})

var allHeaders = $qAll($('evalGrid'), '.column-header')
allHeaders.forEach(element => {
  resizeObserver.observe(element)
})

// SHOW AND STORE CHOICE FOR SECURITY
var securitySelection = 'nothing selected'
var securityChoices = $qAll($('evalGrid'), '.choice')
securityChoices.forEach(element =>
  element.addEventListener('click', event => {
    securityChoices.forEach(choice => {
      choice.style.background = 'none'
    })
    element.style.backgroundColor = element.dataset.color
    securitySelection = element.textContent // H, M, L
    console.log('selected: ' + securitySelection)
  })
)

// COST
var cost = 0
$('cost_alt1').addEventListener('input', event => {
  var value = event.target.value
  console.log(value)

  var isNumber = !isNaN(value.replaceAll(',', ''))
  console.log('isNumber: ' + isNumber)
})

/// TEST -- Changing the grid size using custom property
// $('weight_f1').addEventListener('click', evetn => {
//   $('evalGrid').style.setProperty('--num_subfactors', 1)
// })

// TODO -- Add/Remove factors
// ADD FACTORS
// -- Create and Add a Factor

// -- Create and Add a Sub-factor for the new Factor

// -- Create and Add Evaluation Rows for each Alternative

// TODO -- Add/Remove subfactors
// TODO -- Add/Remove alternatives

// TODO -- Change order of factors
// TODO -- Change order of subfactors
// TODO -- Change order of alternatives

// TODO -- Auto-calculate weight subtotals - error >100%, <0%
// TODO -- Auto-calculate weight totals - error >100%, <0%

// TODO -- Apply colors after scoring
