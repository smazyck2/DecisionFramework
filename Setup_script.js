// -------------------------------------------------------------------------
// INITIALIZATION

// Handles for Elements - Adding Lsiteners
const hs = {} // handles object
const nodesWithIds = $qAll(document, '[id]')

nodesWithIds.forEach(node => (hs[node.id] = node))

// Caching and Applying Values
recalculateBudget()
recalculateSchedule()

var cache = []
cacheValues()

// General Rating Changes
hs.iptGreenGeneralRating.addEventListener('input', generalInputListener)
hs.iptYellowGeneralRating.addEventListener('input', generalInputListener)
hs.iptRedGeneralRating.addEventListener('input', generalInputListener)

// Affordability/Budget Changes
hs.useBudgetCost.addEventListener('change', affordabilityListener)
hs.useBudgetPercent.addEventListener('change', affordabilityListener)

hs.iptConstraintsBudget.addEventListener('input', recalculateBudget)
hs.affordability_block.childNodes.forEach(node =>
  node.addEventListener('input', recalculateBudget)
)

// Schedule Changes
hs.useScheduleMonths.addEventListener('change', scheduleListener)
hs.useSchedulePercent.addEventListener('change', scheduleListener)

hs.iptConstraintsSchedule.addEventListener('input', recalculateSchedule)
hs.schedule_block.childNodes.forEach(node =>
  node.addEventListener('input', recalculateSchedule)
)

// Buttons
hs.btnDock.addEventListener('click', btnDockListener)
hs.btnSave.addEventListener('click', btnSaveListener)
hs.btnReset.addEventListener('click', btnResetListener)
hs.btnHide.addEventListener('click', btnHideListener)

hs.icoSetup.addEventListener('click', icoSetupListener)

// -------------------------------------------------------------------------
// LISTENERS

// General Ratings
function generalInputListener(event) {
  console.log('general change called')
  hs.iptGreenSecurityRating.innerText = hs.iptGreenGeneralRating.value
  hs.iptYellowSecurityRating.innerText = hs.iptYellowGeneralRating.value
  hs.iptRedSecurityRating.innerText = hs.iptRedGeneralRating.value
}

// Schedule
function scheduleListener(event) {
  let useMonths = hs.useScheduleMonths.checked

  hs.iptBlueScheduleRating.disabled = !useMonths
  hs.iptTealScheduleRating.disabled = !useMonths
  hs.iptGreenScheduleRating.disabled = !useMonths
  hs.iptYellowScheduleRating.disabled = !useMonths

  hs.iptBluePercent.disabled = useMonths
  hs.iptTealPercent.disabled = useMonths
  hs.iptGreenPercent.disabled = useMonths
  hs.iptYellowPercent.disabled = useMonths
}

function recalculateSchedule() {
  let schedule = +hs.iptConstraintsSchedule.value

  if (hs.useSchedulePercent.checked) {
    let calcFn = val => Math.round(schedule * (100 + +val)) / 100

    hs.iptBlueScheduleRating.value = calcFn(hs.iptBluePercent.value)
    hs.iptTealScheduleRating.value = calcFn(hs.iptTealPercent.value)
    hs.iptGreenScheduleRating.value = calcFn(hs.iptGreenPercent.value)
    hs.iptYellowScheduleRating.value = calcFn(hs.iptYellowPercent.value)
    hs.iptRedScheduleRating.value = hs.iptYellowScheduleRating.value
  } else {
    //  use months
    let calcFn = val =>
      Math.round(((val - schedule) * 100 * 100) / schedule) / 100

    hs.iptBluePercent.value = calcFn(hs.iptBlueScheduleRating.value)
    hs.iptTealPercent.value = calcFn(hs.iptTealScheduleRating.value)
    hs.iptGreenPercent.value = calcFn(hs.iptGreenScheduleRating.value)
    hs.iptYellowPercent.value = calcFn(hs.iptYellowScheduleRating.value)
    hs.iptRedPercent.value = iptYellowPercent.value
  }
}

// Budget
function affordabilityListener(event) {
  let useCosts = hs.useBudgetCost.checked

  hs.iptGreenAffordRating.disabled = !useCosts
  hs.iptYellowAffordRating.disabled = !useCosts

  hs.iptGreenAffordPercent.disabled = useCosts
  hs.iptYellowAffordPercent.disabled = useCosts
}

function recalculateBudget() {
  let budget = +hs.iptConstraintsBudget.value

  if (hs.useBudgetPercent.checked) {
    // use percentages
    console.log('using percentages')
    let calcFn = val => Math.round(budget * (+val + 100)) / 100

    hs.iptGreenAffordRating.value = calcFn(hs.iptGreenAffordPercent.value)
    hs.iptYellowAffordRating.value = calcFn(
      hs.iptYellowAffordPercent.value
    )
    hs.iptRedAffordRating.value = hs.iptYellowAffordRating.value
  } else {
    // use cost
    let calcFn = val =>
      Math.round(((val - budget) * 100 * 100) / budget) / 100

    hs.iptGreenAffordPercent.value = calcFn(hs.iptGreenAffordRating.value)
    hs.iptYellowAffordPercent.value = calcFn(
      hs.iptYellowAffordRating.value
    )
    hs.iptRedAffordPercent.value = hs.iptYellowAffordPercent.value
  }
}

// TODO - Shift Evaluation Grid over when docked setup window is shown
// Buttons
function btnDockListener(event) {
  hs.setupModal.classList.toggle('docked')
  hs.setupModal.classList.toggle('modal')

  let lArr = 0x2770,
    rArr = 0x2771

  hs.btnDock.innerText == String.fromCharCode(lArr, lArr)
    ? (hs.btnDock.innerText = String.fromCharCode(rArr, rArr))
    : (hs.btnDock.innerText = String.fromCharCode(lArr, lArr))
}

function btnSaveListener(event) {
  if (isInputsOk()) cacheValues()
}

function btnResetListener(event) {
  restoreValues()
  // hs.setupModal.classList.add('invisible')
}

function btnHideListener(event) {
  if (isInputsOk()) hide()
}

function icoSetupListener(event) {
  if (hs.setupModal.classList.contains('invisible')) {
    show()
  } else {
    hide()
  }
}

// -------------------------------------------------------------------------
// INPUT AND DATA VALIDATION

// Input Validation
function isInputsOk() {
  return true
}

// Allow only numbers or decimals
$qAll(document, 'input[type=number]').forEach(input => {
  // input.addEventListener('mouseenter', removeCommas)
  // input.addEventListener('blur', showCommas)
  input.addEventListener('beforeinput', storeOldValue)
  input.addEventListener('input', cleanInput)
  console.log('running the numbers')
})

var oldValue
function storeOldValue(event) {
  oldValue = event.target.value
  console.log('old value: ' + oldValue)
}

function cleanInput(event) {
  var inputValue = event.target.value
  console.log(inputValue)

  var newValue

  if (oldValue != '' && inputValue == '') {
    newValue = ''
    event.target.value = newValue
  } else if (!isNaN(oldValue) && inputValue == '') {
    newValue = oldValue
    event.target.value = newValue
  } else {
    // newValue = inputValue
  }

  console.log(`new value is: ${newValue}`)

  console.log(event.target.value)
}

// Caching and Restoring Values
function cacheValues() {
  var inputs = $qAll(hs.setupModal, 'input:not([type=radio])')

  for (let i = 0; i < inputs.length; i++) {
    cache.push({ id: inputs[i].id, value: inputs[i].value })
  }

  console.warn('ran cacheValues loop')
}

function restoreValues() {
  cache.forEach(item => ($(item.id).value = +item.value))
}

// -------------------------------------------------------------------------
// UI FUNCTIONS

// Hide and show the setup interface
function hide() {
  console.log('closing')
  hs.setupModal.classList.add('invisible')
}

function show() {
  hs.setupModal.classList.remove('invisible')
  console.log('showing modal')
}

// Disable number scrolling when number inputs have the focus
document.addEventListener('wheel', event => {
  if (document.activeElement.type === 'number') {
    document.activeElement.blur()
  }
})

// -------------------------------------------------------------------------
// HELPERS

function $(id) {
  return document.getElementById(id)
}

function $tags(elem, tag) {
  return elem.getElementsByTagName(tag)
}

function $qAll(elem, query) {
  return elem.querySelectorAll(query)
}
