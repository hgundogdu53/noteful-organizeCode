import React from 'react';

export default class HandleError extends React.Component {
    state = { hasError: null };
    static getDerivedStateFromError(error) {

        console.error(error);

        this.setState({ hasError: error })
    }
    render() {
        if (this.state.hasError) {
            return (
                <main className="error-page">
                    <h1>Something is wrong.</h1>
                    <h2>Refresh the page.</h2>
                </main>
            )
        }
        return this.props.children
    }
}