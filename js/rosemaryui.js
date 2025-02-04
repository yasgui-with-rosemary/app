function createRosemaryButton(tabPanelID){
  var rosemary_svg = CONSTANTS.ROSEMARY_ICON_SVG;
  var rosemary_svg_component = drawSvgStringAsElement(rosemary_svg, tabPanelID, true);
  const rosemaryLinkWrapper = document.createElement("button");
  rosemaryLinkWrapper.id = tabPanelID;
  rosemaryLinkWrapper.className = "yasqe_rosemary";
  rosemaryLinkWrapper.title = "Rosemary";
  rosemaryLinkWrapper.setAttribute("aria-label", "Rosemary");
  rosemaryLinkWrapper.appendChild(rosemary_svg_component);
  return rosemaryLinkWrapper;
}

function addRosemaryToTab(tabPanel){
  // Find the yasqe_buttons div within the active tabPanel
  var buttonExists = false;
  const rosemaryButtons = document.getElementsByClassName('yasqe_rosemary');
  for (let i = 0; i < rosemaryButtons.length;i++){
    if (rosemaryButtons[i].id == tabPanel.id) {
      buttonExists = true;
    }
  }

  if (buttonExists) {
    console.log('button already exists');
    return;
  } 
  else {
    const rosemaryButton = createRosemaryButton(tabPanel.id);
    rosemaryButton.addEventListener("click", (event) => {
        gui = document.querySelector('.tabPanel').querySelector('#main-content-'+tabPanel.id);
        if (!gui) {
            gui = document.querySelector('.tabPanel.active').querySelector('#main-content-'+tabPanel.id);
        }
        if (gui) {
            if (gui.classList.contains('open')) {
                gui.classList.remove('open');
            } else {
                gui.classList.add('open');
            }
        } else {
            let newGui = createGUI(rosemaryButton.id);
            if (newGui) {
                gui = newGui;
                // Set up filter listener after creating new GUI
                setupFilterListener(tabPanel.id);
            }
        }
        event.stopPropagation();
    });

    var yasqeButtons = tabPanel.querySelector('.yasqe_buttons');
    if (yasqeButtons) {
        yasqeButtons.appendChild(rosemaryButton);
        console.log('Found yasqe_buttons: ', yasqeButtons, ' tab panel id: ', tabPanel.id);
    } else {
        console.log('No yasqe_buttons div found under this tabPanel: ', tabPanel.id);
    }
  }
}

function escapeIdSelector(id) {
  // Check if the ID starts with a number
  if (/^\d/.test(id)) {
      // Escape the digits (each digit needs to be escaped)
      let escapedId = '';
      for (let i = 0; i < id.length; i++) {
          const char = id[i];
          if (/\d/.test(char)) {
              // Escape each digit as a hexadecimal code
              escapedId += `\\${char.charCodeAt(0).toString(16)} `;
          } else {
              // Append the rest of the characters as-is
              escapedId += id.slice(i);
              break; // Exit loop once we reach non-digit
          }
      }
      return `#${escapedId}`;
  }
  // Return the original ID if it doesn't start with a number
  return `#${id}`;
}

function createGUI(tabPanelID) {
    // Create the main container
    const mainContentExists = document.querySelector('#main-content-'+tabPanelID);

    if (mainContentExists) {
      return null;
    }

    let mainContent = document.createElement('div');
    mainContent.id = 'main-content-'+tabPanelID;
    mainContent.classList.add('yasqe');
    mainContent.classList.add('rosemaryTabMenu');
    mainContent.classList.add('open');

    // Create logo button (for query panel) - link to Github
    var rosemary_panel_logo_svg = CONSTANTS.ROSEMARY_ICON_SVG;
    var rosemary_panel_logo_svg_component = drawSvgStringAsElement(rosemary_panel_logo_svg, tabPanelID, false);
    const rosemary_panel_logo = document.createElement("div");
    rosemary_panel_logo.title = 'Rosemary Github repository';
    rosemary_panel_logo.className = 'logo_rosemary';
    rosemary_panel_logo.textContent = 'Rosemary';
    rosemary_panel_logo.appendChild(rosemary_panel_logo_svg_component);

    rosemary_panel_logo.addEventListener('click', (event) => {
      window.open(CONSTANTS.ROSEMARY_GITHUB_URL, "_blank");
    });

    /** HTML component IDs cannot start with a number
     * Yet it is possible for Yasgui to generate IDs
     * starting with numbers for query tabs. The following
     * code handles conversion / escaping these numeric
     * characters so Rosemary can deal with them.
     */

    const tabPanelIDStartsWithNumber = /^[0-9]/.test(tabPanelID);
    let tabPanel = null;
    if (tabPanelIDStartsWithNumber) {
      tabPanel = document.querySelector(escapeIdSelector(tabPanelID));
    }
    else {
      tabPanel = document.querySelector('#'+tabPanelID);
    }
    
    var yasqeButtonsEl = tabPanel.querySelector('.yasqe_buttons');
    yasqeButtonsEl.appendChild(mainContent);
    
    if (!yasqeButtonsEl) {
      console.log('yasqe_buttons element not found!');
    }
  
    // Create the flexbox container
    const flexbox = document.createElement('div');
    flexbox.id = 'flexbox';

    // Create info icon spans for each filter
    const divInfoDS = document.createElement('div');
    divInfoDS.classList.add('tooltip');
    divInfoDS.textContent = 'ℹ️';

    const spanInfoDS = document.createElement('span');
    spanInfoDS.classList.add('tooltiptext');
    spanInfoDS.classList.add('dsbottom');
    spanInfoDS.textContent = 'Enter the URL for a publicly accessible SPARQL endpoint which you intend to query.';
    
    divInfoDS.appendChild(spanInfoDS);

    const divInfoVF = document.createElement('div');
    divInfoVF.classList.add('tooltip');
    divInfoVF.textContent = 'ℹ️';

    const spanInfoVF = document.createElement('span');
    spanInfoVF.classList.add('tooltiptext');
    spanInfoVF.textContent = 'Enter the name of a property and value. For example, to find entities in DBpedia born in Calcutta, enter `birth place` for Property and `Calcutta` for Value.';

    divInfoVF.appendChild(spanInfoVF);

    const divInfoVRF = document.createElement('div');
    divInfoVRF.classList.add('tooltip');
    divInfoVRF.textContent = 'ℹ️';

    const spanInfoVRF = document.createElement('span');
    spanInfoVRF.classList.add('tooltiptext');
    spanInfoVRF.textContent = 'Enter the name of a property and a range of values. For example, to find DBpedia entities born between `1900-01-01` and `1945-01-01` enter `birth date` for Property, `1900-01-01` for min value and `1945-01-01` for max value. Make sure to choose the correct data type from the dropdown.';

    divInfoVRF.appendChild(spanInfoVRF);

    const divInfoSMF = document.createElement('div');
    divInfoSMF.classList.add('tooltip');
    divInfoSMF.textContent = 'ℹ️';

    const spanInfoSMF = document.createElement('span');
    spanInfoSMF.classList.add('tooltiptext');
    spanInfoSMF.textContent = 'Enter the name of a property and a regular expression. For example, to find DBpedia entities with names starting with the letter `S` enter `name` for Property and `^S` for Regular expression.';

    divInfoSMF.appendChild(spanInfoSMF);

    const divInfoDP = document.createElement('div');
    divInfoDP.classList.add('tooltip');
    divInfoDP.textContent = 'ℹ️';

    const spanInfoDP = document.createElement('span');
    spanInfoDP.classList.add('tooltiptext');
    spanInfoDP.textContent = 'Enter the name of a property to display for each matching entity in the query results. For example, to display the spouses of the entities matching your DBpedia query, enter `spouse`.';

    divInfoDP.appendChild(spanInfoDP);

    const divInfoLim = document.createElement('div');
    divInfoLim.classList.add('tooltip');
    divInfoLim.textContent = 'ℹ️';

    const spanInfoLim = document.createElement('span');
    spanInfoLim.classList.add('tooltiptext');
    spanInfoLim.textContent = 'Enter a number to indicate the maximum number of results to return.';

    divInfoLim.appendChild(spanInfoLim);

    const divInfoExamples = document.createElement('div');
    divInfoExamples.classList.add('tooltip');
    divInfoExamples.textContent = 'ℹ️';

    const spanInfoExamples = document.createElement('span');
    spanInfoExamples.classList.add('tooltiptext');
    spanInfoExamples.classList.add('exleft');
    spanInfoExamples.textContent = 'Predefined example queries for DBpedia to aid in formulating your own custom queries.';

    divInfoExamples.appendChild(spanInfoExamples);

    /************** Data source component ****************/

    const coverPanel = document.createElement('div');
    coverPanel.classList.add('attr-val-filter');
    const dataSourcePanel = document.createElement('div');
    dataSourcePanel.classList.add('data-source-'+tabPanelID);

    const dataSourceLabel = document.createElement('label');
    dataSourceLabel.htmlFor = 'endpoint-url-'+tabPanelID;
    dataSourceLabel.textContent = 'Data Source';

    dataSourceLabel.appendChild(divInfoDS);
    coverPanel.appendChild(dataSourceLabel);

    const inputLoaderContainerDiv = document.createElement('div');
    inputLoaderContainerDiv.classList.add('input-loader-container');

    const dataSourceInput = document.createElement('input');
    dataSourceInput.id = 'endpoint-url-'+tabPanelID;
    dataSourceInput.type = 'text';
    dataSourceInput.value = 'https://dbpedia.org/sparql';
    dataSourceInput.placeholder='Data Source';

    inputLoaderContainerDiv.appendChild(dataSourceInput);
    dataSourcePanel.appendChild(inputLoaderContainerDiv);

    coverPanel.appendChild(inputLoaderContainerDiv);
    coverPanel.appendChild(dataSourcePanel);
    
    flexbox.appendChild(rosemary_panel_logo);
    flexbox.appendChild(coverPanel);
    
    /************** Attribute Value Filter components ****************/

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('attr-val-filter-vf');

    const attributeValueLabel = document.createElement('label');
    attributeValueLabel.textContent = 'Value Filter';

    attributeValueLabel.appendChild(divInfoVF);
    
    totalDiv.appendChild(attributeValueLabel)
    const searchFilterDiv = document.createElement('div');
    searchFilterDiv.classList.add('search-filter-'+tabPanelID);

    const predInputLoaderContainerDiv = document.createElement('div');
    predInputLoaderContainerDiv.classList.add('input-loader-container');

    const predInput = document.createElement('input');
    predInput.type = 'text';
    predInput.classList.add('predicate');
    predInput.id = 'vfpredicate-0';
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

    searchFilterDiv.appendChild(predInputLoaderContainerDiv);

    const objInputLoaderContainerDiv = document.createElement('div');
    objInputLoaderContainerDiv.classList.add('input-loader-container');

    const objInput = document.createElement('input');
    objInput.type = 'text';
    objInput.id = 'vfobject-0';
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

    searchFilterDiv.appendChild(objInputLoaderContainerDiv);
    totalDiv.appendChild(searchFilterDiv);

    // flexbox.appendChild(totalDiv);

    /********************* Examples dropdown component *********************/

    const examplesDropdownLabel = document.createElement('label');
    examplesDropdownLabel.textContent = 'Example queries';

    const exDropdownDiv = document.createElement('div');
    exDropdownDiv.classList.add('ex-dropdown');

    examplesDropdownLabel.appendChild(divInfoExamples);
    exDropdownDiv.appendChild(examplesDropdownLabel);

    const exDropdown = document.createElement('select');
    exDropdown.classList.add('example-'+tabPanelID);
    const ex1 = document.createElement('option');
    ex1.title = 'People born in Calcutta between 1900 - 1944 with names starting with S, and their spouses';
    ex1.value = 'example1';
    ex1.textContent = EXAMPLE_QUERIES.example1.TITLE;
    const ex2 = document.createElement('option');
    ex2.title = 'Short books by Roald Dahl adapted for film, with their publishers';
    ex2.value = 'example2';
    ex2.textContent = EXAMPLE_QUERIES.example2.TITLE;
    const ex3 = document.createElement('option');
    ex3.title = 'Short movies starring Tom Cruise associated with Oscars, with their directors';
    ex3.value = 'example3';
    ex3.textContent = EXAMPLE_QUERIES.example3.TITLE;
    
    exDropdown.appendChild(ex1);
    exDropdown.appendChild(ex2);
    exDropdown.appendChild(ex3);
    exDropdownDiv.appendChild(exDropdown);

    const vfExample = document.createElement('div');
    vfExample.id = 'vfexample';
    vfExample.classList.add('vfexample');
    vfExample.appendChild(totalDiv);
    vfExample.appendChild(exDropdownDiv);

    flexbox.appendChild(vfExample);

    const addAttributeValueFilterContainer = document.createElement('div');
    addAttributeValueFilterContainer.classList.add('add-filter-button');
    const addAttributeValueFilterButton = document.createElement('button');
    addAttributeValueFilterButton.textContent = '+';
    addAttributeValueFilterContainer.appendChild(addAttributeValueFilterButton);
    addAttributeValueFilterButton.id = 'add-vfilter-'+tabPanelID;
    flexbox.appendChild(addAttributeValueFilterContainer);

    /************** Attribute Value Range Filter components ****************/

    const attributeValueRangeFilterPanel = document.createElement('div');
    const attributeValueRangeFilterBoxesPanel = document.createElement('div');
    attributeValueRangeFilterBoxesPanel.classList.add('value-search-filter-'+tabPanelID);

    attributeValueRangeFilterPanel.classList.add('attr-val-filter');
    const attributeValueRangeFilterlabel = document.createElement('label');
    attributeValueRangeFilterlabel.textContent = "Value Range Filter";
    
    attributeValueRangeFilterlabel.appendChild(divInfoVRF);
    attributeValueRangeFilterPanel.appendChild(attributeValueRangeFilterlabel);

    const attributeValueRangeFilterAttributeInput = document.createElement('input');
    attributeValueRangeFilterAttributeInput.type = 'text';
    attributeValueRangeFilterAttributeInput.classList.add('predicate');
    attributeValueRangeFilterAttributeInput.id = 'vrfpredicate-0';
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
    attributeValueRangeFilterMinInput.id = 'min-val-0';
    attributeValueRangeFilterMinInput.classList.add('min-val');
    attributeValueRangeFilterMinInput.placeholder = 'Min Value';
    divMin.appendChild(attributeValueRangeFilterMinInput);
    attributeValueRangeFilterBoxesPanel.appendChild(divMin);
    
    const divMax = document.createElement('div');
    divMax.classList.add('input-loader-container');
    const attributeValueRangeFilterMaxInput = document.createElement('input');
    attributeValueRangeFilterMaxInput.type = 'text';
    attributeValueRangeFilterMaxInput.id = 'max-val-0';
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

    attributeValueRangeFilterBoxesPanel.appendChild(dropdownDiv);
    attributeValueRangeFilterPanel.appendChild(attributeValueRangeFilterBoxesPanel);

    /***************** add filter for this component *******************/
    const addValueRangeFilterContainer = document.createElement('div');
    addValueRangeFilterContainer.classList.add('add-filter-button');
    const addValueRangeFilterButton = document.createElement('button');
    addValueRangeFilterButton.textContent = '+';
    addValueRangeFilterButton.id = 'add-vrange-filter-'+tabPanelID;
    addValueRangeFilterContainer.appendChild(addValueRangeFilterButton);
    attributeValueRangeFilterPanel.appendChild(addValueRangeFilterContainer);
    // flexbox.appendChild(addValueRangeFilterContainer);
    /*******************************************************************/

    flexbox.appendChild(attributeValueRangeFilterPanel);

    /************** String Match Filter components ****************/

    const stringMatchFilterPanel = document.createElement('div');
    const stringMatchFilterBoxesPanel = document.createElement('div');
    stringMatchFilterBoxesPanel.classList.add('regex-search-filter-'+tabPanelID);

    stringMatchFilterPanel.classList.add('attr-val-filter');
    const stringMatchFilterLabel = document.createElement('label');
    stringMatchFilterLabel.textContent = "String Match Filter";

    stringMatchFilterLabel.appendChild(divInfoSMF);
    stringMatchFilterPanel.appendChild(stringMatchFilterLabel);

    const stringMatchFilterAttributeInput = document.createElement('input');
    stringMatchFilterAttributeInput.type = 'text';
    stringMatchFilterAttributeInput.classList.add('predicate');
    stringMatchFilterAttributeInput.id = 'smfpredicate-0';
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
    stringMatchFilterValueInput.id = 'regex-0';
    stringMatchFilterValueInput.placeholder='Regular expression';

    inputDivRegexPattern.appendChild(stringMatchFilterValueInput);
    stringMatchFilterBoxesPanel.appendChild(inputDivRegexPattern);

    stringMatchFilterPanel.appendChild(stringMatchFilterBoxesPanel);

    /***************** add filter for this component *******************/
    const addRegexFilterContainer = document.createElement('div');
    addRegexFilterContainer.classList.add('add-filter-button');
    const addRegexFilterButton = document.createElement('button');
    addRegexFilterButton.textContent = '+';
    addRegexFilterButton.id = 'add-smatch-filter-'+tabPanelID;
    addRegexFilterContainer.appendChild(addRegexFilterButton);
    stringMatchFilterPanel.appendChild(addRegexFilterContainer);
    // flexbox.appendChild(addValueRangeFilterContainer);
    /*******************************************************************/

    flexbox.appendChild(stringMatchFilterPanel);

    /************** Show Attribute components ****************/

    const showAttributePanel = document.createElement('div');
    showAttributePanel.classList.add('attr-val-filter');

    const showAttributeSectionPanel = document.createElement('div');
    showAttributeSectionPanel.classList.add('show-attribute-section-'+tabPanelID);

    const showAttributeLabel = document.createElement('label');
    showAttributeLabel.textContent = 'Display Property';

    showAttributeLabel.appendChild(divInfoDP);
    showAttributePanel.appendChild(showAttributeLabel);

    const inputContainerDiv = document.createElement('div');
    inputContainerDiv.classList.add('input-loader-container');

    const showAttributeInput = document.createElement('input');
    showAttributeInput.classList.add('predicate');
    showAttributeInput.id = 'dpredicate-0';
    showAttributeInput.type = 'text';
    showAttributeInput.placeholder = 'Property (type for suggestions ...)';

    const hiddenInput3 = document.createElement('input');
    hiddenInput3.type = 'hidden';
    hiddenInput3.classList.add('hidden-uri');

    const loaderDiv3 = document.createElement('div');
    loaderDiv3.classList.add('loader');

    const spanDP = document.createElement('span');
    spanDP.classList.add('search-icon');
    spanDP.textContent = '🔍';    

    inputContainerDiv.appendChild(showAttributeInput);
    inputContainerDiv.appendChild(hiddenInput3);
    inputContainerDiv.appendChild(spanDP);
    inputContainerDiv.appendChild(loaderDiv3);
    
    showAttributeSectionPanel.appendChild(inputContainerDiv);
    showAttributePanel.appendChild(showAttributeSectionPanel);

    flexbox.appendChild(showAttributePanel);

    /************** Limit component ****************/

    const limitPanel = document.createElement('div');
    limitPanel.classList.add('attr-val-filter');
    const limitLabel = document.createElement('label');
    limitLabel.textContent = 'Max # of results';

    limitLabel.appendChild(divInfoLim);
    limitPanel.appendChild(limitLabel);

    const limitInput = document.createElement('input');
    limitInput.type = 'number';
    limitInput.id = 'limit-val-'+tabPanelID;
    limitInput.placeholder = 'Limit';

    limitPanel.appendChild(limitInput);
    flexbox.appendChild(limitPanel);

    /*****************************************************/
    
    mainContent.appendChild(flexbox);
    return mainContent;
}
  
// Function to draw SVG from a string
function drawSvgStringAsElement(svgString, tabPanelID, isToggleButton) {
  if (svgString && svgString.trim().indexOf("<svg") === 0) {
    // No style passed via config, guess own styles
    var parser = new DOMParser();
    var dom = parser.parseFromString(svgString, "text/xml");
    var svg = dom.documentElement;
    svg.setAttribute("aria-hidden", "true");
    if (isToggleButton) {
      svg.classList.add('pulse');
      svg.id = 'rosemaryButton-'+tabPanelID;
    }

    var svgContainer = document.createElement("div");
    svgContainer.className = "svgImg";
    svgContainer.appendChild(svg);
    return svgContainer;
  }
  throw new Error("No svg string given. Cannot draw");
}

// Function to add a class to an element
function addClass(el, ...classNames) {
  if (!el) return;
  for (const className of classNames) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += " " + className;
  }
}

// Function to remove a class from an element
function removeClass(el, className) {
  if (!el) return;
  if (el.classList) el.classList.remove(className);
  else if (hasClass(el, className)) {
    var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
    el.className = el.className.replace(reg, " ");
  }
}
