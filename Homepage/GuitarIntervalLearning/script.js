// console.log("Hello, world");
const root = document.documentElement;

const fretboard = document.querySelector('.fretboard');
const instrumentSelector = document.querySelector('#instrument-selector');
const accidentalSelector = document.querySelector('.accidental-selector')
const numberOfFretsSelector = document.querySelector('#number-of-frets');
const showAllNotesSelector = document.querySelector('#show-all-notes');
const showSameNotesSelector = document.querySelector('#show-same-notes')
const noteNameSection = document.querySelector('.note-name-section')
const minor2ndSelector = document.querySelector('#minor-2nd');
const major2ndSelector = document.querySelector('#major-2nd');
const minor3rdSelector = document.querySelector('#minor-3rd');
const major3rdSelector = document.querySelector('#major-3rd');
const perfect4thSelector = document.querySelector('#perfect-4th');
const tritoneSelector = document.querySelector('#tritone');
const perfect5thSelector = document.querySelector('#perfect-5th');
const minor6thSelector = document.querySelector('#minor-6th');
const major6thSelector = document.querySelector('#major-6th');
const minor7thSelector = document.querySelector('#minor-7th');
const major7thSelector = document.querySelector('#major-7th');
let numberOfFrets = 12;
const rootNoteColor = '#A52422';
// original
const intervalNoteColor = '#E05263';
const intervalButtonBackgroundColor = '#2D3142';
const intervalButtonFontColor = '#D3D3D3';
// temp
// const intervalNoteColor = '#D27F89';
const singleFretmarkPositions = [3, 5, 7, 9, 15, 17, 19, 21, 27, 29];
const doubleFretmarkPositions = [12, 24];
let accidental = "flat";
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const instrumentTuningPresets = {
    "Guitar": [4, 11, 7, 2, 9, 4],
    "Bass": [7, 2, 9, 4], 
    "Bass (5 strings)": [7, 2, 9, 4, 11], 
    "Ukulele": [9, 4, 0, 7]
};
let selectedInstrument = "Guitar";
let numberOfString = instrumentTuningPresets[selectedInstrument].length;
let showAllNotes = false;
let showSameNotes = true;
let allNotesName;

let minor2nd = false;
let major2nd = false;
let minor3rd = false;
let major3rd = false;
let perfect4th = false;
let tritone = false;
let perfect5th = false;
let minor6th = false;
let major6th = false;
let minor7th = false;
let major7th = false;

const app = {
    init() {
        this.setupFretboard();
        this.setupSelectedInstrumentSelector();
        this.setupEventListener();
        this.setupNoteNameSection();
        showSameNotes = true;
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
            // console.log(instrument);
            let instrumentOption = tools.createElement('option', instrument);
            instrumentSelector.appendChild(instrumentOption);
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
    showIntervalNoteName(rootNoteName, opacity, color) {
        if (minor2nd) {
            if( accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let minor2ndNoteIndex = (noteIndex + 1) % 12;
                // app.toggleSameNote(notesSharp[minor2ndNoteIndex], opacity);
                app.toggleSameIntervalNote(notesSharp[minor2ndNoteIndex], opacity, color);
            }
            else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let minor2ndNoteIndex = (noteIndex + 1) % 12;
                // app.toggleSameNote(notesFlat[minor2ndNoteIndex], opacity);
                app.toggleSameIntervalNote(notesFlat[minor2ndNoteIndex], opacity, color);
            }
        }
        if (major2nd) {
            if (accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let major2ndNoteIndex = (noteIndex + 2) % 12;
                app.toggleSameIntervalNote(notesSharp[major2ndNoteIndex], opacity, color);
            } else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let major2ndNoteIndex = (noteIndex + 2) % 12;
                app.toggleSameIntervalNote(notesFlat[major2ndNoteIndex], opacity, color);
            }
        }
        if (minor3rd) {
            if (accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let minor3rdNoteIndex = (noteIndex + 3) % 12;
                app.toggleSameIntervalNote(notesSharp[minor3rdNoteIndex], opacity, color);
            } else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let minor3rdNoteIndex = (noteIndex + 3) % 12;
                app.toggleSameIntervalNote(notesFlat[minor3rdNoteIndex], opacity, color);
            }
        }
        
        if (major3rd) {
            if (accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let major3rdNoteIndex = (noteIndex + 4) % 12;
                app.toggleSameIntervalNote(notesSharp[major3rdNoteIndex], opacity, color);
            } else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let major3rdNoteIndex = (noteIndex + 4) % 12;
                app.toggleSameIntervalNote(notesFlat[major3rdNoteIndex], opacity, color);
            }
        }
        
        if (perfect4th) {
            if (accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let perfect4thNoteIndex = (noteIndex + 5) % 12;
                app.toggleSameIntervalNote(notesSharp[perfect4thNoteIndex], opacity, color);
            } else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let perfect4thNoteIndex = (noteIndex + 5) % 12;
                app.toggleSameIntervalNote(notesFlat[perfect4thNoteIndex], opacity, color);
            }
        }
        
        if (tritone) {
            if (accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let tritoneNoteIndex = (noteIndex + 6) % 12;
                app.toggleSameIntervalNote(notesSharp[tritoneNoteIndex], opacity, color);
            } else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let tritoneNoteIndex = (noteIndex + 6) % 12;
                app.toggleSameIntervalNote(notesFlat[tritoneNoteIndex], opacity, color);
            }
        }
        
        if (perfect5th) {
            if (accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let perfect5thNoteIndex = (noteIndex + 7) % 12;
                app.toggleSameIntervalNote(notesSharp[perfect5thNoteIndex], opacity, color);
            } else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let perfect5thNoteIndex = (noteIndex + 7) % 12;
                app.toggleSameIntervalNote(notesFlat[perfect5thNoteIndex], opacity, color);
            }
        }
        
        if (minor6th) {
            if (accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let minor6thNoteIndex = (noteIndex + 8) % 12;
                app.toggleSameIntervalNote(notesSharp[minor6thNoteIndex], opacity, color);
            } else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let minor6thNoteIndex = (noteIndex + 8) % 12;
                app.toggleSameIntervalNote(notesFlat[minor6thNoteIndex], opacity, color);
            }
        }
        
        if (major6th) {
            if (accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let major6thNoteIndex = (noteIndex + 9) % 12;
                app.toggleSameIntervalNote(notesSharp[major6thNoteIndex], opacity, color);
            } else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let major6thNoteIndex = (noteIndex + 9) % 12;
                app.toggleSameIntervalNote(notesFlat[major6thNoteIndex], opacity, color);
            }
        }
        
        if (minor7th) {
            if (accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let minor7thNoteIndex = (noteIndex + 10) % 12;
                app.toggleSameIntervalNote(notesSharp[minor7thNoteIndex], opacity, color);
            } else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let minor7thNoteIndex = (noteIndex + 10) % 12;
                app.toggleSameIntervalNote(notesFlat[minor7thNoteIndex], opacity, color);
            }
        }
        
        if (major7th) {
            if (accidental === 'sharp') {
                let noteIndex = notesSharp.indexOf(rootNoteName);
                let major7thNoteIndex = (noteIndex + 11) % 12;
                app.toggleSameIntervalNote(notesSharp[major7thNoteIndex], opacity, color);
            } else if (accidental === 'flat') {
                let noteIndex = notesFlat.indexOf(rootNoteName);
                let major7thNoteIndex = (noteIndex + 11) % 12;
                app.toggleSameIntervalNote(notesFlat[major7thNoteIndex], opacity, color);
            }
        }        
    },
    showNoteName(event, opacity) {            
        if (event.target.classList.contains('note-fret')) {
            if (showSameNotes) {
                app.toggleSameNote(event.target.dataset.note, 1);
                // Set interval
                app.showIntervalNoteName(event.target.dataset.note, 1, intervalNoteColor);
            }
            else {
                event.target.style.setProperty('--note-name-opacity', opacity);
            }
        }
    },
    hideNoteName(event) {
        if (showSameNotes) {
            app.toggleSameNote(event.target.dataset.note, 0);
            // Set interval
                app.showIntervalNoteName(event.target.dataset.note, 0, rootNoteColor);
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
    toggleSameIntervalNote(noteName, opacity, color) {
        // console.log(allNotesName);
        for(let i = 0; i < allNotesName.length; i++) {
            if(allNotesName[i].dataset.note === noteName) {
                allNotesName[i].style.setProperty('--note-name-opacity', opacity);
                allNotesName[i].style.setProperty('--note-name-color', color);
            }
        }
    },
    setSelectedInstrument(event) {
        selectedInstrument = event.target.value;
        numberOfString = instrumentTuningPresets[selectedInstrument].length;
        app.setupFretboard();
    },
    setAccidental(event) {
        if (event.target.classList.contains('acci-select')) {
            accidental = event.target.value;
            // console.log(accidental);
            app.setupFretboard();
            app.setupNoteNameSection();
        }
        else {
            return;
        }
    },
    setupEventListener() {
        fretboard.addEventListener('mouseover', this.showNoteName);
        fretboard.addEventListener('mouseout', this.hideNoteName);
        instrumentSelector.addEventListener('change', this.setSelectedInstrument);
        accidentalSelector.addEventListener('click', this.setAccidental);
        numberOfFretsSelector.addEventListener('change', () => {
            numberOfFrets = numberOfFretsSelector.value;
            this.setupFretboard();
        });
        showAllNotesSelector.addEventListener('change', () => {
            if (showAllNotesSelector.checked) {
                showAllNotes = !showAllNotes;
                // console.log("Show all notes: ", showAllNotes);
                root.style.setProperty('--note-name-opacity', 0.8);
                fretboard.removeEventListener('mouseover', this.showNoteName);
                fretboard.removeEventListener('mouseout', this.hideNoteName);
                this.setupFretboard();
            }
            else {
                showAllNotes = !showAllNotes;
                // console.log("Show all notes: ", showAllNotes);
                root.style.setProperty('--note-name-opacity', 0);
                fretboard.addEventListener('mouseover', this.showNoteName);
                fretboard.addEventListener('mouseout', this.hideNoteName);
                this.setupFretboard();
            }
        });
        // showSameNotesSelector.addEventListener('change', () => {
        //     showSameNotes = !showSameNotes;
        //     console.log("Show same notes: ", showSameNotes);
        // });
        noteNameSection.addEventListener('mouseover', (event) => {
            if(event.target.tagName === 'SPAN') {
                // console.log('in');
                let noteToShow = event.target.innerText;
                app.toggleSameNote(noteToShow, 1);
                app.showIntervalNoteName(noteToShow, 1, intervalNoteColor);
            }
        });
        noteNameSection.addEventListener('mouseout', (event) => {
            if(event.target.tagName === 'SPAN') {
                // console.log('out');
                if (!showAllNotesSelector.checked) {
                    let noteToShow = event.target.innerText;
                    app.toggleSameNote(noteToShow, 0);
                    app.showIntervalNoteName(noteToShow, 0, rootNoteColor);
                }
                else {
                    return;
                }
            }
        });
        minor2ndSelector.addEventListener('change', () => {
            minor2nd = !minor2nd;
            // console.log(minor2nd);
        });
        major2ndSelector.addEventListener('change', () => {
            major2nd = !major2nd;
            // console.log('Major 2nd:', major2nd);
        });
        minor3rdSelector.addEventListener('change', () => {
            minor3rd = !minor3rd;
            // console.log('Minor 3rd:', minor3rd);
        });
        major3rdSelector.addEventListener('change', () => {
            major3rd = !major3rd;
            // console.log('Major 3rd:', major3rd);
        });
        perfect4thSelector.addEventListener('change', () => {
            perfect4th = !perfect4th;
            // console.log('Perfect 4th:', perfect4th);
        });
        tritoneSelector.addEventListener('change', () => {
            tritone = !tritone;
            // console.log('Tritone:', tritone);
        });
        perfect5thSelector.addEventListener('change', () => {
            perfect5th = !perfect5th;
            // console.log('Perfect 5th:', perfect5th);
        });
        minor6thSelector.addEventListener('change', () => {
            minor6th = !minor6th;
            // console.log('Minor 6th:', minor6th);
        });
        major6thSelector.addEventListener('change', () => {
            major6th = !major6th;
            // console.log('Major 6th:', major6th);
        });
        minor7thSelector.addEventListener('change', () => {
            minor7th = !minor7th;
            // console.log('Minor 7th:', minor7th);
        });
        major7thSelector.addEventListener('change', () => {
            major7th = !major7th;
            // console.log('Major 7th:', major7th);
        });
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