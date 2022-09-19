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

// Resize Text Areas
$qAll($('evalGrid'), 'textarea').forEach(textArea => {
  textArea.addEventListener('input', event => {
    var ta = event.target

    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight + 2}px`
  })
})

// CONTEXT MENUS -------------------------------------------------------
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

// EVALUATIONS --------------------------------------------------------------

// Data Object Model and Its Initialization
{
  var DOM = {}

  // Factors
  let factors = {}
  DOM.factors = factors

  factors.numFactors = 1

  let factor1 = {}
  factors.factor1 = factor1

  let parentNodeQry = '[data-factor="1"]'
  let parentNode = $q($('evalGrid'), parentNodeQry)
  factor1.parentNode = parentNode

  let descriptionNodeQry = 'textArea'
  let descriptionNode = $q($('evalGrid'), descriptionNodeQry)
  factor1.descriptionNode = descriptionNode

  let subfactorWeightNode = $('weights_f1_subfactors')
  factor1.subfactorWeightNode = subfactorWeightNode

  let weightNode = $('weight_f1')
  factor1.weightNode = weightNode
  weightNode.value = 13

  // Subfactors
  factor1.numSubFactors = 2

  for (let i = 1; i <= factor1.numSubFactors; i++) {
    factor1[`subfactor${i}`] = {}

    let sfParentNodeQry = `[data-subfactor="${i}"][data-column="subfactor"]`
    let sfParentNode = $q(document, sfParentNodeQry)
    factor1[`subfactor${i}`].sfParentNode = sfParentNode

    let descriptionNodeQry = 'textarea'
    factor1[`subfactor${i}`].descriptionNode = $q(
      sfParentNode,
      descriptionNodeQry
    )
    factor1[`subfactor${i}`].descriptionNode.value

    let sfWeightNodeQry = `[name=weight_f${i}_sf${i}]`
    factor1[`subfactor${i}`].weightNode = $q(sfParentNode, sfWeightNodeQry)
  }

  // Other factors
  DOM.reqsWeightNode = $('weight_reqs')
  DOM.secWeightNode = $('weight_sec')

  // Alternatives / Evaluations
  {
    DOM.evaluations = {}
    DOM.evaluations.numAlternatives = 1

    let alternative1 = {}
    DOM.evaluations.alternative1 = alternative1

    // Column header and description
    alternative1.columnHeaderNode = $(`column_alt1`)
    alternative1.description = $('name_alt1')

    // Subfactor evaluations
    for (let i = 1; i <= factors.numFactors; i++) {
      for (let j = 1; j <= factor1.numSubFactors; j++) {
        let evalParentNode = $(`eval_alt1_f${i}_sf${j}`)

        alternative1[`evalf${i}sf${j}`] = {}
        alternative1[`evalf${i}sf${j}`].evalParentNode = evalParentNode
        let commentNode = $q(evalParentNode, 'textArea')
        evalParentNode.commentNode = commentNode

        let scoreNode = $q(evalParentNode, 'input')
        evalParentNode.scoreNode = scoreNode
      }
    }

    // Other factor Evaluations
    let reqsParentNode = $(`req_alt1`)
    alternative1.reqsParentNode = reqsParentNode
    alternative1.reqsCommentsNode = $q(reqsParentNode, `textarea`)
    alternative1.reqsScoreNode = $q(reqsParentNode, 'input')

    alternative1.secParentNode = $('sec_alt1')

    let schedParentNode = $('sched_alt1')
    alternative1.schedParentNode = schedParentNode
    alternative1.schedMonthsNode = $q(schedParentNode, 'input')
    alternative1.schedScoreNode = $q(schedParentNode, 'span')

    let costParentNode = $('cost_alt1')
    alternative1.costParentNode = costParentNode
    alternative1.costValue = $q(costParentNode, 'input')

    let affordNode = $('afford_alt1')
    alternative1.affordNode = affordNode

    let valueNode = $('value_alt1')
    alternative1.valueNode = valueNode

    let ceNode = $('ce_alt1')
    alternative1.ceNode = ceNode
  }
}

// ALTERNATIVES --------------------------------------------------------------
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

  // TODO -- Finish adding new subfactor evals when an Alternative is added
  // -------------------------------------------
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
    {
      const element = $(`eval_alt${thisIndex}_f${f}_sf${sf}`)
      element.id = `eval_alt${0}`
    }
  }

  // reset ids to 0th columns before cloning

  $(`evalGrid`).append(newAlternative)
  console.log(`added alt header: ${newAlternative.dataset.alternative}`)
})

// SECURITY -------------------------------------------------------
// SHOW AND STORE CHOICE FOR SECURITY

var securityChoices = $qAll($('evalGrid'), '.choice')
securityChoices.forEach(element =>
  element.addEventListener('click', event => {
    securityChoices.forEach(choice => {
      choice.dataset.sel = false
      choice.classList.remove(`${choice.dataset.color}`)
    })
    element.dataset.sel = true
    element.classList.add(`${element.dataset.color}`)
    let securitySelection = element.textContent // H, M, L
  })
)

// COST

/// TEST -- Changing the grid size using custom property
// $('weight_f1').addEventListener('click', evetn => {
//   $('evalGrid').style.setProperty('--num_subfactors', 1)
// })

// TODO -- Change all Contenteditable DIVS into Textareas

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

// TODO -- Use icons for docking and modalizing the setup form

/* 
---------------------------------------------------------------------------
Notes for Potential Future Use.

1. Here is how you can strip the rich content when pasting 
   into a contenteditable element.

    $('paste').addEventListener('paste', e => {
      var pastedText = undefined
      if (window.clipboardData && window.clipboardData.getData) {
        // IE
        pastedText = window.clipboardData.getData('Text')
      } else if (e.clipboardData && e.clipboardData.getData) {
        pastedText = e.clipboardData.getData('text/plain')
      }
      e.target.textContent = pastedText
      e.preventDefault()
      return false
  })

2.
*/
