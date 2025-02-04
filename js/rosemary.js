const yasgui = new Yasgui(document.getElementById("yasgui"));
let gui = document.createElement('div');

// get all tabs
let allTabs = document.getElementsByClassName('tabPanel');

// initialise query strings (each tab has its own query string)
let queryStrings = {};
let tabs = document.getElementsByClassName('tabPanel');
for (let i = 0; i < tabs.length; i++) {
    queryStrings[tabs[i].id] = '';
}

// Add Rosemary to each tab
for (let i = 0; i < allTabs.length; i++) {
    addRosemaryToTab(allTabs[i]);
    setupRosemaryButtonPulse(allTabs[i].id);
}

/** accessibility: to be compatible with screen readers and best practices **/
document.getElementsByClassName('closeTab')[0].setAttribute('aria-hidden', 'false');
document.getElementsByClassName('closeTab')[0].removeAttribute('tabindex');

/************* "tab" is the variable which holds the model to edit Yasqe SPARQL query **************/
let tab = yasgui.getTab() || yasgui.addTab();
/********************************************************************************/

let closeTabButtons = document.getElementsByClassName('closeTab');
let activeTabPanel = document.querySelector('.tabPanel.active');

function updateQueryStringList(){
    let newQueryStrings = {};
    let tabs = document.getElementsByClassName('tabPanel');
    for (let i = 0; i < tabs.length; i++) {
        if (queryStrings.hasOwnProperty(tabs[i].id)) {
            newQueryStrings[tabs[i].id] = queryStrings[tabs[i].id];
        }
        else {
            newQueryStrings[tabs[i].id] = '';
        }
    }
    return newQueryStrings;
}

document.getElementsByClassName('closeTab')[0].addEventListener("click", (event) => {
    allTabs = document.getElementsByClassName('tabPanel');
    for (let i = 0; i < allTabs.length; i++) {
        addRosemaryToTab(allTabs[i]);
        setupRosemaryButtonPulse(allTabs[i].id);
    }
    queryStrings = updateQueryStringList();
});

document.getElementsByClassName('addTab')[0].addEventListener("click", (event) => {
    queryStrings = updateQueryStringList();
    allTabs = document.getElementsByClassName('tabPanel');
    for (let i = 0; i < allTabs.length; i++) {
        addRosemaryToTab(allTabs[i]);
        setupRosemaryButtonPulse(allTabs[i].id);
    }

    closeTabButtons = document.getElementsByClassName('closeTab');

    for (let i = 0; i < closeTabButtons.length; i++) {
        const div = closeTabButtons[i];
        div.removeAttribute('tabindex');
        div.setAttribute('aria-hidden', 'false');
    }

    event.stopPropagation();
});

/** main invokation part */

let filterCount = 1;
let valueFilterCount = 1;
let newItems = [];
let regexFilterCount = 1;
let showAttributeCount = 1;

function setupFilterValueChangedListenerHandler(activeTabID){
    $(document).on('change', '.predicate, .min-val, .max-val, .regex, .object, .datatype, #limit-val-'+activeTabID, function() {
        updateSparqlQuery();
        newItems = [];                                                  // Refresh dropdown items
    });
}

function setupUserTypingInFilterListenerHandler(activeTabID){
    $(document).on('input', '.predicate, .object, #show-attribute', function() {
        newItems = [];                                                  // Refresh dropdown items
        if ($(this).hasClass('predicate')) {
            setupAutocomplete($(this), activeTabID, '.predicate', 'predicate');
        }
        if ($(this).hasClass('object')) {
            setupAutocomplete($(this), activeTabID, '.object', 'object');
        }
    });
}

function displayExampleQuery(activeTabID){
    var dropdown = document.getElementsByClassName('example-'+activeTabID)[0];
    const selectedIndex = dropdown.selectedIndex;
    const selectedValue = dropdown.options[selectedIndex];
    constructExampleQuery(selectedValue);
}

function setupExampleSelectedOrChangedListenerHandler(activeTabID){
    $(document).on('input', '.example-'+activeTabID, function() {
        displayExampleQuery(activeTabID);
    });

    $(document).on('change', '*', function() {
        var activeTab = document.querySelector('.tabPanel.active');
        activeTabPanel = document.querySelector('.tabPanel.active');
        
        if ($(this).hasClass('example-'+activeTab.id)) {
            setupFilterListener(activeTabID);
        }

        if ($(this).hasClass('example-'+activeTab.id)) {
            displayExampleQuery(activeTab.id);
        }
    });
}

// Function to toggle pulse effect
function togglePulse() {
    const rosemaryButton = document.getElementById(this.id);
    if (rosemaryButton.classList.contains('pulse')) {
        rosemaryButton.classList.remove('pulse'); // Stop the pulse
    } else {
        rosemaryButton.classList.add('pulse'); // Start the pulse
    }
}

function setupRosemaryButtonPulse(activeTabID){
    const rosemaryButton = document.getElementById('rosemaryButton-'+activeTabID);
    rosemaryButton.addEventListener('click', togglePulse);
}

// Keep track of active filters
let activeFilters = new Set();

// Modify addSearchFilter to explicitly use the active tab
function addSearchFilter(activeTabID) {
    // Find the vfexample div within the ACTIVE tab
    const vfexample = document.querySelector(`#main-content-${activeTabID} #vfexample`);
    if (!vfexample) {
        console.error('Could not find vfexample in active tab');
        return;
    }

    // Create unique ID for this filter
    // const filterId = `filter-${Date.now()}-${Math.random().toString(36)}`;
    const filterId = `vfpredicate-${filterCount}`;
    const filterObjId = `vfobject-${filterCount}`;
    
    // Create container for the new filter
    const filterContainer = document.createElement('div');
    filterContainer.classList.add('added-filter-container');
    filterContainer.classList.add('attr-val-filter-vf');
    filterContainer.id = filterId;

    const searchFilterDiv = document.createElement('div');
    searchFilterDiv.classList.add('search-filter-'+activeTabID);

    // Create predicate input container
    const predInputLoaderContainerDiv = document.createElement('div');
    predInputLoaderContainerDiv.classList.add('input-loader-container');

    const predInput = document.createElement('input');
    predInput.type = 'text';
    predInput.classList.add('predicate');
    predInput.id = filterId;
    predInput.placeholder = 'Property (type for suggestions ...)';

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.classList.add('hidden-uri');

    const loaderDiv = document.createElement('div');
    loaderDiv.classList.add('loader');

    const spanVP = document.createElement('span');
    spanVP.classList.add('search-icon');
    spanVP.textContent = '🔍';

    predInputLoaderContainerDiv.appendChild(predInput);
    predInputLoaderContainerDiv.appendChild(hiddenInput);
    predInputLoaderContainerDiv.appendChild(spanVP);
    predInputLoaderContainerDiv.appendChild(loaderDiv);

    // Create object input container
    const objInputLoaderContainerDiv = document.createElement('div');
    objInputLoaderContainerDiv.classList.add('input-loader-container');

    const objInput = document.createElement('input');
    objInput.type = 'text';
    objInput.id = filterObjId;
    objInput.classList.add('object');
    objInput.placeholder = 'Value (type for suggestions ...)';

    const hiddenInput2 = document.createElement('input');
    hiddenInput2.type = 'hidden';
    hiddenInput2.classList.add('hidden-uri');

    const loaderDiv2 = document.createElement('div');
    loaderDiv2.classList.add('loader');

    const spanVV = document.createElement('span');
    spanVV.classList.add('search-icon');
    spanVV.textContent = '🔍';

    objInputLoaderContainerDiv.appendChild(objInput);
    objInputLoaderContainerDiv.appendChild(hiddenInput2);
    objInputLoaderContainerDiv.appendChild(spanVV);
    objInputLoaderContainerDiv.appendChild(loaderDiv2);

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-filter-button');
    deleteButton.innerHTML = '✕';
    deleteButton.title = 'Remove this filter';
    deleteButton.onclick = function() {
        activeFilters.delete(filterId);
        filterContainer.remove();
        updateSparqlQuery();
    };

    // Assemble all components
    searchFilterDiv.appendChild(predInputLoaderContainerDiv);
    searchFilterDiv.appendChild(objInputLoaderContainerDiv);
    searchFilterDiv.appendChild(deleteButton);
    filterContainer.appendChild(searchFilterDiv);

    // Add the new filter to the vfexample div
    vfexample.appendChild(filterContainer);

    // Set up autocomplete for the new inputs
    setupAutocomplete($('#' + predInput.id), activeTabID, '.predicate', 'predicate');
    setupAutocomplete($('#' + objInput.id), activeTabID, '.object', 'object');

    // Track this filter
    activeFilters.add(filterId);
    filterCount++;
}

function addValueRangeFilter(activeTabID){
    // Find the vfexample div within the ACTIVE tab
    const vrfdiv = document.querySelector('.value-search-filter-'+activeTabID);
    if (!vrfdiv) {
        console.error('Could not find vrfdiv in active tab');
        return;
    }
    
    // Create unique ID for this filter
    // const filterId = `filter-${Date.now()}-${Math.random().toString(36)}`;
    const filterId = `vrfpredicate-${valueFilterCount}`;
    const filterMinId = `min-val-${valueFilterCount}`;
    const filterMaxId = `max-val-${valueFilterCount}`;

    // Create container for the new filter
    const filterContainer = document.createElement('div');
    filterContainer.classList.add('added-filter-container');
    filterContainer.id = filterId;

    const attributeValueRangeFilterPanel = document.createElement('div');
    const attributeValueRangeFilterBoxesPanel = document.createElement('div');
    attributeValueRangeFilterBoxesPanel.classList.add('value-search-filter-'+activeTabID);

    const attributeValueRangeFilterAttributeInput = document.createElement('input');
    attributeValueRangeFilterAttributeInput.type = 'text';
    attributeValueRangeFilterAttributeInput.classList.add('predicate');
    attributeValueRangeFilterAttributeInput.id = filterId;
    attributeValueRangeFilterAttributeInput.placeholder = 'Property (type for suggestions ...)';

    const hiddenInputValRange = document.createElement('input');
    hiddenInputValRange.type = 'hidden';
    hiddenInputValRange.classList.add('hidden-uri');

    const loaderDivValRange = document.createElement('div');
    loaderDivValRange.classList.add('loader');
    
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('input-loader-container');

    const spanVRP = document.createElement('span');
    spanVRP.classList.add('search-icon');
    spanVRP.textContent = '🔍';

    inputDiv.appendChild(attributeValueRangeFilterAttributeInput);
    inputDiv.appendChild(hiddenInputValRange);
    inputDiv.appendChild(spanVRP);
    inputDiv.appendChild(loaderDivValRange);
    
    attributeValueRangeFilterBoxesPanel.appendChild(inputDiv);

    const divMin = document.createElement('div');
    divMin.classList.add('input-loader-container');
    const attributeValueRangeFilterMinInput = document.createElement('input');
    attributeValueRangeFilterMinInput.type = 'text';
    attributeValueRangeFilterMinInput.id = filterMinId;
    attributeValueRangeFilterMinInput.classList.add('min-val');
    attributeValueRangeFilterMinInput.placeholder = 'Min Value';
    divMin.appendChild(attributeValueRangeFilterMinInput);
    attributeValueRangeFilterBoxesPanel.appendChild(divMin);
    
    const divMax = document.createElement('div');
    divMax.classList.add('input-loader-container');
    const attributeValueRangeFilterMaxInput = document.createElement('input');
    attributeValueRangeFilterMaxInput.type = 'text';
    attributeValueRangeFilterMaxInput.id = filterMaxId;
    attributeValueRangeFilterMaxInput.classList.add('max-val');
    attributeValueRangeFilterMaxInput.placeholder = 'Max Value';
    
    divMax.appendChild(attributeValueRangeFilterMaxInput);
    attributeValueRangeFilterBoxesPanel.appendChild(divMax);

    const dropdownDiv = document.createElement('div');
    dropdownDiv.classList.add('dtype-dropdown');

    const dropdown = document.createElement('select');
    dropdown.classList.add('datatype');
    const dateOption = document.createElement('option');
    dateOption.value = 'xsd:date';
    dateOption.textContent = 'Date';
    const intOption = document.createElement('option');
    intOption.value = 'xsd:integer';
    intOption.textContent = 'Integer';
    const decOption = document.createElement('option');
    decOption.value = 'xsd:decimal';
    decOption.textContent = 'Decimal';
    const floatOption = document.createElement('option');
    floatOption.value = 'xsd:float';
    floatOption.textContent = 'Float';
    const doubleOption = document.createElement('option');
    doubleOption.value = 'xsd:double';
    doubleOption.textContent = 'Double';
    
    dropdown.appendChild(dateOption);
    dropdown.appendChild(intOption);
    dropdown.appendChild(decOption);
    dropdown.appendChild(floatOption);
    dropdown.appendChild(doubleOption);

    dropdownDiv.appendChild(dropdown);

    // Assemble all components
    attributeValueRangeFilterBoxesPanel.appendChild(dropdownDiv);
    attributeValueRangeFilterPanel.appendChild(attributeValueRangeFilterBoxesPanel);

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-filter-button');
    deleteButton.innerHTML = '✕';
    deleteButton.title = 'Remove this filter';
    deleteButton.onclick = function() {
        activeFilters.delete(filterId);
        filterContainer.remove();
        updateSparqlQuery();
    };

    attributeValueRangeFilterPanel.appendChild(deleteButton);
    filterContainer.appendChild(attributeValueRangeFilterPanel);
    vrfdiv.appendChild(filterContainer);

    // Set up autocomplete for the new inputs
    setupAutocomplete($('#' + attributeValueRangeFilterAttributeInput.id), activeTabID, '.predicate', 'predicate');

    // Track this filter
    activeFilters.add(filterId);
    valueFilterCount++;
}

function addStringMatchFilter(activeTabID){
    // Find the vfexample div within the ACTIVE tab
    const regexdiv = document.querySelector('.regex-search-filter-'+activeTabID);
    if (!regexdiv) {
        console.error('Could not find regex in active tab');
        return;
    }
    
    // Create unique ID for this filter
    const filterId = `smfpredicate-${regexFilterCount}`;
    const regexId = `regex-${regexFilterCount}`;
    
    // Create container for the new filter
    const filterContainer = document.createElement('div');
    filterContainer.classList.add('added-filter-container');
    filterContainer.id = filterId;

    const stringMatchFilterPanel = document.createElement('div');
    const stringMatchFilterBoxesPanel = document.createElement('div');
    stringMatchFilterBoxesPanel.classList.add('regex-search-filter-'+activeTabID);

    // stringMatchFilterPanel.classList.add('attr-val-filter');

    const stringMatchFilterAttributeInput = document.createElement('input');
    stringMatchFilterAttributeInput.type = 'text';
    stringMatchFilterAttributeInput.classList.add('predicate');
    stringMatchFilterAttributeInput.id = filterId;
    stringMatchFilterAttributeInput.placeholder = 'Property (type for suggestions ...)';

    const hiddenInputRegexPred = document.createElement('input');
    hiddenInputRegexPred.type = 'hidden';
    hiddenInputRegexPred.classList.add('hidden-uri');

    const loaderDivRegexPred = document.createElement('div');
    loaderDivRegexPred.classList.add('loader');
    
    const inputDivRegex = document.createElement('div');
    inputDivRegex.classList.add('input-loader-container');

    const spanSM = document.createElement('span');
    spanSM.classList.add('search-icon');
    spanSM.textContent = '🔍';

    inputDivRegex.appendChild(stringMatchFilterAttributeInput);
    inputDivRegex.appendChild(hiddenInputRegexPred);
    inputDivRegex.appendChild(spanSM);
    inputDivRegex.appendChild(loaderDivRegexPred);
    
    stringMatchFilterBoxesPanel.appendChild(inputDivRegex);
    
    const inputDivRegexPattern = document.createElement('div');
    inputDivRegexPattern.classList.add('input-loader-container');

    const stringMatchFilterValueInput = document.createElement('input');
    stringMatchFilterValueInput.type = 'text';
    stringMatchFilterValueInput.classList.add('regex');
    stringMatchFilterValueInput.id = regexId;
    stringMatchFilterValueInput.placeholder='Regular expression';

    inputDivRegexPattern.appendChild(stringMatchFilterValueInput);
    stringMatchFilterBoxesPanel.appendChild(inputDivRegexPattern);
    stringMatchFilterPanel.appendChild(stringMatchFilterBoxesPanel);
    
    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-filter-button');
    deleteButton.innerHTML = '✕';
    deleteButton.title = 'Remove this filter';
    deleteButton.onclick = function() {
        activeFilters.delete(filterId);
        filterContainer.remove();
        updateSparqlQuery();
    };

    stringMatchFilterPanel.appendChild(deleteButton);
    filterContainer.appendChild(stringMatchFilterPanel);
    regexdiv.appendChild(filterContainer);

    // Set up autocomplete for the new inputs
    setupAutocomplete($('#' + stringMatchFilterAttributeInput.id), activeTabID, '.predicate', 'predicate');

    // Track this filter
    activeFilters.add(filterId);
    regexFilterCount++;
}

// Update the setupFilterListener function to handle all filter types
function setupFilterListener(activeTabID) {
    // Existing Value Filter button
    const addFilterButton = document.getElementById('add-vfilter-' + activeTabID);
    if (addFilterButton) {
        const newButton = addFilterButton.cloneNode(true);
        addFilterButton.parentNode.replaceChild(newButton, addFilterButton);
        newButton.addEventListener("click", () => {
            addSearchFilter(activeTabID);
        });
    }

    // Value Range Filter button
    const addVRangeFilterButton = document.getElementById('add-vrange-filter-' + activeTabID);
    if (addVRangeFilterButton) {
        const newButton = addVRangeFilterButton.cloneNode(true);
        addVRangeFilterButton.parentNode.replaceChild(newButton, addVRangeFilterButton);
        newButton.addEventListener("click", () => {
            addValueRangeFilter(activeTabID);
        });
    }

    // String Match Filter button
    const addSMatchFilterButton = document.getElementById('add-smatch-filter-' + activeTabID);
    if (addSMatchFilterButton) {
        const newButton = addSMatchFilterButton.cloneNode(true);
        addSMatchFilterButton.parentNode.replaceChild(newButton, addSMatchFilterButton);
        newButton.addEventListener("click", () => {
            addStringMatchFilter(activeTabID);
        });
    }

    // Display Property button
    const addDisplayPropButton = document.getElementById('add-display-prop-' + activeTabID);
    if (addDisplayPropButton) {
        const newButton = addDisplayPropButton.cloneNode(true);
        addDisplayPropButton.parentNode.replaceChild(newButton, addDisplayPropButton);
        newButton.addEventListener("click", () => {
            addDisplayProperty(activeTabID);
        });
    }
}

// Update document ready handler to properly handle tab initialization
document.addEventListener('DOMContentLoaded', function() {
    // Get the active tab when the page loads
    var activeTab = document.querySelector('.tabPanel.active');
    if (activeTab) {
        setupFilterListener(activeTab.id);
        setupFilterValueChangedListenerHandler(activeTab.id);
        setupUserTypingInFilterListenerHandler(activeTab.id);
        setupExampleSelectedOrChangedListenerHandler(activeTab.id);
    }

    // Set up listeners for tab changes
    const tabPanels = document.getElementsByClassName('tabPanel');
    for (let tabPanel of tabPanels) {
        tabPanel.addEventListener('click', function() {
            if (this.classList.contains('active')) {
                setupFilterListener(this.id);
            }
        });
    }


});

function setFormValueAccordingToSelectedExample(selectedExample, formElement, fieldType) {
    formElement.val(EXAMPLE_QUERIES[selectedExample.value][fieldType]);
    if (formElement.is('.predicate') || formElement.is('.object')) {
        formElement.next('.hidden-uri').val(EXAMPLE_QUERIES[selectedExample.value][fieldType+'_HIDDEN']);
    }
}

function updateValueFilterFormValues(activeTabID, selectedExample){
    $('.search-filter-'+activeTabID).each(function() {
        const predicate = $(this).find('.predicate');
        const object = $(this).find('.object');
        if ((predicate.length > 0) && (object.length > 0)) {
            setFormValueAccordingToSelectedExample(selectedExample, predicate, 'VF_PREDICATE');
            setFormValueAccordingToSelectedExample(selectedExample, object, 'VF_OBJECT');
        }
    });
}

function updateValueValueRangeFilterFormValues(activeTabID, selectedExample){
    $('.value-search-filter-'+activeTabID).each(function() {
        const predicate = $(this).find('.predicate');
        const minValue = $(this).find('.min-val');
        const maxValue = $(this).find('.max-val');
        const datatype = $(this).find('.datatype');

        if ((predicate.length > 0) && (minValue.length > 0) && (maxValue.length > 0) && (datatype.length > 0)) {
            const formValues = [[predicate, 'VRF_PREDICATE'],[minValue, 'VRF_MIN'],[maxValue, 'VRF_MAX'],[datatype, 'DTYPE']];
            
            formValues.forEach(([value, key]) => {
                setFormValueAccordingToSelectedExample(selectedExample, value, key);
            });
        }
    });
}

function updateRegexFilterFormValues(activeTabID, selectedExample) {
    $('.regex-search-filter-'+activeTabID).each(function() {
        const predicate = $(this).find('.predicate');
        const regex = $(this).find('.regex');
        if ((predicate.length > 0) && (regex.length > 0)) {
            setFormValueAccordingToSelectedExample(selectedExample, predicate, 'SMF_PREDICATE');
            setFormValueAccordingToSelectedExample(selectedExample, regex, 'SMF_REGEX');
        }
    });
}

function updateDisplayPropFilterFormValues(activeTabID, selectedExample) {
    $('.show-attribute-section-'+activeTabID).each(function() {
        const predicate = $(this).find('.predicate');        
        if (predicate.length > 0) {
            setFormValueAccordingToSelectedExample(selectedExample, predicate, 'DP_PREDICATE');
        }
    });
}

function constructExampleQuery(selectedExample) {
    var activeTab = document.querySelector('.tabPanel.active');
    queryStrings[activeTab.id] = EXAMPLE_QUERIES[selectedExample.value].QUERY;
    
    updateValueFilterFormValues(activeTab.id, selectedExample);
    updateValueValueRangeFilterFormValues(activeTab.id, selectedExample);
    updateRegexFilterFormValues(activeTab.id, selectedExample);
    updateDisplayPropFilterFormValues(activeTab.id, selectedExample);
    setFormValueAccordingToSelectedExample(selectedExample, $('#limit-val-'+activeTab.id), 'LIMIT');

    tab = yasgui.getTab(activeTab.id);
    tab.setQuery(queryStrings[activeTab.id]);
}

function setupAutocomplete(element, activeTabID, selector, type) {
    let page = 0, currentTerm = ''; // Initialize variables

    const fetchAndRender = (term, nextPage, callback) => {
        const $container = element.closest('.input-loader-container').addClass('loading');
        fetchSuggestions($('#endpoint-url-'+activeTabID).val(), type, term, nextPage, items => {
            if (items.length >= CONSTANTS.SUGGESTIONS_PER_PAGE) items.push({ label: 'More...', value: 'more' });
            $container.removeClass('loading');
            callback(items);
        });
    };

    $(selector).autocomplete({
        source: (req, res) => {
            if (currentTerm !== req.term) (currentTerm = req.term, page = 0); // Reset page on new term
            fetchAndRender(currentTerm, page, res);
        },
        appendTo: 'body', minLength: 2,
        select: (e, ui) => ui.item.value === 'more' ? (page++, fetchAndRender(currentTerm, page, () => $(selector).autocomplete('search', currentTerm)), false) : ($(e.target).val(ui.item.label).next('.hidden-uri').val(ui.item.value), false)
    });
}

function fetchSuggestions(endpointUrl, type, term, page, callback) {
    const offset = page * CONSTANTS.SUGGESTIONS_PER_PAGE // Suggestions 

    $.ajax({
        url: endpointUrl,
        dataType: 'json',
        data: {
            query: buildAutocompleteQuery(type, term, CONSTANTS.SUGGESTIONS_PER_PAGE, offset),
            format: 'json'
        },
        success: function(data) {
            const items = parseAutocompleteResults(data, type);
            callback(items);
        },
        error: function() {
            callback([]);
        }
    });
}

function replaceLastOccurrence(str, token, replacement) {
    const lastIndex = str.lastIndexOf(token);
    if (lastIndex === -1) {
        // Token not found, return the original string
        return str;
    }

    // Replace the last occurrence of the token
    return str.slice(0, lastIndex) + replacement + str.slice(lastIndex + token.length);
}

function buildAutocompleteQuery(type, term, limit, offset) {
    const search_tokens = term.split(/\s+/);

    // 'Starts with' regex character
    regex_str = ''; 

    // Add regex expression for whitespace (inbetween each token)
    // This makes it possible for the matching input by the user to 
    // contain spaces. Without this, will not find matches with spaces
    for (let i = 0; i < search_tokens.length; i++) {
        regex_str += search_tokens[i] + '\\\\s*';
    }

    regex_str = replaceLastOccurrence(regex_str, '\\\\s*', '.*');

    // Some rdfs:labels for entities contain parentheses. Parentheses
    // has a meaning in regex syntax so we have to escape them
    regex_str = regex_str.replace('(', '\\\\(');
    regex_str = regex_str.replace(')', '\\\\)');

    if (type === 'predicate') {
        console.log('regex1: ', regex_str);
        return TEMPLATE_QUERIES.PREDICATE(regex_str, limit, offset);
    } else if (type === 'object') {
        console.log('regex2: ', regex_str);
        return TEMPLATE_QUERIES.OBJECT(regex_str, limit, offset);;
    }
}

function parseAutocompleteResults(data, type) {
    const bindings = data.results.bindings;
    return bindings.map(binding => ({
        label: binding.label.value,
        value: binding[type].value
    }));
}

function updateQueryDisplayPropertySelectVariable(activeTabID) {
    $('.show-attribute-section-'+activeTabID).each(function() {
        const predicate = $(this).find('.predicate').next('.hidden-uri').val();
        // const predicateObj = $(this).find('.predicate');
        // const predicateId = predicateObj.attr('id');
        // const numberPart = predicateId.match(/-(\d+)$/)[1];

        // Multiple filter case
        // if (predicate) {
        //     queryStrings[activeTab.id] += ` ?showAttributeVal${numberPart} `;
        // }

        // Single filter case
        if (predicate) {
            queryStrings[activeTabID] += ` ?showAttributeVal `;
        }
    });
}

function updateQueryValueFilter(activeTabID) {
    $('.search-filter-'+activeTabID).each(function() {
        const predicate = $(this).find('.predicate').next('.hidden-uri').val();
        const object = $(this).find('.object').next('.hidden-uri').val();

        if (predicate && object) {
            const valPred = $(this).find('.predicate').val();
            const valObj = $(this).find('.object').val();
            queryStrings[activeTabID] += `

    # ... with ${valObj} as value for ${valPred} ...
    ?subject <${predicate}> <${object}> .
            `;
        }
    });
}

function updateQueryValueRangeFilter(activeTabID) {
    $('.value-search-filter-'+activeTabID).each(function() {
        const mainpred = $(this).find('.predicate');
        const predicate = $(this).find('.predicate').next('.hidden-uri').val();
        const datatype = $(this).find('.datatype').val();
        const minValue = $(this).find('.min-val').val();
        const maxValue = $(this).find('.max-val').val();
        const filterId = mainpred.attr('id');
        const filterIdParts = filterId.split('-');

        if (predicate && minValue && maxValue) {
            const valPred = $(this).find('.predicate').val();
            queryStrings[activeTabID] += `
    # ... with ${valPred} between ${minValue} and ${maxValue} ...
    ?subject <${predicate}> ?valueRF${filterIdParts[1]} .
    FILTER(?valueRF${filterIdParts[1]} >= "${minValue}"^^${datatype} && ?valueRF${filterIdParts[1]} <= "${maxValue}"^^${datatype})
            `;
        }
    });
}

function updateQueryRegexFilter(activeTabID) {
    $('.regex-search-filter-'+activeTabID).each(function() {
        const mainpred = $(this).find('.predicate');
        const predicate = $(this).find('.predicate').next('.hidden-uri').val();

        const regex = $(this).find('.regex').val();
        
        const filterId = mainpred.attr('id');
        const filterIdParts = filterId.split('-');

        if (predicate && regex) {
            const valPred = $(this).find('.predicate').val();
            queryStrings[activeTabID] += `
    # ... with ${valPred} matching the regular expression ${regex} ... 
    ?subject <${predicate}> ?regexValue${filterIdParts[1]} .
    FILTER(regex(?regexValue${filterIdParts[1]}, "${regex}", "i"))
            `;
        }
    });
}

function updateQueryDisplayPropFilter(activeTabID) {
    $('.show-attribute-section-'+activeTabID).each(function() {
        const predicate = $(this).find('.predicate').next('.hidden-uri').val();
        // const predicateObj = $(this).find('.predicate');
        // const predicateId = predicateObj.attr('id');
        // const numberPart = predicateId.match(/-(\d+)$/)[1];

        // For multiple filter case
        // if (predicate) {
        //     query += `
        //         # ... display the ${predicateObj} values for these entities ...
        //         ?subject <${predicate}> ?showAttributeVal${numberPart} .
        //     `;
        // }

        // Single filter case
        if (predicate) {
            const valPred = $(this).find('.predicate').val();
            queryStrings[activeTabID] += `
    # ... display the ${valPred} values for these entities ...
    ?subject <${predicate}> ?showAttributeVal .
            `;
        }
    });
}

function updateQueryLimit(activeTabID){
    const limit = $('#limit-val-'+activeTabID).val();

    if (limit) {
        queryStrings[activeTabID] += `

    } 
    LIMIT ${limit} # Return max ${limit} results
        `;
    }
    else {
        queryStrings[activeTabID] += `

    } 
    LIMIT 100 # Return max 100 results
        `;
    }
}

function updateSparqlQuery() {
    // Get currently active query
    var activeTab = document.querySelector('.tabPanel.active');
    // Get endpoint
    const endpoint = $('#endpoint-url-'+activeTab.id).val();

    queryStrings[activeTab.id] = TEMPLATE_QUERIES.HEADER(endpoint);

    updateQueryDisplayPropertySelectVariable(activeTab.id);
    queryStrings[activeTab.id] += ` WHERE {`;
    updateQueryValueFilter(activeTab.id);
    updateQueryValueRangeFilter(activeTab.id);
    updateQueryRegexFilter(activeTab.id);
    updateQueryDisplayPropFilter(activeTab.id);
    updateQueryLimit(activeTab.id);

    tab = yasgui.getTab(activeTab.id);
    tab.setQuery(queryStrings[activeTab.id]);
}