// Carica i dati dal file JSON
fetch('data/data.json')
.then(response => response.json())
.then(data => {
    // Crea una mappa Leaflet
    var map = L.map('map').setView([41.8981, 12.4832], 13);

    // Aggiungi un tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Risorsa digitale associata a: Fiammetta Sabba, <em>Angelo Maria Bandini in viaggio a Roma (1780-1781)</em>, &copy;2019 FUP, Author(s), content <a href="http://creativecommons.org/licenses/by/4.0/legalcode">CC BY 4.0 International</a>, metadata <a href="https://creativecommons.org/publicdomain/zero/1.0/legalcode">CC0 1.0 Universal</a>, published by <a href="https://www.fupress.com/">Firenze University Press</a>, ISSN 2612-7709 (print), ISSN 2704-5889 (online), ISBN 978-88-6453-962-1 (print), ISBN 978-88-6453-963-8 (PDF), ISBN 978-88-9273-009-0 (XML), <a href="https://doi.org//10.36253/978-88-6453-963-8">DOI 10.36253/978-88-6453-963-8</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

        //overlayLayer con la mappa di Nolli da mapwarper
        var overlayLayer = L.tileLayer('http://mapwarper.net/maps/tile/9175/{z}/{x}/{y}.png', {
          maxZoom: 26,
          //opacity: 0.69
         }).addTo(map);
         
         // Aggiungi il gestore eventi per lo slider
         var slider = document.getElementById('opacity-range');
         slider.addEventListener('input', function () {
           var opacityValue = parseFloat(this.value); // Leggi il valore dello slider
           overlayLayer.setOpacity(opacityValue); // Imposta l'opacità del layer
         });
    
    // Array per memorizzare i marker
    var markers = [];

    // Crea i marker e aggiungili alla mappa
    data.features.forEach(function(feature) {
        var options = {
           //icon: 'leaf',
           iconshape: 'circle-dot',
           backgroundColor: feature.color,
           borderColor: "#000000",
        };

    var marker = L.marker([feature.Latitudine, feature.Longitudine], {
        icon: L.BeautifyIcon.icon(options)
     })
                    .bindPopup(
                        '<div><p><strong>Luogo visitato: </strong> '+ feature.LUOGO+'<br/>'+feature.DESC+'<br/><strong>Visitato in data: </strong>'+feature.EDTF+'<br/><strong>N° corrispondente sulla mappa di Giovanni Battista Nolli: </strong>'+feature.LinkNewNolli+'<br/><strong>Wikidata QID: </strong>'+feature.wikiLink +'<br/> <strong>Pagina dati.beniculturali.it: </strong>'+ feature.BBCC +'<br/>'+ '<br/>Immagine: <br/>'+feature.newImg+'</p>', {
                            maxWidth: "auto"
                        }).addTo(map);

     markers.push(marker);
 });

    // Gestisci i filtri per le date
    var filters = document.querySelectorAll('.dropdown-content a');
    filters.forEach(function(filter) {
        filter.onclick = function() {
            // Rimuovi la classe "active" da tutti i filtri
            filters.forEach(function(f) {
                f.classList.remove('active');
            });

            // Imposta il filtro attivo
            this.classList.add('active');

            // Ottieni la data selezionata dall'ID del filtro
            var selectedDate = this.id.split('_')[1].trim();

            // Filtra i marker in base alla data selezionata
            markers.forEach(function(marker) {
                var featureDate = marker.getPopup().getContent().split('data: </strong>')[1].split('<br/><strong>N° corri')[0].trim(); // Ottieni la data dalla descrizione del popup
                if (featureDate === selectedDate) {
                    marker.addTo(map);
                } else {
                    map.removeLayer(marker);
                }
            });

            return false;
        };
    });

    // Gestisci il pulsante di reset
    var resetFilter = document.getElementById('resetFilter');
    resetFilter.onclick = function() {
        // Rimuovi la classe "active" da tutti i filtri
        filters.forEach(function(filter) {
            filter.classList.remove('active');
        });

        // Resetta il filtraggio dei marker sulla mappa
        markers.forEach(function(marker) {
            map.addLayer(marker);
        });

        return false;
    };
})
.catch(error => console.error('Errore durante il caricamento dei dati:', error));