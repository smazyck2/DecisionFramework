alert('js')

// Handles for Elements
const btnApply = $("btnApply")
btnApply.addEventListener("click", btnApplyListener)

const btnCancel = $("btnCancel")
btnCancel.addEventListener("click", btnCancelListener)

const setupModal = $('setupModal')

// Listeners
function btnApplyListener(event) { if (isInputsOk()) saveAndClose() }

function btnCancelListener(event) {
	setupModal.classList.add('invisible')
}

// Validation Functions
function isInputsOk() {
	return true
}

var cache = []

function cacheValues() {
	var inputs = $tags(setupModal, 'input')
	btnCancel.innerText = inputs.length
	
	for (let i=0; i < inputs.length; i++) {
		btnApply.innerText = inputs[i].id
		cache.push( { id:inputs[i].id, value:inputs[i].value } )
	}
	
	restoreValues()
	
	alert('ran loop')
}

function restoreValues() { cache.forEach(item => $(item.id).value = +item.value) }

// UI Functions
function saveAndClose() { cacheValues() }

// Helpers
function $(id) { return document.getElementById(id) }
function $tags(elem, tag) { return elem.getElementsByTagName(tag) }