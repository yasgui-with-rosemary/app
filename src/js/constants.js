const CONSTANTS = {
    EXAMPLE1_QUERY: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> # Get all entities from https://dbpedia.org/sparql ... SELECT ?subject ?showAttributeVal WHERE { # ... with Calcutta as value for birth place ... ?subject <http://dbpedia.org/ontology/birthPlace> <http://dbpedia.org/resource/Calcutta> . # ... with birth date between 1900-01-01 and 1945-01-01 ... ?subject <http://dbpedia.org/ontology/birthDate> ?value . FILTER(?value >= "1900-01-01"^^xsd:date && ?value <= "1945-01-01"^^xsd:date) # ... with name matching the regular expression ^S ... ?subject <http://dbpedia.org/property/name> ?regexValue . FILTER(regex(?regexValue, "^S", "i")) # ... display the spouse values for these entities ... ?subject <http://dbpedia.org/property/spouse> ?showAttributeVal . } LIMIT 20 # Return max 20 results',
    EXAMPLE1_QUERY_DESC: 'People born in Calcutta between 1900-01-01 and 1945-01-01 whose names start with S and their spouses',
    EXAMPLE2_QUERY: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> # Get all entities from https://dbpedia.org/sparql ... SELECT DISTINCT ?subject ?showAttributeVal WHERE { # ... with Roald Dahl as value for author ... ?subject <http://dbpedia.org/property/author> <http://dbpedia.org/resource/Roald_Dahl> . # ... with pages between 100 and 400 ... ?subject <http://dbpedia.org/property/pages> ?value . FILTER(?value >= "100"^^xsd:integer && ?value <= "400"^^xsd:integer) # ... with has abstract matching the regular expression adapt ... ?subject <http://dbpedia.org/ontology/abstract> ?regexValue . FILTER(regex(?regexValue, "adapt", "i")) # ... display the values for these entities ... ?subject <http://dbpedia.org/property/publisher> ?showAttributeVal . } LIMIT 100 # Return max 100 results',
    EXAMPLE2_QUERY_DESC: 'Books by Roald Dahl that are between 100 and 400 pages long that have been adapted as a film or theatre production (the description of the book should contain the word `adapt` in it somewhere indicating a film or theatre adaptation), display also the publishers of these books.',
    ROSEMARY_GITHUB_URL: 'https://github.com/clariah-grlc-sustainability/nosparql-query-builder',
    ROSEMARY_ICON_SVG: '<svg   width="76mm"   height="128mm"   viewBox="0 0 76.00001 128"   version="1.1"   id="svg1"   sodipodi:docname="rosemary-logo-v1-yasgui.svg"   xml:space="preserve"   inkscape:version="1.3.2 (091e20e, 2023-11-25)"   inkscape:export-filename="favicon.png"   inkscape:export-xdpi="6.3499999"   inkscape:export-ydpi="6.3499999"   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"   xmlns="http://www.w3.org/2000/svg"   xmlns:svg="http://www.w3.org/2000/svg"><sodipodi:namedview     id="namedview1"     pagecolor="#ffffff"     bordercolor="#000000"     borderopacity="0.25"     inkscape:showpageshadow="2"     inkscape:pageopacity="0.0"     inkscape:pagecheckerboard="0"     inkscape:deskcolor="#d1d1d1"     inkscape:document-units="mm"     inkscape:zoom="0.82948933"     inkscape:cx="276.07347"     inkscape:cy="281.4985"     inkscape:window-width="1512"     inkscape:window-height="842"     inkscape:window-x="0"     inkscape:window-y="40"     inkscape:window-maximized="0"     inkscape:current-layer="layer1" /><defs     id="defs1"><inkscape:path-effect       effect="spiro"       id="path-effect19"       is_visible="true"       lpeversion="1" /><clipPath       clipPathUnits="userSpaceOnUse"       id="clipPath105"><path         id="path106"         style="fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.264583"         d="M 72.616756,10.914062 V 135.20002 c 2.151184,1.68512 4.451024,3.44295 6.271969,4.81831 2.466472,1.8629 4.944007,3.71109 7.416086,5.56658 1.852334,1.38624 3.69907,2.77984 5.550564,4.16719 V 10.914062 Z m 0,129.699058 v 1.96991 c 0.477803,-0.24021 1.042585,-0.37067 1.671217,-0.36019 0.160335,0.003 0.324503,0.0145 0.492474,0.0357 -0.720966,-0.54889 -1.441831,-1.09695 -2.163691,-1.64538 z m 0,8.26255 v 24.21454 h 14.054955 c -0.03803,-0.26062 0.01968,-0.41746 0.162782,-0.48472 -0.0048,-0.0367 -0.01064,-0.0734 -0.0155,-0.11008 -0.0061,-0.0464 0.0055,-0.0942 0,-0.14056 -5.3e-4,-0.13671 -0.0016,-0.2731 -0.0036,-0.40979 -0.0024,-0.12058 -0.0024,-0.11086 -0.0021,-0.11886 -0.0047,-0.0466 -0.01175,-0.12212 -0.04496,-0.27285 -0.09036,-0.47619 -0.21476,-0.95077 -0.19327,-1.44125 -0.0034,-0.15536 0.0042,-0.0335 -0.0021,-0.11472 -0.01921,-0.13225 -0.04403,-0.26113 -0.08062,-0.39378 -0.09965,-0.34122 -0.203993,-0.68183 -0.280603,-1.02888 -0.09296,-0.3035 -0.151591,-0.51461 -0.22996,-0.82269 -0.163592,-0.29987 -0.32261,-0.60209 -0.447517,-0.92087 -0.212442,-0.52089 -0.427728,-1.04237 -0.605131,-1.57716 -0.202856,-0.62572 -0.384881,-1.25704 -0.517797,-1.9017 -0.09592,-0.38202 -0.1973,-0.77443 -0.27182,-1.15858 -0.04826,-0.27556 -0.168391,-0.45266 -0.234611,-0.68316 -0.230688,-0.56954 -0.413097,-1.15573 -0.634069,-1.7291 -0.188643,-0.59711 -0.467307,-1.15752 -0.698667,-1.73839 -0.155196,-0.39768 -0.267978,-0.64684 -0.380338,-0.82218 -0.147238,-0.22004 -0.296392,-0.44506 -0.474388,-0.64492 -0.354695,-0.37904 -0.687218,-0.77662 -1.053166,-1.14515 -0.387715,-0.42227 -0.910844,-0.70842 -1.312066,-1.11776 -0.570682,-0.48039 -1.176858,-0.91884 -1.774052,-1.36529 -0.732168,-0.55466 -1.494962,-1.06675 -2.223635,-1.62626 -0.693748,-0.54547 -1.387626,-1.09189 -2.027785,-1.70067 -0.261536,-0.24871 -0.496518,-0.49751 -0.710034,-0.74517 z m 14.217737,23.72982 c 0.02109,0.1618 0.04645,0.32302 0.06873,0.48472 H 88.6442 c -0.828524,-0.38101 -1.505149,-0.62788 -1.809707,-0.48472 z m 0.996323,-20.5357 c 0.275513,0.35388 0.533958,0.72113 0.778761,1.09709 0.406673,0.6375 0.713084,1.33214 0.999424,2.02985 0.314214,0.72598 0.61676,1.45367 0.869196,2.204 0.174982,0.39967 0.27736,0.82705 0.448554,1.22731 0.189799,0.49457 0.321103,0.86874 0.474387,1.35496 0.145389,0.48078 0.213561,0.9793 0.357084,1.46038 0.02823,0.13859 0.06425,0.27439 0.09715,0.41134 v -6.76341 c -1.342131,-1.00635 -2.683595,-2.01361 -4.024559,-3.02152 z m -1.957504,15.25126 c -0.01318,-0.0546 0.02143,0.11017 0.03204,0.16537 0.0123,0.0482 0.04036,0.14281 0.06615,0.22376 -0.03069,-0.12159 -0.05281,-0.20096 -0.09818,-0.38913 z m 0.134874,0.48059 c 0.0071,0.0151 0.02236,0.0634 0.02223,0.0496 0.01802,0.0309 0.07155,0.1238 0.05426,0.0925 -0.02603,-0.0471 -0.05061,-0.0949 -0.07648,-0.14211 z" /></clipPath><clipPath       clipPathUnits="userSpaceOnUse"       id="clipPath128"><path         id="path129"         style="fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.264583"         d="M 80.736673,26.718784 V 69.65828 c 0.02413,-6.3e-5 0.04828,1.72e-4 0.07235,0 0.03137,-2.64e-4 0.06268,-0.0011 0.09405,-0.0016 0.04692,-0.02978 0.0464,-0.02373 0.108521,-0.06925 -0.02895,0.02096 0.01471,-0.0095 0.04341,-0.02946 7.94e-4,-5.29e-4 0.0013,-0.0011 0.0021,-0.0016 0.0056,-0.0045 0.0037,-0.0024 0.0062,-0.0041 5.29e-4,-5.29e-4 7.94e-4,-2.65e-4 0.0016,-0.0011 0.0031,-0.003 0.0013,-0.0021 0.0057,-0.0062 0.03227,-0.03469 0.08022,-0.09002 0.131776,-0.149862 0.06938,-0.07355 0.136702,-0.148664 0.207221,-0.221176 0.07531,-0.07962 0.15371,-0.156213 0.236678,-0.227894 0.08618,-0.079 0.163198,-0.167616 0.248047,-0.248047 0.09756,-0.09564 0.195707,-0.190423 0.288356,-0.290938 0.0963,-0.104428 0.189503,-0.21168 0.282152,-0.319357 0.08248,-0.09705 0.16601,-0.193239 0.241329,-0.296109 0.07065,-0.102589 0.138263,-0.206613 0.199472,-0.315224 0.0753,-0.121174 0.150606,-0.24247 0.232026,-0.35967 0.08785,-0.132731 0.174456,-0.266514 0.272336,-0.392223 0.119139,-0.149265 0.246935,-0.291201 0.380338,-0.427882 0.122997,-0.126373 0.249529,-0.248915 0.377238,-0.37052 0.08312,-0.07834 0.169127,-0.154077 0.248047,-0.236677 0.06073,-0.06526 0.119634,-0.131768 0.175183,-0.201539 0.06938,-0.08298 0.140195,-0.165073 0.205155,-0.251664 0.05361,-0.07054 0.107345,-0.141398 0.147794,-0.220657 0.0036,-0.0064 0.0036,-0.0055 0.0057,-0.0088 v -0.09508 c 0,-0.509863 0.257696,-0.764813 0.515215,-0.764813 0.04775,0 0.0955,0.0088 0.141592,0.02635 -0.0236,-0.04456 -0.04884,-0.08834 -0.06718,-0.135393 h -5.29e-4 c -0.219946,-0.564097 0.01696,-0.923748 0.329697,-0.926557 0.213979,-0.0019 0.463447,0.163472 0.626835,0.544152 0.01683,0.03921 0.01683,0.04003 0.04082,0.07907 0.04301,0.07457 0.07821,0.153011 0.109554,0.233061 0.01632,0.04683 0.03631,0.09221 0.05323,0.139009 0.0047,0.01334 0.009,0.02678 0.01291,0.04031 0.04205,0.06474 0.06785,0.1353 0.08992,0.215492 0.01217,0.06212 0.01312,0.125587 0.01394,0.188619 5.29e-4,0.04439 5.29e-4,0.08842 5.29e-4,0.132808 1.1e-5,0.0069 0,0.01378 0,0.02066 0.992436,0.09759 0.895332,1.114689 -0.112654,1.022675 -0.0409,-0.0037 -0.08183,-0.008 -0.121957,-0.01704 -0.0411,-0.0095 -0.08074,-0.02233 -0.119891,-0.03669 0.0011,2.65e-4 -0.0011,-5.29e-4 -0.0088,-0.0036 0.01426,0.0032 0.05726,0.01201 0.04289,0.0093 -0.01728,-0.0032 -0.03416,-0.0075 -0.05116,-0.01188 h -5.29e-4 c -0.06446,-0.01651 -0.126731,-0.04031 -0.184486,-0.0739 -0.01339,-0.0081 -0.02743,-0.01595 -0.04031,-0.02479 -0.0091,-0.0063 0.03804,0.02336 0.02894,0.01704 -0.06355,-0.04375 -0.121742,-0.0874 -0.171563,-0.143143 -0.05096,-0.0333 -0.09747,-0.08052 -0.138494,-0.137977 -0.02273,0.06914 -0.05305,0.136324 -0.08785,0.201538 -0.06556,0.125712 -0.148596,0.240319 -0.234096,0.352952 -0.07388,0.09907 -0.154908,0.192677 -0.233577,0.287837 -0.06739,0.08418 -0.139081,0.164365 -0.212391,0.243396 -0.09361,0.100153 -0.195898,0.191791 -0.295588,0.285771 -0.11635,0.111421 -0.233172,0.222687 -0.345199,0.338479 -0.108889,0.112718 -0.215654,0.227692 -0.312642,0.350882 -0.07877,0.102989 -0.148643,0.21185 -0.220141,0.319879 -0.07591,0.108971 -0.145989,0.221557 -0.216009,0.334346 -0.06941,0.122526 -0.146005,0.240646 -0.225824,0.356568 -0.09432,0.131996 -0.200023,0.254733 -0.304893,0.378273 -0.100843,0.118025 -0.203226,0.234778 -0.307991,0.349332 -0.104529,0.113924 -0.215905,0.221358 -0.326078,0.329694 -0.08872,0.08762 -0.174093,0.178258 -0.264583,0.264068 -0.06745,0.0582 -0.131672,0.119229 -0.192754,0.183967 -0.0082,0.0085 -0.01614,0.01728 -0.02429,0.02585 H 118.78086 V 26.718784 Z m 5.908167,37.341905 c 0.0039,0.0062 0.0036,0.0052 0.0072,0.01085 0.0016,0.0016 0.003,0.0035 0.0047,0.0052 -0.0024,-0.0033 -0.0045,-0.0064 -0.0072,-0.0098 -0.0016,-0.0021 -0.0061,-0.0084 -0.0047,-0.0062 z m 0.0186,0.02894 c 0.01326,0.0208 0.02127,0.03268 0.02997,0.04599 -0.0021,-0.0044 -0.0038,-0.0085 -0.0062,-0.01291 -7.94e-4,-0.0013 -0.0019,-0.0028 -0.0026,-0.0041 -0.0011,-0.0016 -0.0016,-0.0026 -0.0026,-0.0041 -0.006,-0.0085 -0.01243,-0.01667 -0.0186,-0.02479 z m 0.05426,0.07906 c 7.94e-4,0.0026 0.0013,0.0052 0.0021,0.0078 0.01871,0.02732 0.01447,0.01876 -0.0021,-0.0078 z" /></clipPath></defs><g     inkscape:label="Layer 1"     inkscape:groupmode="layer"     id="layer1"     transform="translate(-3.6917443,-2.9399802)"><path       style="fill:#55ad9b;fill-opacity:1;stroke-width:0.260086"       id="path7"       d="m 91.230211,173.0903 c -0.495888,-2.62494 -1.361317,-5.1159 -2.135835,-7.6328 -2.045145,-6.86786 -3.940693,-13.80634 -5.530782,-20.84883 C 82.136007,138.28592 81.449945,134.439 80.202249,127.97103 78.061386,115.8752 76.784312,103.58962 75.773332,91.292621 75.196409,84.275231 74.702199,77.15412 74.544745,70.098673 c -0.06612,-2.962854 7.11e-4,-5.927848 9.86e-4,-8.89177 0.263221,-8.721102 0.994097,-17.527472 3.398473,-25.816951 1.090602,-3.760013 1.767393,-5.110534 3.212786,-8.550839 2.030346,-4.398011 4.531379,-8.494605 7.78566,-11.679922 0.81518,-0.695189 1.662476,-1.53572 2.676695,-1.749204 0.173828,-0.0096 0.09521,-0.01467 0.236121,0.0056 0,0 -2.896216,-2.501323 -2.896216,-2.501323 v 0 c -0.158094,0.04155 -0.07169,0.01657 -0.25863,0.07768 -0.986993,0.410918 -1.809683,1.246076 -2.606409,2.030182 -3.115219,3.410324 -5.535016,7.5947 -7.450178,12.098475 -1.254527,3.220372 -2.137348,5.256775 -3.080733,8.706752 -2.307919,8.440097 -2.837732,17.375129 -2.946379,26.199508 0.05397,3.001478 0.04633,6.005483 0.161893,9.004437 0.288725,7.492813 0.844858,13.898347 1.528881,21.387267 0.588536,6.443487 1.810076,18.552915 2.533237,24.903255 0.437847,3.84491 0.941199,7.67858 1.411796,11.51787 1.165037,6.47932 1.780671,10.15658 3.089308,16.4961 1.426768,6.91181 3.123649,13.73504 4.912871,20.52155 0.653767,2.43081 1.374703,4.84809 1.791553,7.35905 z"       clip-path="url(#clipPath105)"       transform="matrix(1.0456018,0,0,0.90952615,-42.544939,-3.5501361)" /><circle       id="path15"       style="fill:#1a1a1a;stroke:#000000;stroke-width:0.1;stroke-dasharray:none"       cx="212.09763"       cy="43.118053"       r="0.080385938" /><circle       id="path16"       style="fill:#1a1a1a;stroke:#000000;stroke-width:0.065;stroke-dasharray:none"       cx="113.09808"       cy="103.15649"       r="0.016077187" /><circle       id="path17"       style="fill:#1a1a1a;stroke:#000000;stroke-width:0.264583;stroke-dasharray:none"       cx="186.86871"       cy="42.479347"       r="0.010450171" /><path       style="fill:#55ad9b;fill-opacity:1;stroke-width:0.209499;stroke-dasharray:none"       d="m 36.62253,88.787943 c 0,0 -17.064086,-14.44111 -26.6344181,-41.09988 C 0.41776286,21.0293 36.62253,88.787943 36.62253,88.787943 Z"       id="path19" /><path       style="fill:#55ad9b;fill-opacity:1;stroke-width:0.244529;stroke-dasharray:none"       d="m 36.585469,90.292709 c 0,0 23.247654,-14.44111 36.286029,-41.099876 C 85.909886,22.53407 36.585469,90.292709 36.585469,90.292709 Z"       id="path19-9" /><path       style="fill:#55ad9b;fill-opacity:1;stroke-width:0.201552;stroke-dasharray:none"       d="m 40.00005,108.7236 c 0,0 19.537515,-11.674096 30.495058,-33.224854 C 81.452686,53.947999 40.00005,108.7236 40.00005,108.7236 Z"       id="path19-1" /><path       style="fill:#55ad9b;fill-opacity:1;stroke-width:0.196314;stroke-dasharray:none"       d="m 39.555612,109.11296 c 0,0 -17.550388,-11.671254 -29.030544,-35.151179 -11.48016314,-23.479954 29.030544,35.151179 29.030544,35.151179 z"       id="path19-4" /><path       style="fill:#55ad9b;fill-opacity:1;stroke-width:0.345989;stroke-dasharray:none"       d="M 25.684525,11.011415 C 27.865741,51.595422 41.985639,89.158671 27.865741,51.595422 13.745846,14.032207 25.684525,11.011415 25.684525,11.011415 Z"       id="path23-5" /><path       style="fill:#55ad9b;fill-opacity:1;stroke-width:0.219312;stroke-dasharray:none"       d="M 86.629422,64.519346 C 110.68279,15.703821 136.9228,17.648664 101.53853,50.516485 66.154259,83.384312 86.629422,64.519346 86.629422,64.519346 Z"       id="path119"       clip-path="url(#clipPath128)"       transform="matrix(1,0,0,1.2573041,-52.047592,-13.493645)" /></g></svg>',
    DEFAULT_LANGUAGE: 'en',
    SUGGESTIONS_PER_PAGE: 30 // Number of suggestions for autocomplete dropdown page
};

const TEMPLATE_QUERIES = {
    HEADER: (endpoint) => `        
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
    # Get all entities from ${endpoint} ...
    SELECT DISTINCT ?subject`,
    PREDICATE: (regex_str, limit, offset) => `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?predicate ?label WHERE {
        ?predicate a rdf:Property .
        ?predicate rdfs:label ?label .
        FILTER (lang(?label) = 'en')
        FILTER(regex(?label, '${regex_str}', 'i'))
    }
    LIMIT ${limit}
    OFFSET ${offset}
    `,
    OBJECT: (regex_str, limit, offset) => `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?object ?label WHERE {
        ?object rdfs:label ?label .
        FILTER (lang(?label) = 'en')
        FILTER(regex(?label, '${regex_str}', 'i'))
    }
    LIMIT ${limit}
    OFFSET ${offset}
    `
}

const EXAMPLE_QUERIES = {
    'example1' : {
        TITLE: 'DBpedia: Born in Calcutta ...',
        VF_PREDICATE: 'birthPlace',
        VF_PREDICATE_HIDDEN: 'http://dbpedia.org/ontology/birthPlace',
        VF_OBJECT: 'Calcutta',
        VF_OBJECT_HIDDEN: 'http://dbpedia.org/resource/Calcutta',
        VRF_PREDICATE: 'birthDate',
        VRF_PREDICATE_HIDDEN: 'http://dbpedia.org/ontology/birthDate',
        VRF_MIN: '1900-01-01',
        VRF_MAX: '1945-01-01',
        DTYPE: 'xsd:date',
        SMF_PREDICATE: 'name',
        SMF_PREDICATE_HIDDEN: 'http://dbpedia.org/property/name',
        SMF_REGEX: '^S',
        DP_PREDICATE: 'spouse',
        DP_PREDICATE_HIDDEN: 'http://dbpedia.org/property/spouse',
        LIMIT: '20',
        QUERY: `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 
    
    # Get all entities from https://dbpedia.org/sparql ... 
    SELECT ?subject ?showAttributeVal WHERE { 
    
    # ... with Calcutta as value for birth place ... 
    ?subject <http://dbpedia.org/ontology/birthPlace> <http://dbpedia.org/resource/Calcutta> . 
    
    # ... with birth date between 1900-01-01 and 1945-01-01 ... 
    ?subject <http://dbpedia.org/ontology/birthDate> ?value . 
    FILTER(?value >= "1900-01-01"^^xsd:date && ?value <= "1945-01-01"^^xsd:date) 
    
    # ... with name matching the regular expression ^S ... 
    ?subject <http://dbpedia.org/property/name> ?regexValue . 
    FILTER(regex(?regexValue, "^S", "i")) 
    
    # ... display the spouse values for these entities ... 
    ?subject <http://dbpedia.org/property/spouse> ?showAttributeVal . 
    
    } 
    
    LIMIT 20 # Return max 20 results
        `,
        DESC: 'People born in Calcutta between 1900-01-01 and 1945-01-01 whose names start with S and their spouses'
    },

    'example2' : {
        TITLE: `DBpedia: Roald Dahl books ...`,
        VF_PREDICATE: 'author',
        VF_PREDICATE_HIDDEN: 'http://dbpedia.org/property/author',
        VF_OBJECT: 'Roald Dahl',
        VF_OBJECT_HIDDEN: 'http://dbpedia.org/resource/Roald_Dahl',
        VRF_PREDICATE: 'pages',
        VRF_PREDICATE_HIDDEN: 'http://dbpedia.org/property/pages',
        VRF_MIN: '100',
        VRF_MAX: '400',
        DTYPE: 'xsd:integer',
        SMF_PREDICATE: 'has abstract',
        SMF_PREDICATE_HIDDEN: 'http://dbpedia.org/ontology/abstract',
        SMF_REGEX: 'adapt',
        DP_PREDICATE: 'publisher',
        DP_PREDICATE_HIDDEN: 'http://dbpedia.org/property/publisher',
        LIMIT: '100',
        QUERY : `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 
    
    # Get all entities from https://dbpedia.org/sparql ... 
    SELECT DISTINCT ?subject ?showAttributeVal WHERE { 
    
    # ... with Roald Dahl as value for author ... 
    ?subject <http://dbpedia.org/property/author> <http://dbpedia.org/resource/Roald_Dahl> .
    
    # ... with pages between 100 and 400 ... 
    ?subject <http://dbpedia.org/property/pages> ?value . 
    FILTER(?value >= "100"^^xsd:integer && ?value <= "400"^^xsd:integer) 
    
    # ... with has abstract matching the regular expression adapt ... 
    ?subject <http://dbpedia.org/ontology/abstract> ?regexValue . 
    FILTER(regex(?regexValue, "adapt", "i")) 
    
    # ... display the values for these entities ... 
    ?subject <http://dbpedia.org/property/publisher> ?showAttributeVal . 
    
    } 
    
    LIMIT 100 # Return max 100 results
        `,
        DESC: 'Books by Roald Dahl that are between 100 and 400 pages long that have been adapted as a film or theatre production (the description of the book should contain the word `adapt` in it somewhere indicating a film or theatre adaptation), display also the publishers of these books.'
    },

    'example3' : {
        TITLE: `DBpedia: Tom Cruise movies ...`,
        VF_PREDICATE: 'starring',
        VF_PREDICATE_HIDDEN: 'http://dbpedia.org/ontology/starring',
        VF_OBJECT: 'Tom Cruise',
        VF_OBJECT_HIDDEN: 'http://dbpedia.org/resource/Tom_Cruise',
        VRF_PREDICATE: 'runtime (s)',
        VRF_PREDICATE_HIDDEN: 'http://dbpedia.org/ontology/runtime',
        VRF_MIN: '0',
        VRF_MAX: '6000',
        DTYPE: 'xsd:double',
        SMF_PREDICATE: 'has abstract',
        SMF_PREDICATE_HIDDEN: 'http://dbpedia.org/ontology/abstract',
        SMF_REGEX: 'Oscar',
        DP_PREDICATE: 'film director',
        DP_PREDICATE_HIDDEN: 'http://dbpedia.org/ontology/director',
        LIMIT: '100',
        QUERY : `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
    # Get all entities from https://dbpedia.org/sparql ...
    SELECT DISTINCT ?subject ?showAttributeVal WHERE {

    # ... with Tom Cruise as value for starring ...
    ?subject <http://dbpedia.org/ontology/starring> <http://dbpedia.org/resource/Tom_Cruise> .
    
    # ... with runtime (s) between 0 and 6000 ...
    ?subject <http://dbpedia.org/ontology/runtime> ?value .
    FILTER(?value >= "0"^^xsd:double && ?value <= "6000"^^xsd:double)
    
    # ... with has abstract matching the regular expression Oscar ... 
    ?subject <http://dbpedia.org/ontology/abstract> ?regexValue .
    FILTER(regex(?regexValue, "Oscar", "i"))
    
    # ... display the film director values for these entities ...
    ?subject <http://dbpedia.org/ontology/director> ?showAttributeVal .

    }

    LIMIT 100 # Return max 100 results
        `,
        DESC: 'Short movies (less than 100 minutes long) starring Tom Cruise that have been associated with Oscars, also display their directors'
    }
}
  