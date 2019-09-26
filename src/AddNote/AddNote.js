import React, { Component } from 'react'
import { format } from 'date-fns'
import ApiContext from '../ApiContext';
import NotefulForm from '../NotefulForm/NotefulForm'
import ValidationError from './ValidationError';
import config from '../config'
import PropTypes from 'prop-types'


export default class AddNote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            noteName: '',
            noteContent: '',
            folder: '',
            folderId: '',
            validNoteMessage: '',
            validNoteName: false,
            validContentMessage: '',
            validContent: false,
            validFolderMessage: '',
            validFolder: false,
            datetime: new Date()
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    static defaultProps = {
        history: {
            push: () => { }
        },
    }

    static contextType = ApiContext;

    updateNoteName(name) {
        this.setState({ noteName: name }, () => { this.validateNoteName(name) })
    }

    updateNoteContent(content) {
        this.setState({ noteContent: content }, () => { this.validateNoteContent(content) })
    }

    updateFolder(name) {
        this.setState({ folder: name }, () => { this.validateFolder(name) })
    }

    validateFolder(folderId) {
        let errorMsg = this.state.validFolderMessage;
        let hasError = false;
        if (this.context.folders.find((folder) => folder.id === folderId) === undefined) {
            errorMsg = 'Please select a valid folder'
            hasError = true;
        }
        this.setState({
            validFolderMessage: errorMsg,
            validFolder: !hasError
        })
    }

    validateNoteName(name) {
        let errorMsg = this.state.validNoteMessage;
        let hasError = false;
        name = name.trim();
        if (name.length < 3) {
            errorMsg = 'Please enter a note name at least 3 characters long';
            hasError = true;
        }
        this.setState({
            validMessage: errorMsg,
            validNoteName: !hasError
        })
    }

    validateNoteContent(content) {
        let errorMsg = this.state.validContentMessage;
        let hasError = false;
        content = content.trim();
        if (content.length < 3) {
            errorMsg = 'Please enter content that is at least 3 characters long';
            hasError = true;
        }
        this.setState({
            validContentMessage: errorMsg,
            validContent: !hasError
        })
    }

    handleSubmit = function (e) {
        e.preventDefault()
        const newNote = {
            name: e.target['note-name'].value,
            content: e.target['note-content'].value,
            folderId: e.target['note-folder-id'].value,
            modified: new Date(),
        }
        this.validateFolder(newNote.folderId)
        this.validateNoteName(newNote.name)
        this.validateNoteContent(newNote.content)
        if (this.state.validFolder && this.state.validNoteName && this.state.validContent) {
            fetch(`${config.API_ENDPOINT}/notes`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(newNote),
            })
                .then(res => {
                    if (!res.ok)
                        return res.json().then(e => Promise.reject(e))
                    return res.json()
                })
                .then(note => {
                    this.context.addNote(note)
                    this.props.history.push(`/folder/${note.folderId}`)
                })
                .catch(error => {
                    console.error({ error })
                })
        }

    }



    render() {
        const { folders = [] } = this.context
        return (
            <section className='AddNote'>
                <h2>Create a note</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='note-name-input'>
                            Name
                        </label>
                        <input type='text' id='note-name-input' name='note-name' />
                        <ValidationError hasError={!this.state.validNoteName} message={this.state.validMessage} />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-content-input'>
                            Content
                        </label>
                        <textarea id='note-content-input' name='note-content' />
                        <ValidationError hasError={!this.state.validContent} message={this.state.validContentMessage} />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-folder-select'>
                            Folder
                        </label>
                        <select id='note-folder-select' name='note-folder-id'>
                            <option value={null}>...</option>
                            {folders.map(folder =>
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            )}
                        </select>
                        <ValidationError hasError={!this.state.validFolder} message={this.state.validFolderMessage} />
                    </div>
                    <div className='buttons'>
                        <button type='submit'>
                            Add note
            </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}

AddNote.defaultProps = {
    history: {
        push: () => []
    }
};


AddNote.propTypes = {
    folder: PropTypes.arrayOf(PropTypes.object),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,

    })
}