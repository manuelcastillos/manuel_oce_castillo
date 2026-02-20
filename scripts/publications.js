
const publicationsData = [
    { authors: "Garcés-Vargas, José; Piñones, Andrea; Schneider, Wolfgang; Landaeta, Mauricio F; Castillo, Manuel I; Cisternas, Natalia; Barrios-Guzmán, Carmen; Barilari, Fernanda", title: "Seasonal dynamics and forcing mechanisms of the Cape Horn Current: insights from reanalysis data and hydrographic observations", journal: "Progress in Oceanography", year: "2026", url: "https://doi.org/10.1016/j.pocean.2025.103665" },
    { authors: "Cisternas, Natalia; Garcés-Vargas, José; Castillo, Manuel I; Barrios-Guzmán, Carmen; Barilari, Fernanda; Landaeta, Mauricio F; Sepúlveda, Maritza; Piñones, Andrea", title: "Salinity variability in the mixed layer off Chilean Patagonia: potential influence of Patagonian ice fields", journal: "Progress in Oceanography", year: "2026", url: "https://doi.org/10.1016/j.pocean.2025.103653" },
    { authors: "Díaz-Astudillo, Macarena; Castillo, Manuel I; Figueroa, Pedro A; Castro, Leonardo R; Riquelme-Bugueño, Ramiro; Pérez-Santos, Iván; Pizarro, Oscar; Saldías, Gonzalo S", title: "Cross-canyon variability in zooplankton backscattering strength in a river-influenced upwelling area", journal: "Ocean Science", year: "2025", url: "https://doi.org/10.5194/os-21-1833-2025" },
    { authors: "Rodríguez-Stepke, Benjamín; Morales, Claudia; Castillo, Manuel I; Rodríguez, Ángela; Cárdenas, César A; La Mesa, Mario; Hüne, Mathias; Landaeta, Mauricio F", title: "Coastal zooplankton in the Palmer Archipelago, Western Antarctica Peninsula: Influence of environmental conditions at short-term scale during austral summer", journal: "Journal of Marine Systems", year: "2025", url: "https://doi.org/10.1016/j.jmarsys.2025.104047" },
    { authors: "Segovia-Jara, Tamara; Benítez, Hugo A; Castillo, Manuel I; La Mesa, Mario; Morales-Garrido, Claudia; Rodríguez-Stepke, Benjamín; Cárdenas, César A; Landaeta, Mauricio F", title: "Out in the Cold: The ignored influence of glacial melting on Rhincalanus gigas and R. nasutus (Copepoda, Calanoida) morphology in Antarctic waters", journal: "Marine Environmental Research", year: "2025", url: "https://doi.org/10.1016/j.marenvres.2025.107546" },
    { authors: "Castillo, Manuel I; Zuñiga, Constanza; Barrios-Guzmán, Carmen; Cisternas, Natalia; Garces-Vargas, José; Landaeta, Mauricio F; Piñones, Andrea; Rojas-Celis, Marcela; Guerrero, Alicia I; Sepúlveda, Maritza", title: "The answer is blowing in the wind: seasonal hydrography and mixing of the inner sea of Tierra del Fuego, Southern Patagonia", journal: "EGUsphere", year: "2025", url: "https://doi.org/10.5194/egusphere-2025-5692" },
    { authors: "Rojas-Celis, Marcela; Castillo, Manuel I; Pérez-Santos, Iván; Barrios-Guzmán, Carmen; Garcés-Vargas, José; Guerrero, Alicia; Landaeta, Mauricio F; Piñones, Andrea; Sepúlveda, Maritza", title: "Turbulent Mixing in Patagonian Fjords and Channels", journal: "EGUsphere", year: "2025", url: "https://doi.org/10.5194/egusphere-2025-5846" },
    { authors: "Landaeta, Mauricio F; Pareja, Matías; Hüne, Mathias; Zenteno‐Devaud, Lisette; Vera‐Duarte, Javier; Bernal‐Durán, Valentina; Castillo, Manuel I; La Mesa, Mario", title: "Morphology and diet are decoupled in nearshore notothenoids from King George Island, West Antarctica", journal: "Journal of Fish Biology", year: "2024", url: "https://doi.org/10.1111/jfb.15651" },
    { authors: "Linford, Pamela; Pérez-Santos, Iván; Montero, Paulina; Díaz, Patricio A; Aracena, Claudia; Pinilla, Elías; Barrera, Facundo; Castillo, Manuel; Alvera-Azcárate, Aida; Alvarado, Mónica", title: "Oceanographic processes driving low-oxygen conditions inside Patagonian fjords", journal: "Biogeosciences", year: "2024", url: "https://doi.org/10.5194/bg-21-1433-2024" },
    { authors: "López‐Soto, Erika; Ord, Gillian; Castillo, Manuel I; Plaza, Guido; Cáceres, Mario A; González, María Teresa; Sepúlveda, Maritza; Guerrero, Alicia I; Piñones, Andrea; Landaeta, Mauricio F", title: "Influence of coastal oceanography on early life history traits of larval Patagonian sprat, Sprattus fuegensis along southeastern Pacific Ocean", journal: "Fisheries Oceanography", year: "2024", url: "https://doi.org/10.1111/fog.12690" },
    { authors: "Orrego, Fernanda S; Benítez, Hugo A; Castillo, Manuel I; Cumplido, Nicolás; Fabres, Alejandra; Figueroa-González, Yanara; Morales, Claudia; Zavala-Muñoz, Francisca; Landaeta, Mauricio F", title: "Morphospace of lanternfish larvae and their interplay with oceanographic conditions from the southeastern Pacific Ocean", journal: "Deep Sea Research Part I: Oceanographic Research Papers", year: "2024", url: "https://doi.org/10.1016/j.dsr.2024.104413" },
    { authors: "Salcedo-Castro, Julio; Olita, Antonio; Saavedra, Freddy; Castillo, Manuel; Saldías, Gonzalo S; Cruz-Gómez, Raúl", title: "Modelling the interannual variability of Maipo and Rapel river plumes off central Chile", journal: "EGUsphere", year: "2023", url: "https://doi.org/10.5194/egusphere-2023-98" },
    { authors: "Landaeta, Mauricio F; Hernández-Santoro, Carola; Search, Francesca V; Castillo, Manuel I; Bernal, Claudio; Navarrete, Sergio A; Wieters, Evie A; Beldade, Ricardo; Navarro Campoi, Ana; Pérez-Matus, Alejandro", title: "Spatio-temporal patterns of the crustacean demersal fishery discard from the south Humboldt Current System, based on scientific observer program (2014–2019)", journal: "Plos One", year: "2023", url: "" },
    { authors: "Landaeta, Mauricio F; Paredes, Lissette D; Castillo, Manuel I; González, M Teresa", title: "Spatio‐temporal patterns of ichthyoplankton in southern Chilean Patagonia: β‐diversity and associated environmental factors", journal: "Fisheries Oceanography", year: "2023", url: "https://doi.org/10.1111/fog.12633" },
    { authors: "Linford, Pamela; Pérez-Santos, Iván; Montero, Paulina; Díaz, Patricio; Aracena, Claudia; Pinilla, Elías; Barrera, Facundo; Castillo, Manuel; Alvera-Azcárate, Aida; Alvarado, Mónica", title: "Oceanographic processes favoring deoxygenation inside Patagonian fjords", journal: "EGUsphere", year: "2023", url: "" },
    { authors: "Landaeta, Mauricio F; Gómez, Anakaren; Contreras, Jorge E; Figueroa-González, Yanara; Pinilla, Elías; Reche, Pablo; Castillo, Manuel I; Plaza, Guido", title: "Linking shape and growth in young-of-the-year rockfish: an ecological carry-over effect?", journal: "Marine Biology", year: "2023", url: "https://doi.org/10.1007/s00227-023-04245-y" },
    { authors: "Castillo, Manuel; Mathew, Dayana; Karmel, Moehammad Ediyan Raza", title: "Ocean and Climate Synergies: From Ocean Warming to Rising Sea Levels", journal: "United Nations ESCAP", year: "2022", url: "https://hdl.handle.net/20.500.12870/4636" },
    { authors: "Molina-Valdivia, Víctor; Bustos, Claudia A; Castillo, Manuel I; Search, Francesca V; Plaza, Guido; Landaeta, Mauricio F", title: "Oceanographic influences on the early life stages of a mesopelagic fish across the Chilean Patagonia", journal: "Progress in Oceanography", year: "2021", url: "https://doi.org/10.1016/j.pocean.2021.102572" },
    { authors: "Molina-Valdivia, Victor; Landaeta, Mauricio F; Castillo, Manuel I; Alarcón, Darly; Plaza, Guido", title: "Short-term variations in the early life history traits of common sardine Strangomera bentincki and anchoveta Engraulis ringens off central Chile", journal: "Fisheries Research", year: "2020", url: "https://doi.org/10.1016/j.fishres.2019.105460" },
    { authors: "Pinilla, Elías; Castillo, Manuel I; Pérez-Santos, Iván; Venegas, Oliver; Valle-Levinson, Arnoldo", title: "Water age variability in a Patagonian fjord", journal: "Journal of Marine Systems", year: "2020", url: "https://doi.org/10.1016/j.jmarsys.2020.103376" },
    { authors: "Galeano‐Chavarria, Ana María; Landaeta, Mauricio F; Plaza, Guido; Castillo, Manuel I; Alarcón, Darly S", title: "Environmental determinants in morphospace and diet of the larval blenny Calliclinus geniguttatus from an upwelling ecosystem", journal: "Journal of Fish Biology", year: "2020", url: "https://doi.org/10.1111/jfb.14539" },
    { authors: "Díaz-Astudillo, Macarena; Landaeta, Mauricio F; Bernal-Durán, Valentina; Castillo, Manuel I; Alvarado-Niño, Mónica; Alarcón, Darly", title: "The influence of regional and local oceanography in early stages of marine fishes from temperate rocky reefs", journal: "Marine Biology", year: "2019", url: "https://doi.org/10.1007/s00227-019-3490-6" },
    { authors: "Landaeta, Mauricio F; Bernal-Durán, Valentina; Castillo, Manuel I; Díaz-Astudillo, Macarena; Fernández-General, Bastián; Núñez-Acuña, Pilar", title: "Nearshore environmental conditions influence larval growth and shape changes for a temperate rocky reef fish", journal: "Hydrobiologia", year: "2019", url: "https://doi.org/10.1007/s10750-019-03998-x" },
    { authors: "Rodríguez-Valentino, Camilo; Landaeta, Mauricio F; Plaza, Guido; Cubillos, Luis A; Castillo, Manuel I", title: "Early life history traits of common sardine, Strangomera bentincki species: estimated by otolith microstructure analysis", journal: "Journal of Sea Research", year: "2018", url: "https://doi.org/10.1016/j.seares.2018.09.006" },
    { authors: "Pérez-Santos, Iván; Castro, Leonardo; Ross, Lauren; Niklitschek, Edwin; Mayorga, Nicolás; Cubillos, Luis; Gutierrez, Mariano; Escalona, Eduardo; Castillo, Manuel; Alegría, Nicolás", title: "Turbulence and hypoxia contribute to dense biological scattering layers in a Patagonian fjord system", journal: "Ocean Science", year: "2018", url: "https://doi.org/10.5194/os-14-1185-2018" },
    { authors: "Castillo, Manuel I.; Pizarro, Oscar; Ramirez, Nadin; Caceres, Mario", title: "Seiche excitation in a highly stratified fjord of southern Chile: the Reloncaví fjord", journal: "Ocean Science", year: "2017", url: "https://doi.org/10.5194/os-13-145-2017" },
    { authors: "Contreras, Jorge E; Rodriguez‐Valentino, Camilo; Landaeta, Mauricio F; Plaza, Guido; Castillo, Manuel I; Alvarado‐Niño, Mónica", title: "Growth and mortality of larval anchoveta in northern Chile during winter and their relationship with coastal hydrographic conditions", journal: "Fisheries Oceanography", year: "2017", url: "https://doi.org/10.1111/fog.12221" },
    { authors: "Díaz-Astudillo, Macarena; Castillo, Manuel I; Cáceres, Mario A; Plaza, Guido; Landaeta, Mauricio F", title: "Oceanographic and lunar forcing affects nearshore larval fish assemblages from temperate rocky reefs", journal: "Marine Biology Research", year: "2017", url: "https://doi.org/10.1080/17451000.2017.1335874" },
    { authors: "Castillo, M. I.; Cifuentes, U.; Pizarro, O.; Djurfeldt, L.; Cáceres, M.", title: "Seasonal hydrography and surface outflow in a fjord with a deep sill: the Reloncaví fjord, Chile", journal: "Ocean Science", year: "2016", url: "https://doi.org/10.5194/os-12-533-2016" },
    { authors: "Pizarro, Oscar; Ramírez, Nadin; Castillo, Manuel I; Cifuentes, Ursula; Rojas, Winston; Pizarro-Koch, Matias", title: "Underwater glider observations in the oxygen minimum zone off central Chile", journal: "Bulletin of the American Meteorological Society", year: "2016", url: "https://doi.org/10.1175/BAMS-D-14-00262.1" },
    { authors: "Tapia Jorquera, Fabián; Castillo Silva, Manuel Ignacio; Wieters Buchanan, Evie Ann; Navarrete, Sergio", title: "Latitudinal Discontinuity in Thermal Conditions along the Nearshore of Central-Northern Chile", journal: "PLoS One", year: "2014", url: "https://doi.org/10.1371/journal.pone.0110841" },
    { authors: "Castillo, Manuel I; Pizarro, Oscar; Cifuentes, Ursula; Ramirez, Nadin; Djurfeldt, Leif", title: "Subtidal dynamics in a deep fjord of southern Chile", journal: "Continental Shelf Research", year: "2012", url: "https://doi.org/10.1016/j.csr.2012.08.019" },
    { authors: "Venegas, RM; Giovannoni, S; Ulloa, O; Barth, JA; Chan, F; Lange, C; Farias, L; Mix, AC; Revsbech, NP; Pizarro, O", title: "Microbial Initiative in Low Oxygen areas off Concepcion and Oregon(MI_LOCO)", journal: "Proceedings from the 2010 AGU Ocean Sciences Meeting", year: "2010", url: "https://agu.confex.com/agu/os10/webprogram/Paper6978.html" },
    { authors: "Tapia, Fabián J; Navarrete, Sergio A; Castillo, Manuel; Menge, Bruce A; Castilla, Juan C; Largier, John; Wieters, Evie A; Broitman, Bernardo L; Barth, John A", title: "Thermal indices of upwelling effects on inner-shelf habitats", journal: "Progress in Oceanography", year: "2009", url: "https://doi.org/10.1016/j.pocean.2009.07.039" },
    { authors: "Aiken, Christopher M; Castillo, Manuel I; Navarrete, Sergio A", title: "A simulation of the Chilean Coastal Current and associated topographic upwelling near Valparaíso, Chile", journal: "Continental Shelf Research", year: "2008", url: "https://doi.org/10.1016/j.csr.2008.06.012" },
    { authors: "Aiken, Christopher M; Navarrete, Sergio A; Castillo, Manuel I; Castilla, Juan Carlos", title: "Along-shore larval dispersal kernels in a numerical ocean model of the central Chilean coast", journal: "Marine Ecology Progress Series", year: "2007", url: "https://doi.org/10.3354/meps339013" },
    { authors: "Cáceres, Mario; Valle-Levinson, Arnoldo; Fierro, Juan; Bello, Mónica; Castillo, Manuel", title: "Características del flujo residual en canales pulluche y chacabuco", journal: "Ciencia y Tecnología del Mar", year: "2007", url: "http://www.shoa.cl/servicios/cimar/resultados/cimar8/articulo3.pdf" },
    { authors: "Salinas, Sergio; Castillo, Manuel; Fierro, Juan; Letelier, Jaime", title: "Control hidráulico y efecto del viento sobre el flujo en la constricción de Meninea", journal: "Ciencia y Tecnología del Mar", year: "2007", url: "http://www.shoa.cl/servicios/cimar/resultados/cimar8/articulo5.pdf" },
    { authors: "Molinet, Carlos; Valle-Levinson, Arnoldo; Moreno, Carlos A; Cáceres, Mario; Bello, Mónica; Castillo, Manuel", title: "Effects of sill processes on the distribution of epineustonic competent larvae in a stratified system of Southern Chile", journal: "Marine Ecology Progress Series", year: "2006", url: "https://doi.org/10.3354/meps324095" },
    { authors: "Cáceres, Mario; Valle-Levinson, Arnoldo; Molinet, Carlos; Castillo, Manuel; Bello, Monica; Moreno, Carlos", title: "Lateral variability of flow over a sill in a channel of southern Chile", journal: "Ocean Dynamics", year: "2006", url: "https://doi.org/10.1007/s10236-006-0062-8" },
    { authors: "Castillo, Manuel; Bello, Mónica; Reyes, Hernán; Guerrero, Yenny", title: "Patrones de corrientes y distribución vertical de temperatura y salinidad en la entrada oceánica del canal Darwin en invierno y primavera de 2002", journal: "Ciencia y Tecnología del Mar", year: "2006", url: "http://www.shoa.cl/servicios/cimar/resultados/cimar8/articulo2.pdf" },
    { authors: "Castillo, Manuel; Valenzuela, Claudia", title: "Circulation regime in the austral Chilean channels and fjords", journal: "Avances en el conocimiento oceanográfico de las aguas interiores chilenas", year: "2006", url: "" },
    { authors: "Valle–Levinson, A; Schneider, W; Sobarzo, M; Bello, M; Bravo, L; Castillo, M; Duarte, L; Fuenzalida, R; Gallegos, JM; Garcés–Vargas, J", title: "Wind-induced exchange at the entrance to Concepción Bay, an equatorward facing embayment in central Chile", journal: "Deep Sea Research Part II: Topical Studies in Oceanography", year: "2004", url: "https://doi.org/10.1016/j.dsr2.2004.09.014" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Check for either the index list or the full page list
    const publicationsList = document.getElementById('publications-list') || document.getElementById('publications-list-full');
    const pubCountElement = document.getElementById('pub-count');

    const renderPublications = () => {
        const lang = (window.i18n && window.i18n.currentLang) || 'es';

        // Update publication count text if exists
        if (pubCountElement) {
            const count = publicationsData.length;
            const roundedCount = Math.floor(count / 10) * 10;
            pubCountElement.textContent = `+${roundedCount}`;
        }

        // If no list present (index page), we are done here
        if (!publicationsList) return;

        // SORT DATA: Newest to oldest (Descending by Year)
        const sorted = [...publicationsData].sort((a, b) => {
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            return yearB - yearA;
        });

        publicationsList.innerHTML = '';

        sorted.forEach(pub => {
            const hasUrl = pub.url && pub.url.length > 5;
            const pubItem = document.createElement(hasUrl ? 'a' : 'div');
            pubItem.className = 'publication-item apa-style';

            if (hasUrl) {
                pubItem.href = pub.url;
                pubItem.target = '_blank';
                pubItem.title = lang === 'en' ? 'View original publication' : 'Ver publicación original';
                pubItem.style.textDecoration = 'none';
                pubItem.style.display = 'block';
                pubItem.style.color = 'inherit';
            }

            // Function to highlight Manuel Castillo's name in bold
            const formatAuthors = (authorsStr) => {
                const searchNames = [
                    "Castillo Silva, Manuel Ignacio",
                    "Castillo, Manuel I.",
                    "Castillo, Manuel I",
                    "Castillo, Manuel",
                    "Castillo, M. I.",
                    "Castillo M. I.",
                    "Castillo, M.I."
                ];

                let formatted = authorsStr;
                for (const name of searchNames) {
                    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(${escapedName})`, 'gi');
                    if (regex.test(formatted)) {
                        formatted = formatted.replace(regex, '<strong>$1</strong>');
                        break; // Stop after the first match to avoid multiple boldings
                    }
                }
                return formatted;
            };

            pubItem.innerHTML = `
                <div class="apa-entry">
                    <span class="apa-authors">${formatAuthors(pub.authors)}</span>
                    <span class="apa-year"> (${pub.year || 'n.d.'}).</span>
                    <span class="apa-title"> ${pub.title}.</span>
                    <span class="apa-journal"> <i>${pub.journal}</i>.</span>
                </div>
            `;

            publicationsList.appendChild(pubItem);
        });
    };

    renderPublications();

    // Listen for language changes to re-render (mostly for tooltips if they existed, or count labels)
    document.addEventListener('languageChanged', renderPublications);
});
