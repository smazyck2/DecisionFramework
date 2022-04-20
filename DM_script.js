// alert('js')

// Handles for Elements - Adding Lsiteners
const hs = {} // handles object
const nodesWithIds = $qAll(document, '[id]')

nodesWithIds.forEach(node => (hs[node.id] = node))
console.log(hs.setup)

hs.btnApply.addEventListener('click', btnApplyListener)
hs.btnCancel.addEventListener('click', btnCancelListener)

// Budget / Affordability
hs.useBudgetCost.addEventListener('change', affordabilityListener)
hs.useBudgetPercent.addEventListener('change', affordabilityListener)

hs.iptConstraintsBudget.addEventListener('input', recalculateBudget)
hs.iptGreenAffordRating.addEventListener('input', recalculateBudget)
hs.iptYellowAffordRating.addEventListener('input', recalculateBudget)
hs.iptGreenAffordPercent.addEventListener('input', recalculateBudget)
hs.iptYellowAffordPercent.addEventListener('input', recalculateBudget)

// Schedule
hs.useScheduleMonths.addEventListener('change', scheduleListener)
hs.useSchedulePercent.addEventListener('change', scheduleListener)

// LISTENERS

// Budget
function affordabilityListener(event) {
  // console.log(hs.useBudgetCost.checked, 'costs')
  // console.log(hs.useBudgetPercent.checked, 'percents')

  let useCosts = hs.useBudgetCost.checked

  hs.iptGreenAffordRating.disabled = !useCosts
  hs.iptYellowAffordRating.disabled = !useCosts

  hs.iptGreenAffordPercent.disabled = useCosts
  hs.iptYellowAffordPercent.disabled = useCosts
}

function recalculateBudget() {
  console.log('calculating affordability')

  let budget = hs.iptConstraintsBudget.value

  if (hs.useBudgetPercent.checked) {
    hs.iptGreenAffordRating.value =
      (budget * hs.iptGreenAffordPercent.value) / 100
    hs.iptYellowAffordRating.value =
      (budget * hs.iptYellowAffordPercent.value) / 100
  } else {
    hs.iptGreenAffordPercent.value =
      ((hs.iptGreenAffordRating.value - budget) * 100) / budget
    hs.iptYellowAffordPercent.value =
      ((hs.iptYellowAffordRating.value - budget) * 100) / budget
  }

  hs.iptRedAffordRating.value = hs.iptYellowAffordRating.value
  hs.iptRedAffordPercent.value = hs.iptYellowAffordPercent.value
}

// Schedule
function scheduleListener(event) {
  let useMonths = hs.useScheduleMonths.checked

  hs.iptBlueScheduleRating.disabled = !useMonths
  hs.iptTealScheduleRating.disabled = !useMonths
  hs.iptGreenScheduleRating.dsabled = !useMonths
  hs.iptYellowScheduleRating.disabled = !useMonths

  hs.iptBluePercent.disabled = useMonths
  hs.iptTealPercent.disabled = useMonths
  hs.iptGreenPercent.disabled = useMonths
  hs.iptYellowPercent.disabled = useMonths
}

function recalculateSchedule() {
  // TODO Add event listeners for this function

  console.log('recaluclating schedule')

  let schedule = hs.iptConstraintsSchedule.value

  if (hs.useScheduleMonths.checked) {
  } else {
    hs.iptBlueScheduleRating.value =
      (schedule * hs.iptBluePercent.value) / 100
    hs.iptTealScheduleRating.value =
      (schedule * hs.iptTealPercent.value) / 100
    hs.iptGreeneScheduleRating.value =
      (schedule * hs.iptGreenePercent.value) / 100
    hs.iptYellowBlueScheduleRating.value =
      (schedule * hs.iptYellowBluePercent.value) / 100
    hs.iptRedScheduleRating.value = hs.iptYellowBlueScheduleRating.value
  }
}

// Buttons
function btnApplyListener(event) {
  if (isInputsOk()) saveAndClose()
}

function btnCancelListener(event) {
  hs.setupModal.classList.add('invisible')
}

// Validation Functions
function isInputsOk() {
  return true
}

var cache = []

function cacheValues() {
  var inputs = $tags(hs.setupModal, 'input')
  hs.btnCancel.innerText = inputs.length

  for (let i = 0; i < inputs.length; i++) {
    hs.btnApply.innerText = inputs[i].id
    cache.push({ id: inputs[i].id, value: inputs[i].value })
  }

  restoreValues()

  alert('ran loop')
}

function restoreValues() {
  cache.forEach(item => ($(item.id).value = +item.value))
}

// UI Functions
function saveAndClose() {
  cacheValues()
}

// Helpers
function $(id) {
  return document.getElementById(id)
}
function $tags(elem, tag) {
  return elem.getElementsByTagName(tag)
}
function $qAll(elem, query) {
  return elem.querySelectorAll(query)
}
