console.log("Hello, world");
const root = document.documentElement;

const fretboard = document.querySelector('.fretboard');
const selectedInstrumentSelector = document.querySelector('#instrument-selector');
const accidentalSelector = document.querySelector('.accidental-selector')
const numberOfFretsSelector = document.querySelector('#number-of-frets');
const showAllNotesSelector = document.querySelector('#show-all-notes');
const showSameNotesSelector = document.querySelector('#show-same-notes')
const noteNameSection = document.querySelector('.note-name-section')
let numberOfFrets = 24;
const singleFretmarkPositions = [3, 5, 7, 9, 15, 17, 19, 21, 27, 29];
const doubleFretmarkPositions = [12, 24];
let accidental = "flat";
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const instrumentTuningPresets = {
    "Guitar": [4, 11, 7, 2, 9, 4],
    "Bass": [7, 2, 9, 4], 
    "Ukulele": [9, 4, 0, 7]
};
let selectedInstrument = "Guitar";
let numberOfString = instrumentTuningPresets[selectedInstrument].length;
let showAllNotes = false;
let showSameNotes = false;
let allNotesName;

const app = {
    init() {
        this.setupFretboard();
        this.setupSelectedInstrumentSelector();
        this.setupEventListener();
        this.setupNoteNameSection();
    },
    setupFretboard() {
        fretboard.innerHTML = '';
        root.style.setProperty('--number-of-strings', numberOfString);
        // Add string to fretboard
        for(let i = 0; i < numberOfString; i++) {
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string); 
            // console.log("String number: ", i);
            // Create frets
            // Create the 0 fret also
            for(let fret = 0; fret <= numberOfFrets; fret++) {
                let noteFret = tools.createElement('div');
                noteFret.classList.add('note-fret');
                string.appendChild(noteFret);
                let noteName = this.generateNoteName((instrumentTuningPresets[selectedInstrument][i] + fret), accidental);
                // console.log("Note name of fret ",fret, noteName);
                noteFret.setAttribute('data-note', noteName);
                // Add single fretmark
                if (i === 0 && singleFretmarkPositions.indexOf(fret) !== -1) {
                    noteFret.classList.add('single-fretmark');
                }
                // Add double fretmark
                if (i === 0 && doubleFretmarkPositions.indexOf(fret) !== -1) {
                    let doubleFretmark = tools.createElement('div');
                    doubleFretmark.classList.add('double-fretmark');
                    noteFret.appendChild(doubleFretmark);
                }
            }
        }
        allNotesName = document.querySelectorAll('.note-fret');
    },
    generateNoteName(noteIndex, accidentals) {
        noteIndex = noteIndex % 12;
        let noteName;
        if(accidentals === 'flat') {
            noteName = notesFlat[noteIndex];
        }
        else if (accidentals === 'sharp') {
            noteName = notesSharp[noteIndex]
        }
        return noteName;
    },
    setupSelectedInstrumentSelector() {
        for(instrument in instrumentTuningPresets) {
            console.log(instrument);
            let instrumentOption = tools.createElement('option', instrument);
            selectedInstrumentSelector.appendChild(instrumentOption);
        }
    },
    setupNoteNameSection() {
        noteNameSection.innerHTML = '';
        let noteNames;
        if(accidental === 'flat') {
            noteNames = notesFlat;
        }
        else if (accidental === 'sharp') {
            noteNames = notesSharp;
        }
        noteNames.forEach((noteName) => {
            let noteNameElement = tools.createElement('span', noteName);
            noteNameSection.appendChild(noteNameElement);
        })
    },
    showNoteName(event, opacity) {            
        if (event.target.classList.contains('note-fret')) {
            if(showSameNotes) {
                app.toggleSameNote(event.target.dataset.note, 1);
            }
            else {
                event.target.style.setProperty('--note-name-opacity', opacity);
            }
        }
    },
    hideNoteName(event) {
        if(showSameNotes) {
            app.toggleSameNote(event.target.dataset.note, 0);
        }
        else {
            event.target.style.setProperty('--note-name-opacity', 0);
        }
        
    },
    toggleSameNote(noteName, opacity) {
        // console.log(allNotesName);
        for(let i = 0; i < allNotesName.length; i++) {
            if(allNotesName[i].dataset.note === noteName) {
                allNotesName[i].style.setProperty('--note-name-opacity', opacity);
            }
        }
    },
    setupEventListener() {
        fretboard.addEventListener('mouseover', this.showNoteName);
        fretboard.addEventListener('mouseout', this.hideNoteName);

        selectedInstrumentSelector.addEventListener('change', (event) => {
            selectedInstrument = event.target.value;
            numberOfString = instrumentTuningPresets[selectedInstrument].length;
            this.setupFretboard();
        });

        accidentalSelector.addEventListener('click', (event) => {
            if (event.target.classList.contains('acci-select')) {
                accidental = event.target.value;
                console.log(accidental);
                this.setupFretboard();
                this.setupNoteNameSection();
            }
            else {
                return;
            }
        });
        numberOfFretsSelector.addEventListener('change', () => {
            numberOfFrets = numberOfFretsSelector.value;
            this.setupFretboard();
        });
        showAllNotesSelector.addEventListener('change', () => {
            if (showAllNotesSelector.checked) {
                showAllNotes = !showAllNotes;
                console.log("Show all notes: ", showAllNotes);
                root.style.setProperty('--note-name-opacity', 0.8);
                fretboard.removeEventListener('mouseover', this.showNoteName);
                fretboard.removeEventListener('mouseout', this.hideNoteName);
                this.setupFretboard();
            }
            else {
                showAllNotes = !showAllNotes;
                console.log("Show all notes: ", showAllNotes);
                root.style.setProperty('--note-name-opacity', 0);
                fretboard.addEventListener('mouseover', this.showNoteName);
                fretboard.addEventListener('mouseout', this.hideNoteName);
                this.setupFretboard();
            }
        });
        showSameNotesSelector.addEventListener('change', () => {
            showSameNotes = !showSameNotes;
            console.log("Show same notes: ", showSameNotes);
        });
        noteNameSection.addEventListener('mouseover', (event) => {
            let noteToShow = event.target.innerText;
            app.toggleSameNote(noteToShow, 0.8);
        })
        noteNameSection.addEventListener('mouseout', (event) => {
            if (!showAllNotesSelector.checked) {
                let noteToShow = event.target.innerText;
                app.toggleSameNote(noteToShow, 0);
            }
            else {
                return;
            }
        })
    }
}

const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
}

app.init();