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
      choice.classList.remove(`${choice.dataset.color}`)
    })
    element.classList.add(`${element.dataset.color}`)
    securitySelection = element.textContent // H, M, L
    console.log('selected: ' + securitySelection)
  })
)

// COST

/// TEST -- Changing the grid size using custom property
// $('weight_f1').addEventListener('click', evetn => {
//   $('evalGrid').style.setProperty('--num_subfactors', 1)
// })

// CONTEXT MENUS
// Factors and Sub-Factors
var context_menu_factors = $('context_menu_factors')
$qAll(document, '.subfactor, .factor').forEach(factor => {
  factor.addEventListener('mouseenter', event => {
    event.target.appendChild(context_menu_factors)
  })
})

var context_menu_alternatives = $('context_menu_alternatives')
$qAll(document, '.alternative.column-header').forEach(header => {
  console.log('looping alterntives')

  header.addEventListener('mouseenter', event => {
    var thisHeader = event.target
    var thisAlternative = thisHeader.dataset.alternative
    thisHeader.appendChild(context_menu_alternatives)
    context_menu_alternatives.dataset.alternative = thisAlternative
    console.log('mouse over alternative: ' + thisAlternative)
  })
})

// ALTERNATIVES
// TODO -- Add/Remove alternatives
$('context_menu_alt_new').addEventListener('click', event => {
  var thisIndex = +event.target.parentElement.dataset.alternative
  var newIndex = thisIndex + 1

  // -------------------------------------------------------------------------
  // Create a new header and its name
  var newAlternative = $(`column_alt${thisIndex}`).cloneNode(false)
  newAlternative.id = `column_alt${newIndex}`
  newAlternative.dataset.alternative = newIndex

  var newNameAlt = $(`name_alt${thisIndex}`).cloneNode(false)
  newNameAlt.id = `name_alt${newIndex}`

  newAlternative.append(newNameAlt)

  // TODO -- Finish adding new subactors when a new Alternative is created
  // -------------------------------------------------------------------------
  // Create new factor and subfactor evaluations
  var numFactors = $qAll(
    document,
    '[data-column=factor][data-factor]'
  ).length
  console.log(`there are ${numFactors} factors`)

  var numSubFactors = $qAll(
    document,
    '[data-column=subfactor][data-subfactor]'
  ).length
  console.log(`there are ${numSubFactors} subfactors`)

  for (let f = 1; f < numFactors; f++) {
    const element = $(`eval_alt${thisIndex}_f${f}_sf${sf}`)
    element.id = `eval_alt${0}`
  }

  // reset ids to 0th columns before cloning

  $(`evalGrid`).append(newAlternative)
  console.log(`added alt header: ${newAlternative.dataset.alternative}`)
})

// TODO -- Add/Remove factors
// ADD FACTORS
// -- Create and Add a Factor

// -- Create and Add a Sub-factor for the new Factor

// -- Create and Add Evaluation Rows for each Alternative

// TODO -- Add/Remove subfactors

// TODO -- Change order of factors
// TODO -- Change order of subfactors
// TODO -- Change order of alternatives

// TODO -- Auto-calculate weight subtotals - error >100%, <0%
// TODO -- Auto-calculate weight totals - error >100%, <0%

// TODO -- Apply colors after scoring
