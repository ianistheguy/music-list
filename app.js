// Music class
class Music {
    constructor(title, artist, genre) {
        this.title = title;
        this.artist = artist;
        this.genre = genre;
    }
}

// UI class
class UI {
    static displayMusic() {
        const music = Store.getMusic();

        music.forEach((cd) => UI.addCDtoList(cd));
    }

    static addCDtoList(cd) {
        const list = document.getElementById('music-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${cd.artist}</td>
            <td>${cd.title}</td>
            <td>${cd.genre}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `

        list.appendChild(row);
    }

    static deleteMusic(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.getElementById('music-form');
        container.insertBefore(div, form);

        // vanish after 3 seconds (3000 milliseconds)
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('artist').value = '';
        document.getElementById('genre').value = '';

        document.getElementById('title').focus();
    }
}

// Store class
class Store {
    static getMusic() {
        let albums;
        if(localStorage.getItem('albums') === null) {
            albums = [];
        } else {
            albums = JSON.parse(localStorage.getItem('albums'));
        }

        return albums;
    }

    static addMusic(cd) {
        const albums = Store.getMusic();

        albums.push(cd);

        localStorage.setItem('albums', JSON.stringify(albums));
    }

    static removeMusic(genre) {
        const albums = Store.getMusic();

        albums.forEach((cd, index) => {
            if(cd.genre === genre) {
                albums.splice(index, 1);
            }
        });

        localStorage.setItem('albums', JSON.stringify(albums));
    }
}

// Event to display music
document.addEventListener('DOMContentLoaded', UI.displayMusic);

// Event to add music
document.querySelector('#music-form').addEventListener('submit', (e) => {
    
    //Prevent actual default
    e.preventDefault();
    
    // Retrieve values from form
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const genre = document.getElementById('genre').value;

    // Validation
    if(title === '' || artist === '' || genre === '') {
        UI.showAlert('Please fill in the required fields.', 'danger');
    } else {
        // Instantiate music
        const album = new Music(title, artist, genre);

        // Add music to UI
        UI.addCDtoList(album);

        // Add music to Store class
        Store.addMusic(album);

        // Show success message
        UI.showAlert('Album added!', 'primary')

        // Clear fields
        UI.clearFields();
    }
})

// Event to remove music

document.querySelector('#music-list').addEventListener('click', (e) => {
    // Remove music from UI
    UI.deleteMusic(e.target);

    // Remove music from Store class
    Store.removeMusic(e.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Album removed!', 'primary')
})