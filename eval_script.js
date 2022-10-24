'use strict'

// RESIZE ITEMS -------------------------------------------------------
// Resize Columns
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

function resizeColumn(columnHeader) {
  resizeObserver.observe(columnHeader)
}

var allHeaders = $qAll($('evalGrid'), '.column-header')
allHeaders.forEach(resizeColumn)

// Resize Text Areas
function resizeTextAreaOnInput(textArea) {
  textArea.addEventListener('input', event => {
    var ta = event.target

    ta.style.height = '1.2em'
    ta.style.height = `${ta.scrollHeight}px`
  })
}

$qAll($('evalGrid'), 'textarea').forEach(resizeTextAreaOnInput)

// CONTEXT MENUS -------------------------------------------------------
// Factors and Sub-Factors
var context_menu_factors = $('context_menu_factors')

function showFactorContextMenu(factor) {
  factor.addEventListener('mouseenter', event => {
    event.target.appendChild(context_menu_factors)
  })
}

$qAll(document, '.subfactor, .factor').forEach(showFactorContextMenu)

var context_menu_alternatives = $('context_menu_alternatives')
$qAll(document, '.alternative.column-header').forEach(header => {
  console.log('looping alterntives')

  header.addEventListener('mouseenter', event => {
    var thisHeader = event.target
    var thisAlternative = thisHeader.dataset.alternative

    var left = thisHeader.offsetLeft + evalGrid.offsetLeft + 'px'
    var top = thisHeader.offsetTop + evalGrid.offsetTop + 'px'

    context_menu_alternatives.style.left = left
    context_menu_alternatives.style.top = top

    context_menu_alternatives.style.opacity = '100%'
    console.log(left, top)
    context_menu_alternatives.dataset.alternative = thisAlternative
    // thisHeader.appendChild(context_menu_alternatives)
    // console.log('mouse over alternative: ' + thisAlternative)
  })
})

// DATA OBJECT MODEL ----------------------------------------------------
// Data Object Model and Its Initialization
{
  var DOM = {}

  // Factors ------------------------------------------------------------
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

  let weightNode = $('weight_f1')
  factor1.weightNode = weightNode
  weightNode.value = 13

  // Subfactors --------------------------------------------------------
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

    let sfWeightNodeQry = `[name=weight_f${i}_sf${i}]`
    factor1[`subfactor${i}`].weightNode = $q(sfParentNode, sfWeightNodeQry)
  }

  // Other factors
  DOM.reqsWeightNode = $('weight_reqs')
  DOM.secWeightNode = $('weight_sec')

  // Alternatives / Evaluations ----------------------------------------
  {
    DOM.evaluations = {}
    DOM.evaluations.numAlternatives = 1

    let alternative1 = {}
    DOM.evaluations.alternative1 = alternative1

    // Column header and description
    alternative1.columnHeaderNode = $(`column_alt1`)
    alternative1.name = $('name_alt1')

    // Subfactor evaluations
    for (let i = 1; i <= factors.numFactors; i++) {
      for (let j = 1; j <= factor1.numSubFactors; j++) {
        let evalParentNode = $(`eval_alt1_f${i}_sf${j}`)

        configSfactorEval(alternative1, i, j, evalParentNode)
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

function configSfactorEval(alternative, i, j, evalParentNode) {
  alternative[`evalf${i}sf${j}`] = {}
  alternative[`evalf${i}sf${j}`].evalParentNode = evalParentNode
  let commentNode = $q(evalParentNode, 'textArea')
  evalParentNode.commentNode = commentNode

  let scoreNode = $q(evalParentNode, 'input')
  evalParentNode.scoreNode = scoreNode
}

// EVALUATIONS --------------------------------------------------------------

// ALTERNATIVES --------------------------------------------------------------

$('context_menu_alt_new').addEventListener('click', addNewAlternative)

// SECURITY ----------------------------------------------------------
// SHOW AND STORE CHOICE FOR SECURITY

var securityChoices = $qAll($('evalGrid'), '.choice')
configureSecurityChoices(securityChoices)

function configureSecurityChoices(securityChoices) {
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
}

// COST

/// TEST -- Changing the grid size using custom property
// $('weight_f1').addEventListener('click', event => {
//   $('evalGrid').style.setProperty('--num_subfactors', 1)
// })

// -------------------------------------------------------------------
// UI

// TODO -- Add/Remove alternatives

function addNewAlternative(event) {
  let thisIndex = +event.target.parentElement.dataset.alternative
  let newIndex = thisIndex + 1

  let numAlternatives = ++DOM.evaluations.numAlternatives

  console.log(`thisIndex: ${thisIndex}`)
  console.log(`old numAlternatives: ${numAlternatives}`)
  console.log(`thisIndex: ${thisIndex}`)

  // Increment the values for alternatives that come after the new one
  for (let i = numAlternatives - 1; i > thisIndex; i--) {
    console.log(`populating: ${i} with ${i - 1}`)

    DOM.evaluations[`alternative${i}`] = {
      ...DOM.evaluations[`alternative${i - 1}`],
    }

    setAlternativeColumnValues(DOM.evaluations[`alternative${i}`], i + 1)

    console.log(`moved DOM alternative ${i - 1} to ${i}`)
  }

  function setAlternativeColumnValues(DOMAlternative, newValue) {
    console.log(`object being changed`, DOMAlternative)

    let columnHeaderNode = DOMAlternative.columnHeaderNode
    columnHeaderNode.id = `column_alt${newValue}`
    columnHeaderNode.dataset.alternative = newValue
    columnHeaderNode.dataset.column = `alternative${newValue}`

    let name = DOMAlternative.name
    name.id = `name_alt${newValue}`
    name.placeholder = `Alternative ${newValue}`
    name.dataset.alternative = newValue
  }

  function getNumberOfFactors() {
    return $qAll(document, '[data-column=factor][data-factor]').length
  }

  function getNumberOfSubFactors() {
    return $qAll(document, '[data-column=subfactor][data-subfactor]')
      .length
  }

  // -------------------------------------------------------------------------
  // Create a new header and its name

  // can't clone column headers because of context menu
  let newAlternative = $(`column_alt${thisIndex}`).cloneNode(false)
  newAlternative.id = `column_alt${newIndex}`
  newAlternative.dataset.alternative = newIndex
  newAlternative.dataset.column = `alternative${newIndex}`
  resizeObserver.observe(newAlternative)

  let oldNameAlt = $(`name_alt${thisIndex}`)
  oldNameAlt.id = '0'

  let newNameAlt = oldNameAlt.cloneNode(false)
  newNameAlt.id = `name_alt${newIndex}`
  newNameAlt.placeholder = `Alternative ${newIndex}`
  newNameAlt.dataset.alternative = newIndex
  oldNameAlt.id = `name_alt${thisIndex}`

  newAlternative.append(newNameAlt)

  // Add the alternative column header to the eval grid & DOM
  DOM.evaluations[`alternative${newIndex}`] = {
    columnHeaderNode: newAlternative,
    name: newNameAlt,
  }

  let newDOMalternative = DOM.evaluations[`alternative${newIndex}`]

  $(`evalGrid`).append(newAlternative)
  console.log(`added alt header: ${newAlternative.dataset.alternative}`)

  // -------------------------------------------
  // Create new factor and subfactor evaluations
  let numFactors = getNumberOfFactors()

  // clone multiple subfactor evals, then append them to eval grid & DOM
  let oldSfEval = $(`eval_alt1_f1_sf1`)

  for (let f = 1; f <= numFactors; f++) {
    console.log('entering factor loop ' + f)

    let numSfsInFactor = DOM.factors[`factor${f}`].numSubFactors
    console.log(`numSfsInFactor: ${numSfsInFactor}`)

    for (let sf = 1; sf <= numSfsInFactor; sf++) {
      console.log('entering sf loop ' + sf)

      let newSfEval = oldSfEval.cloneNode(true)
      newSfEval.id = `eval_alt${newIndex}_${f}_${sf}`

      // append to grid & DOM
      $('evalGrid').append(newSfEval)

      newDOMalternative[`evalf${f}sf${sf}`] = {
        evalParentNode: newSfEval,
        commentNode: $q(newSfEval, 'textarea'),
        scoreNode: $q(newSfEval, 'input'),
      }
    }
  }

  // clone requirements eval, then append to eval grid & DOM
  let oldReqEval = $('req_alt1')
  let newReqEval = oldReqEval.cloneNode(true)

  newReqEval.id = `req_alt${newIndex}`
  $('evalGrid').append(newReqEval)

  newDOMalternative.reqsParentNode = newReqEval
  newDOMalternative.reqsCommentsNode = $q(newReqEval, 'textarea')
  newDOMalternative.reqsScoreNode = $q(newReqEval, 'input')

  // clone security eval, then append to eval grid & DOM
  let oldSecEval = DOM.evaluations.alternative1.secParentNode
  let newSecEval = oldSecEval.cloneNode(true)

  newSecEval.id = `sec_alt${newIndex}`
  newSecEval.dataset.alternative = newIndex

  let newSecurityChoices = $qAll(newSecEval, '.choice')
  configureSecurityChoices(newSecurityChoices)

  newDOMalternative.secParentNode = newSecEval
  $('evalGrid').append(newSecEval)

  // clone schedule eval, then append to eval grid & DOM
  let schedParentNode =
    DOM.evaluations.alternative1.schedParentNode.cloneNode(true)

  schedParentNode.id = `sched_alt${newIndex}`
  schedParentNode.dataset.alternative = newIndex

  let schedMonthsNode = $q(schedParentNode, 'input')
  let schedScoreNode = $q(schedParentNode, 'span')

  $('evalGrid').append(schedParentNode)

  newDOMalternative.schedParentNode = schedParentNode
  newDOMalternative.schedMonthsNode = schedMonthsNode
  newDOMalternative.schedScoreNode = schedScoreNode

  // clone cost eval, then append to eval grid & DOM
  let costParentNode =
    DOM.evaluations.alternative1.costParentNode.cloneNode(true)

  costParentNode.id = `cost_alt${newIndex}`
  costParentNode.dataset.alternative = newIndex

  let costValue = $q(costParentNode, 'input')

  $('evalGrid').append(costParentNode)

  newDOMalternative.costParentNode = costParentNode
  newDOMalternative.costValue = costValue

  // clone afford eval, then append to eval grid & DOM
  let affordNode = DOM.evaluations.alternative1.affordNode.cloneNode(true)
  affordNode.id = `afford_alt${newIndex}`
  affordNode.dataset.alternative = newIndex

  $('evalGrid').append(affordNode)

  newDOMalternative.affordNode = affordNode

  // clone CE eval, then append to eval grid & DOM
  let valueNode = DOM.evaluations.alternative1.valueNode.cloneNode(true)
  valueNode.id = `value_alt${newIndex}`
  valueNode.dataset.alternative = newIndex

  $('evalGrid').append(valueNode)

  newDOMalternative.valueNode = valueNode

  // clone CE eval, then append to eval grid & DOM
  let ceNode = DOM.evaluations.alternative1.ceNode.cloneNode(true)
  ceNode.id = `ce_alt${newIndex}`
  ceNode.dataset.alternative = newIndex

  $('evalGrid').append(ceNode)

  newDOMalternative.ceNode = ceNode

  newDOMalternative.valueNode.innerHTML = 34.099
  newDOMalternative.ceNode.innerHTML = 66.099

  // ---- Print the DOM
  console.log('DOM.evaluations')
  console.log(DOM)
}

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
