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

document.addEventListener('DOMContentLoaded', function() {
    var activeTab = document.querySelector('.tabPanel.active');
    console.log('active tab id: ', activeTab.id);

    setupFilterValueChangedListenerHandler(activeTab.id);
    setupUserTypingInFilterListenerHandler(activeTab.id);
    setupExampleSelectedOrChangedListenerHandler(activeTab.id);
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
        const predicate = $(this).find('.predicate').next('.hidden-uri').val();
        // const predicateObj = $(this).find('.predicate');
        const datatype = $(this).find('.datatype').val();
        // const predicateId = predicateObj.attr('id');

        // With multiple filters:
        // const numberPart = predicateId.match(/-(\d+)$/)[1];

        const minValue = $(this).find('.min-val').val();
        const maxValue = $(this).find('.max-val').val();

        if (predicate && minValue && maxValue) {
            const valPred = $(this).find('.predicate').val();
            queryStrings[activeTabID] += `
    # ... with ${valPred} between ${minValue} and ${maxValue} ...
    ?subject <${predicate}> ?value .
    FILTER(?value >= "${minValue}"^^${datatype} && ?value <= "${maxValue}"^^${datatype})
            `;
        }

        // With multiple filters:
        // if (predicate && minValue && maxValue) {
        //     queryStrings[activeTab.id] += `
        //     ?subject <${predicate}> ?value${numberPart} .
        //     FILTER(?value${numberPart} >= "${minValue}"^^${datatype} && ?value${numberPart} <= "${maxValue}"^^${datatype})
        //     `;
        // }
    });
}

function updateQueryRegexFilter(activeTabID) {
    $('.regex-search-filter-'+activeTabID).each(function() {
        const predicate = $(this).find('.predicate').next('.hidden-uri').val();
        const regex = $(this).find('.regex').val();

        if (predicate && regex) {
            const valPred = $(this).find('.predicate').val();
            queryStrings[activeTabID] += `
    # ... with ${valPred} matching the regular expression ${regex} ... 
    ?subject <${predicate}> ?regexValue .
    FILTER(regex(?regexValue, "${regex}", "i"))
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