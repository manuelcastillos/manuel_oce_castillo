
const projectsData = [
    // --- VIGENTES ---
    {
        title: "Daily variability of the surface layer biogeochemistry and its impact on the greenhouse air-sea fluxes: physical and biological drivers off central Chile",
        code: "FONDECYT 1250709",
        fund: "FONDECYT",
        role: { es: "Co-investigador", en: "Co-Investigator" },
        period: "2025 - 2028",
        status: { es: "Vigente", en: "Ongoing" }
    },
    {
        title: "On the influence of local and remote oceanographic processes on deoxygenation, hypoxia, and anoxia in Patagonian fjords",
        code: "FONDECYT 1251038",
        fund: "FONDECYT",
        role: { es: "Co-investigador", en: "Co-Investigator" },
        period: "2025 - 2028",
        status: { es: "Vigente", en: "Ongoing" }
    },
    {
        title: "Respuestas morfológicas del mesozooplancton a la hidrografía y dinámica física del estrecho Bransfield durante primavera",
        code: "ID N° 3073-29-LQ25",
        fund: "CONA – SHOA",
        role: { es: "Co-investigador", en: "Co-Investigator" },
        period: "2025 - 2028",
        status: { es: "Vigente", en: "Ongoing" }
    },
    {
        title: "¿FORMAS MÁS SIMPLES, INDIVIDUOS MÁS RÁPIDOS? INFLUENCIA DE LA VARIACIÓN FENOTÍPICA EN EL CRECIMIENTO SOMÁTICO DE LAVAS DE PECES MARINOS, Y SU RELACIÓN CON LAS CONDICICAS OCEANOGRÁFICAS",
        code: "CIMAR 28",
        fund: "Comite Oceanografico Nacional",
        role: { es: "Coinvestigador(a)", en: "Co-Investigator" },
        period: "2022 - 2026",
        status: { es: "Vigente", en: "Ongoing" }
    },
    {
        title: "Can glaciers melt influence diversity of zooplankton at taxonomic, functional and morphologic",
        code: "RT_05-25",
        fund: "INACH",
        role: { es: "Co-investigador", en: "Co-Investigator" },
        period: "2025 - 2029",
        status: { es: "Vigente", en: "Ongoing" }
    },
    {
        title: "Uso de drones, biotelemetría y 'animalborne ocean sensors' para estudiar el océano austral y sus predadores marinos",
        code: "FOVI250069",
        fund: "ANID",
        role: { es: "Investigador Asociado", en: "Associate Researcher" },
        period: "2025 - 2026",
        status: { es: "Vigente", en: "Ongoing" }
    },
    {
        title: "Seals as Dynamic ocean observers: assesing coastal oceanographic changes in southern Chile with animal-borne instruments",
        code: "ATE220033",
        fund: "ANID - ANILLO",
        role: { es: "Investigador Principal", en: "Principal Investigator" },
        period: "2022 - 2026",
        status: { es: "Vigente", en: "Ongoing" }
    },
    {
        title: "Center for Ocean Technology and Instrumentation",
        code: "CCSS210020",
        fund: "ANID - EQUIPAMIENTO CIENTIFICO",
        role: { es: "Investigador(a)", en: "Researcher" },
        period: "2022 - 2025",
        status: { es: "Vigente", en: "Ongoing" }
    },
    {
        title: "Centro de Observación Marina para estudios de Riesgos del Ambiente Costero (COSTA-R)",
        code: "CIDI Nº12",
        fund: "Universidad de Valparaíso",
        role: { es: "Director(a)", en: "Director" },
        period: "2018 - 2026",
        status: { es: "Vigente", en: "Ongoing" },
        link: "https://costar.uv.cl/"
    },
    {
        title: "Impacto de la turbulencia/estratificación en la distribución de las masas de agua y sus propiedades físicoquímicas en los fiordos y canales australes",
        code: "3073-16-LQ24",
        fund: "CONA - SHOA",
        role: { es: "Co-investigador", en: "Co-Investigator" },
        period: "2024 - 2027",
        status: { es: "Vigente", en: "Ongoing" }
    },
    {
        title: "Influencia hidrográfica invernal en la morfología e historia de vida temprana de peces marinos del estrecho de Magallanes y canales fueguinos",
        code: "CONA C28 23-01",
        fund: "CONA - SHOA",
        role: { es: "Co-investigador", en: "Co-Investigator" },
        period: "2024 - 2027",
        status: { es: "Vigente", en: "Ongoing" }
    },
    {
        title: "Explorando al Límite de la Luz: Red Internacional de Ecología y Conservación de los Arrecifes Mesofóticos",
        code: "FOVI240014",
        fund: "ANID",
        role: { es: "Investigador Asociado", en: "Associate Researcher" },
        period: "2024 - 2025",
        status: { es: "Vigente", en: "Ongoing" }
    },

    // --- TERMINADOS ---
    {
        title: "Recent deoxygenation trend in the northern Patagonian fjord: Local drivers and connection to climate modes",
        code: "1211037",
        fund: "FONDECYT",
        role: { es: "Coinvestigador(a)", en: "Co-Investigator" },
        period: "2021 - 2024",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "Biophysical and biogeochemical interactions in semi-enclosed coastal systems: Developing synergies between marine research and higher education in Chile and Sweden",
        code: "CS2018-7929",
        fund: "ANID - COOPERACIÓN INTERNACIONAL",
        role: { es: "Investigador Responsable", en: "Responsible Investigator" },
        period: "2018 - 2024",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "Centro de Investigación Oceanográfica en el Pacífico Sur-Oriental",
        code: "AFB170006",
        fund: "ANID - EXCELENCIA EN INVESTIGACIÓN",
        role: { es: "Investigador(a)", en: "Researcher" },
        period: "2018 - 2022",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "A matter of size: Coupling early life history traits of Antarctic fishes and environmental forcing in a warming ocean",
        code: "RT08-18",
        fund: "INACH",
        role: { es: "Coinvestigador(a)", en: "Co-Investigator" },
        period: "2018 - 2022",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "SiVAR-Austral: Sistema de modelamiento de viento de alta resolución para la planificación de la actividad acuícola y marítima en la Zona Austral de Chile",
        code: "ID22I1026",
        fund: "FONDECYT",
        role: { es: "Investigador(a)", en: "Researcher" },
        period: "2022 - 2024",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "SISTEMA REMOLCADO PARA EL MONITOREO OCEANOGRÁFICO DE ZONAS COSTERAS: BAHIAS, ESTUARIOS Y FIORDOS (SIREMOL)",
        code: "170115",
        fund: "ANID - EQUIPAMIENTO CIENTIFICO",
        role: { es: "Investigador Principal", en: "Principal Investigator" },
        period: "2017 - 2019",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "WIND-DRIVEN EFFECTS ON THE CIRCULATION OF THE SOUTHERN PATAGONIAN FJORDS AND CHANNELS OF CHILE",
        code: "11160500",
        fund: "FONDECYT",
        role: { es: "Investigador Responsable", en: "Responsible Investigator" },
        period: "2016 - 2019",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "Procesos físicos de escala local y de mesoescala que favorecen la retención biológica en la bahía de Valparaíso",
        code: "791220005",
        fund: "ANID - ATRACCIÓN E INSERCIÓN",
        role: { es: "Investigador Principal", en: "Principal Investigator" },
        period: "2015 - 2016",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "Determinación de la presencia natural de aguas de bajo contenido de oxígeno disuelto, en zonas utilizadas para el cultivo de salmones. zona norpatagónica Chilena",
        code: "SUBPESCA",
        fund: "Subsecretaría de Pesca y Acuicultura",
        role: { es: "Investigador(a)", en: "Researcher" },
        period: "2015 - 2017",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "CIRCULACION Y MEZCLA AL INTERIOR DE LOS FIORDOS RELONCAVI (41.5°S) Y AYSEN (45.3°S): DESDE UNA PERSPECTIVA DINAMICA",
        code: "3130639",
        fund: "FONDECYT",
        role: { es: "Investigador Responsable", en: "Responsible Investigator" },
        period: "2012 - 2015",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "THE ROLE OF PHYSICAL PROCESSES ON THE DYNAMICS OF LOW-OXYGEN ZONES OFF SOUTH-CENTRAL CHILE",
        code: "1121041",
        fund: "FONDECYT",
        role: { es: "Personal técnico", en: "Technical Staff" },
        period: "2012 - 2015",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "CIRCULACIÓN Y MEZCLA EN EL MAR INTERIOR DE CHILOÉ C19F 13-07",
        code: "C19F 13-07",
        fund: "Comité Oceanográfico Nacional",
        role: { es: "Coinvestigador(a)", en: "Co-Investigator" },
        period: "2013 - 2016",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "FRONTAL MODIFICATION BY COMPLEX TOPOGRAPHY IN SOUTH-CENTRAL CHILE",
        code: "1110169",
        fund: "FONDECYT",
        role: { es: "Personal técnico", en: "Technical Staff" },
        period: "2011 - 2014",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "THE COASTAL TRANSITION ZONE JET OFF CHILE: DYNAMICS OF THE SEASONAL AND INTERANNUAL VARIABILITY",
        code: "1090791",
        fund: "FONDECYT",
        role: { es: "Personal técnico", en: "Technical Staff" },
        period: "2009 - 2012",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "Microbial Initiative in Low Oxygen areas off Concepcion and Oregon – Mi_LOCO project",
        code: "Moore Foundation",
        fund: "Gordon & Betty Moore Foundation",
        role: { es: "Personal técnico", en: "Technical Staff" },
        period: "2009 - 2012",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "Estudios oceanográficos y modelo de análisis de riesgo para el manejo integrado y sustentable del fiordo Aysén",
        code: "INNOVA-CORFO",
        fund: "INNOVA-CORFO",
        role: { es: "Personal técnico", en: "Technical Staff" },
        period: "2009 - 2011",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "Evaluación de la capacidad de carga del estuario de Reloncaví, X Región. Relevante para el manejo sustentable de la industria del salmón.",
        code: "SUBPESCA",
        fund: "Subsecretaría de Pesca y Acuicultura",
        role: { es: "Investigador(a)", en: "Researcher" },
        period: "2008 - 2009",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "Frente de marea en el paso Desertores en invierno-Primavera",
        code: "CONA",
        fund: "Comité Oceanográfico Nacional",
        role: { es: "Coinvestigador(a)", en: "Co-Investigator" },
        period: "2005 - 2010",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "STUDY OF INFLUENCE OF THE EXTRATROPICAL PLANETARY WAVES ON THE LOW-FREQUENCY FLUCTUATIONS OF THE PERU-CHILE CURRENT SYSTEM",
        code: "1020294",
        fund: "FONDECYT",
        role: { es: "Tesista", en: "Thesis Student" },
        period: "2002 - 2004",
        status: { es: "Terminado", en: "Completed" }
    },
    {
        title: "Experimento de Circulación Oceánica y Costera, para el apoyo de la gestión integrada del manejo costero",
        code: "SHOA",
        fund: "Servicio Hidrográfico y Oceanográfico de la Armada",
        role: { es: "Coinvestigador(a)", en: "Co-Investigator" },
        period: "2000 - 2004",
        status: { es: "Terminado", en: "Completed" }
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const projectsList = document.getElementById('projects-list-full');
    if (!projectsList) return;

    const renderProjects = () => {
        const lang = (window.i18n && window.i18n.currentLang) || 'es';
        projectsList.innerHTML = '';

        const sorted = [...projectsData].sort((a, b) => {
            if (a.status.es !== b.status.es) return a.status.es === 'Vigente' ? -1 : 1;

            const getEndYear = (p) => parseInt(p.period.split(' - ')[1]) || parseInt(p.period.split(' - ')[0]) || 0;
            const getStartYear = (p) => parseInt(p.period.split(' - ')[0]) || 0;

            if (getEndYear(b) !== getEndYear(a)) {
                return getEndYear(b) - getEndYear(a);
            }
            return getStartYear(b) - getStartYear(a);
        });

        sorted.forEach(project => {
            const statusLabel = project.status[lang];
            const roleLabel = project.role[lang];
            const statusClass = project.status.es === 'Vigente' ? 'vigente' : 'terminado';

            const card = document.createElement('div');
            card.className = `project-full-card ${statusClass}`;

            const linkHtml = project.link ? `<a href="${project.link}" target="_blank" class="project-link-btn">${lang === 'en' ? 'Visit Site' : 'Visitar Sitio'} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : '';

            card.innerHTML = `
                <div class="project-info">
                    <div class="project-header">
                        <span class="project-label">${project.fund} | ${project.code}</span>
                        <span class="status-tag ${statusClass}">${statusLabel}</span>
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-meta">
                        <p><strong>${lang === 'en' ? 'Role' : 'Rol'}:</strong> ${roleLabel}</p>
                        <p><strong>${lang === 'en' ? 'Period' : 'Periodo'}:</strong> ${project.period}</p>
                    </div>
                    ${linkHtml}
                </div>
            `;
            projectsList.appendChild(card);
        });
    };

    renderProjects();

    // Listen for language changes
    document.addEventListener('languageChanged', renderProjects);
});
